import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { Upload, FileSpreadsheet, AlertTriangle, CheckCircle2 } from 'lucide-react';

function BulkAlumniImport() {
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

    setLoading(true);
    setError('');
    setResult(null);

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
      'CSE',
      '2022',
      'BTECH',
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
      const rows = response.data?.job?.rowErrors || [];

      if (!rows.length) {
        setError('No failed rows to export for this import job.');
        return;
      }

      const csvHeaders = ['row', 'rollNo', 'reason'];
      const csvLines = rows.map((r) => [r.row || '', r.rollNo || '', (r.reason || '').replace(/,/g, ';')]);
      const csv = [csvHeaders.join(','), ...csvLines.map((line) => line.join(','))].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
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
    <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Admin Import</p>
        <h2 className="text-2xl font-bold text-white">Bulk Alumni Registration</h2>
        <p className="text-sm text-slate-400 mt-1">
          Upload one batch Excel file, preview validation, then commit bulk registration.
        </p>
        <p className="text-xs text-slate-500 mt-2">
          If any optional value is blank in Excel, it is stored as blank and can be updated later from profile edit.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <label className="md:col-span-2 p-4 rounded-xl border border-dashed border-slate-700 bg-slate-900/70 cursor-pointer hover:border-cyan-500 transition">
          <div className="flex items-center gap-3 text-slate-300">
            <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
            <span>{file ? file.name : 'Select .xlsx file'}</span>
          </div>
          <input
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label>

        <input
          type="number"
          value={defaultBatch}
          onChange={(e) => setDefaultBatch(e.target.value)}
          placeholder="Year"
          className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
        />

        <select
          value={defaultBranch}
          onChange={(e) => setDefaultBranch(e.target.value)}
          className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
        >
          {['CSE', 'ECE', 'EE', 'MECH', 'CIVIL', 'IT', 'MBA', 'MCA', 'MTECH', 'OTHER'].map((branch) => (
            <option key={branch} value={branch}>{branch}</option>
          ))}
        </select>

        <select
          value={defaultCourse}
          onChange={(e) => setDefaultCourse(e.target.value)}
          className="md:col-span-4 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
        >
          <option value="BTECH">BTECH</option>
          <option value="MTECH">MTECH</option>
          <option value="MBA">MBA</option>
          <option value="MCA">MCA</option>
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

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      {preview && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Preview Summary</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
              <p className="text-xs text-slate-400">Valid Rows</p>
              <p className="text-2xl font-bold text-white">{preview.summary?.totalValidRows || 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
              <p className="text-xs text-slate-400">Error Rows</p>
              <p className="text-2xl font-bold text-amber-300">{preview.errorCount || 0}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-800 border border-slate-700">
              <p className="text-xs text-slate-400">Branches Found</p>
              <p className="text-2xl font-bold text-white">{Object.keys(preview.summary?.branches || {}).length}</p>
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
          <h3 className="text-lg font-semibold text-white">Recent Import History</h3>
          <button
            onClick={fetchHistory}
            className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-white"
          >
            Refresh
          </button>
        </div>
        {historyLoading ? (
          <p className="text-sm text-slate-400">Loading history...</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-slate-400">No import history yet.</p>
        ) : (
          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="min-w-full text-sm text-left text-slate-200">
              <thead className="bg-slate-800 text-xs uppercase tracking-wide text-slate-400">
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
              <tbody className="divide-y divide-slate-800">
                {history.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-800/50">
                    <td className="px-3 py-2">{new Date(job.createdAt).toLocaleString()}</td>
                    <td className="px-3 py-2">{job.fileName}</td>
                    <td className="px-3 py-2">{job.mode}</td>
                    <td className="px-3 py-2">{job.status}</td>
                    <td className="px-3 py-2">{job.summary?.totalValidRows || 0}</td>
                    <td className="px-3 py-2">{job.errorCount || 0}</td>
                    <td className="px-3 py-2">
                      <button
                        disabled={!job.errorCount}
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
