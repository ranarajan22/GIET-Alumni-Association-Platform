import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { Upload, FileSpreadsheet, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import { mergeCourseOptions, mergeBranchOptions, getCourseLabel, getBranchLabel } from '../../constants/courseCatalog';

function BulkAlumniImport({ theme = 'dark' }) {
  const [file, setFile] = useState(null);
  const [defaultCourse, setDefaultCourse] = useState('BTECH');
  const [defaultBatch, setDefaultBatch] = useState(new Date().getFullYear());
  const [defaultBranch, setDefaultBranch] = useState('CSE');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const isDark = theme === 'dark';

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(`${API_BASE_URL}/admin/import-history`, { headers });
      setHistory(response.data?.jobs || []);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const courseOptions = useMemo(() => mergeCourseOptions(), []);
  const branchOptions = useMemo(() => mergeBranchOptions(defaultCourse), [defaultCourse]);
  const selectedCourseLabel = useMemo(() => getCourseLabel(defaultCourse), [defaultCourse]);
  const selectedBranchLabel = useMemo(
    () => getBranchLabel(defaultCourse, defaultBranch),
    [defaultCourse, defaultBranch]
  );

  useEffect(() => {
    if (branchOptions.length && !branchOptions.some((branch) => branch.value === defaultBranch)) {
      setDefaultBranch(branchOptions[0].value);
    }
  }, [branchOptions, defaultBranch]);

  const buildFormData = () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('defaultCourse', defaultCourse);
    formData.append('defaultBatch', String(defaultBatch || ''));
    formData.append('defaultBranch', defaultBranch);
    return formData;
  };

  const runImport = async (mode) => {
    if (!file) {
      setError('Please select an Excel file first.');
      return;
    }

    if (!String(file.name || '').toLowerCase().endsWith('.xlsx')) {
      setError('Only .xlsx files are supported. Please save your sheet as .xlsx and upload again.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.post(
        `${API_BASE_URL}/admin/alumni-import?mode=${mode}`,
        buildFormData(),
        { headers }
      );

      if (mode === 'preview') setPreview(response.data);
      if (mode === 'commit') {
        setResult(response.data);
        setSuccessMessage({
          fileName: file.name,
          timestamp: new Date().toLocaleString(),
          imported: response.data.imported,
          errorCount: response.data.errorCount,
          summary: response.data.summary
        });
        // Auto-dismiss after 8 seconds
        setTimeout(() => setSuccessMessage(null), 8000);
      }
      await fetchHistory();
    } catch (err) {
      const backendMessage = err.response?.data?.message;
      if (!backendMessage && err.message === 'Network Error') {
        setError('Network Error: Upload request failed. Please verify backend is reachable and CORS/env settings are correct.');
      } else {
        setError(backendMessage || err.message || 'Import failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = (mode = 'required') => {
    const requiredHeaders = [
      'Roll No',
      'Name of the Alumni',
      'Branch',
      'Batch Pass Out',
      'Course',
      'D O B',
      'Email ID'
    ];

    const fullHeaders = [
      ...requiredHeaders,
      'Mobile',
      'Gender',
      'Date of Marriage',
      'University Registration Number',
      'Parents Mobile Number',
      'Personal Mail ID',
      'Father Name',
      'Mother Name',
      'Religion',
      'Higher Study',
      'Permanent Address',
      'Date of Visit',
      'Current Company',
      'Designation',
      'Current Location',
      'LinkedIn',
      'GitHub'
    ];

    const requiredSample = [
      '22CSE001',
      'Sample Alumni',
      defaultBranch,
      '2022',
      defaultCourse,
      '15/08/2000',
      '22cse001@giet.edu'
    ];

    const fullSample = [
      ...requiredSample,
      '9876543210',
      'M',
      '20/11/2025',
      '22CSE001',
      '9988776655',
      'sample.personal@gmail.com',
      'Ramesh Kumar',
      'Sita Kumar',
      'Hindu',
      'MTech',
      'Gunupur, Odisha',
      'NA',
      'Infosys',
      'Software Engineer',
      'Bengaluru',
      'https://www.linkedin.com/in/sample',
      'https://github.com/sample'
    ];

    const headers = mode === 'full' ? fullHeaders : requiredHeaders;
    const sample = mode === 'full' ? fullSample : requiredSample;
    const csvContent = `${headers.join(',')}\n${sample.join(',')}\n`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', mode === 'full' ? 'alumni_import_full_template.csv' : 'alumni_import_required_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportFailedRows = async (jobId, fileName) => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(`${API_BASE_URL}/admin/import-history/${jobId}`, { headers });
      const job = response.data?.job || {};
      const rows = Array.isArray(job.rowErrors) ? job.rowErrors : [];
      const fallbackRows = job.errorMessage ? [{ row: 0, rollNo: '', reason: job.errorMessage }] : [];
      const exportRows = rows.length ? rows : fallbackRows;

      if (!exportRows.length) {
        setError('No failed rows to export for this import job.');
        return;
      }

      const escapeCsv = (value) => {
        const text = String(value ?? '').replace(/\r?\n/g, ' ');
        return /[",]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
      };

      const csvHeaders = ['row', 'rollNo', 'reason'];
      const csvLines = exportRows.map((r) => [r.row || '', r.rollNo || '', r.reason || '']);
      const safeCsv = [csvHeaders.map(escapeCsv).join(','), ...csvLines.map((line) => line.map(escapeCsv).join(','))].join('\n');

      const blob = new Blob([safeCsv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${(fileName || 'import').replace(/\.[^.]+$/, '')}-failed-rows.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to export failed rows');
    }
  };

  return (
    <section className={isDark ? 'bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6' : 'bg-white border border-slate-200 rounded-2xl p-6 space-y-6 text-slate-900'}>
      <div>
        <p className={isDark ? 'text-xs uppercase tracking-[0.3em] text-slate-500' : 'text-xs uppercase tracking-[0.3em] text-slate-600'}>Admin Import</p>
        <h2 className={isDark ? 'text-2xl font-bold text-white' : 'text-2xl font-bold text-slate-900'}>Bulk Alumni Registration</h2>
        <p className={isDark ? 'text-sm text-slate-400 mt-1' : 'text-sm text-slate-600 mt-1'}>
          Upload one batch Excel file, preview validation, then commit bulk registration.
        </p>
        <p className={isDark ? 'text-xs text-slate-500 mt-2' : 'text-xs text-slate-600 mt-2'}>
          If any optional value is blank in Excel, it is stored as blank and can be updated later from profile edit.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <label className={isDark ? 'md:col-span-2 p-4 rounded-xl border border-dashed border-slate-700 bg-slate-900/70 cursor-pointer hover:border-cyan-500 transition' : 'md:col-span-2 p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 cursor-pointer hover:border-cyan-500 transition'}>
          <div className={isDark ? 'flex items-center gap-3 text-slate-300' : 'flex items-center gap-3 text-slate-700'}>
            <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
            <span>{file ? file.name : 'Select .xlsx file'}</span>
          </div>
          <input
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>

        <input
          type="number"
          value={defaultBatch}
          onChange={(e) => setDefaultBatch(e.target.value)}
          placeholder="Year"
          className={isDark ? 'px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500' : 'px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500'}
        />

        <select
          value={defaultCourse}
          onChange={(e) => setDefaultCourse(e.target.value)}
          className={isDark ? 'md:col-span-2 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500' : 'md:col-span-2 px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500'}
        >
          {courseOptions.map((course) => (
            <option key={course.value} value={course.value}>{course.label}</option>
          ))}
        </select>

        <select
          value={defaultBranch}
          onChange={(e) => setDefaultBranch(e.target.value)}
          className={isDark ? 'md:col-span-4 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500' : 'md:col-span-4 px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-cyan-500'}
        >
          {branchOptions.map((branch) => (
            <option key={branch.value} value={branch.value}>{branch.label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => downloadTemplate('required')}
          className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm font-semibold text-white"
        >
          Download Required Template
        </button>
        <button
          onClick={() => downloadTemplate('full')}
          className="px-4 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-600 text-sm font-semibold text-white"
        >
          Download Full Admin Template
        </button>
        <button
          onClick={() => runImport('preview')}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Processing...' : 'Preview Import'}
        </button>
        <button
          onClick={() => runImport('commit')}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm font-semibold text-white disabled:opacity-60 flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          {loading ? 'Processing...' : 'Commit Import'}
        </button>
      </div>

      <div className={isDark ? 'p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-sm text-slate-300' : 'p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700'}>
        <p className={isDark ? 'font-semibold text-white' : 'font-semibold text-slate-900'}>Selected import defaults</p>
        <p className="mt-1">Course: {selectedCourseLabel}</p>
        <p>Branch: {selectedBranchLabel}</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      {preview && (
        <div className="space-y-3">
          <h3 className={isDark ? 'text-lg font-semibold text-white' : 'text-lg font-semibold text-slate-900'}>Preview Summary</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className={isDark ? 'p-3 rounded-lg bg-slate-800 border border-slate-700' : 'p-3 rounded-lg bg-white border border-slate-200'}>
              <p className={isDark ? 'text-xs text-slate-400' : 'text-xs text-slate-600'}>Valid Rows</p>
              <p className={isDark ? 'text-2xl font-bold text-white' : 'text-2xl font-bold text-slate-900'}>{preview.summary?.totalValidRows || 0}</p>
            </div>
            <div className={isDark ? 'p-3 rounded-lg bg-slate-800 border border-slate-700' : 'p-3 rounded-lg bg-white border border-slate-200'}>
              <p className={isDark ? 'text-xs text-slate-400' : 'text-xs text-slate-600'}>Error Rows</p>
              <p className="text-2xl font-bold text-amber-300">{preview.errorCount || 0}</p>
            </div>
            <div className={isDark ? 'p-3 rounded-lg bg-slate-800 border border-slate-700' : 'p-3 rounded-lg bg-white border border-slate-200'}>
              <p className={isDark ? 'text-xs text-slate-400' : 'text-xs text-slate-600'}>Branches Found</p>
              <p className={isDark ? 'text-2xl font-bold text-white' : 'text-2xl font-bold text-slate-900'}>{Object.keys(preview.summary?.branches || {}).length}</p>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-100">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5" />
            <p className="font-semibold">Import Completed</p>
          </div>
          <p className="text-sm">Inserted: {result.imported?.inserted || 0}</p>
          <p className="text-sm">Updated: {result.imported?.updated || 0}</p>
          <p className="text-sm">Passwords Set: {result.imported?.passwordsSet || 0}</p>
          <p className="text-sm">Skipped/Errors: {result.errorCount || 0}</p>
          {result.imported?.yearTables && (
            <div className="mt-3 text-xs text-emerald-100/90 space-y-1">
              <p className="font-semibold">Year-wise tables:</p>
              {Object.entries(result.imported.yearTables).map(([year, tableInfo]) => (
                <p key={year}>
                  {tableInfo.collection}: total {tableInfo.totalRows}, inserted {tableInfo.inserted}, updated {tableInfo.updated}
                </p>
              ))}
            </div>
          )}
          <div className="mt-3 text-xs text-emerald-100/90">
            <p>Email notification: {result.notifications?.email?.configured ? (result.notifications?.email?.success ? 'sent' : 'failed') : 'not configured'}</p>
            <p>SMS notification: {result.notifications?.sms?.configured ? (result.notifications?.sms?.success ? 'sent' : 'failed') : 'not configured'}</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className={isDark ? 'text-lg font-semibold text-white' : 'text-lg font-semibold text-slate-900'}>Recent Import History</h3>
          <button
            onClick={fetchHistory}
            className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-white"
          >
            Refresh
          </button>
        </div>

        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/50 text-emerald-100 animate-pulse">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
              <p className="font-bold text-base">✓ Import Successful!</p>
            </div>
            <div className="grid sm:grid-cols-4 gap-3 text-sm mb-2">
              <div>
                <p className="text-emerald-300/70 text-xs">File</p>
                <p className="font-semibold text-emerald-100">{successMessage.fileName}</p>
              </div>
              <div>
                <p className="text-emerald-300/70 text-xs">Inserted</p>
                <p className="font-bold text-lg text-emerald-300">{successMessage.imported?.inserted || 0}</p>
              </div>
              <div>
                <p className="text-emerald-300/70 text-xs">Updated</p>
                <p className="font-bold text-lg text-emerald-300">{successMessage.imported?.updated || 0}</p>
              </div>
              <div>
                <p className="text-emerald-300/70 text-xs">Time</p>
                <p className="font-semibold text-emerald-100 text-xs">{successMessage.timestamp}</p>
              </div>
            </div>
            {successMessage.errorCount > 0 && (
              <div className="pt-2 border-t border-emerald-500/30 text-amber-300 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                <span>{successMessage.errorCount} error(s) detected - check "Export Failed Rows" below</span>
              </div>
            )}
          </div>
        )}

        {historyLoading ? (
          <p className={isDark ? 'text-sm text-slate-400' : 'text-sm text-slate-600'}>Loading history...</p>
        ) : history.length === 0 ? (
          <p className={isDark ? 'text-sm text-slate-400' : 'text-sm text-slate-600'}>No import history yet.</p>
        ) : (
          <div className={isDark ? 'overflow-x-auto border border-slate-800 rounded-xl' : 'overflow-x-auto border border-slate-200 rounded-xl'}>
            <table className={isDark ? 'min-w-full text-sm text-left text-slate-200' : 'min-w-full text-sm text-left text-slate-800'}>
              <thead className={isDark ? 'bg-slate-800 text-xs uppercase tracking-wide text-slate-400' : 'bg-slate-100 text-xs uppercase tracking-wide text-slate-600'}>
                <tr>
                  <th className="px-3 py-2">When</th>
                  <th className="px-3 py-2">File</th>
                  <th className="px-3 py-2">Mode</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Valid Rows</th>
                  <th className="px-3 py-2">Errors</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className={isDark ? 'divide-y divide-slate-800' : 'divide-y divide-slate-200'}>
                {history.map((job) => (
                  <tr key={job._id} className={isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                    <td className="px-3 py-2">{new Date(job.createdAt).toLocaleString()}</td>
                    <td className="px-3 py-2">{job.fileName}</td>
                    <td className="px-3 py-2">{job.mode}</td>
                    <td className="px-3 py-2">{job.status}</td>
                    <td className="px-3 py-2">{job.summary?.totalValidRows || 0}</td>
                    <td className="px-3 py-2">{job.errorCount || 0}</td>
                    <td className="px-3 py-2">
                      <button
                        disabled={!(Number(job.errorCount) > 0 || job.status === 'failed')}
                        onClick={() => exportFailedRows(job._id, job.fileName)}
                        className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-xs text-white"
                      >
                        Export Failed Rows
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default BulkAlumniImport;
