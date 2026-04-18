import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { Shield, AlertTriangle, Search, CalendarPlus, Eye, X, Trash2, EyeOff, ArrowUpDown } from 'lucide-react';
import { mergeCourseOptions, mergeBranchOptions, getCourseLabel, getBranchLabel } from '../../constants/courseCatalog';

const Alumni = ({ showAll = true }) => {
  const [alumniList, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [resetInfo, setResetInfo] = useState(null);
  const [visitInfo, setVisitInfo] = useState('');
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('admin');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const apiBase = API_BASE_URL;

  const makeAbsoluteUrl = (value) => {
    if (!value) return '';
    const lower = value.toLowerCase();
    if (lower.startsWith('http://') || lower.startsWith('https://')) return value;
    return `${apiBase}/${value.replace(/^\//, '')}`;
  };

  const formatDate = (value) => {
    if (!value) return '—';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return String(value);
    return parsed.toLocaleDateString();
  };

  const courseOptions = useMemo(() => mergeCourseOptions(alumniList.map((alumni) => alumni.course)), [alumniList]);
  const branchOptions = useMemo(
    () => mergeBranchOptions(courseFilter, alumniList.map((alumni) => alumni.branch || alumni.fieldOfStudy)),
    [courseFilter, alumniList]
  );

  const formatValue = (key, value, alumni) => {
    if (Array.isArray(value)) {
      return value.length ? value.map((entry) => formatDate(entry)).join(', ') : '—';
    }

    if (key === 'course') {
      return getCourseLabel(value);
    }

    if (key === 'branch') {
      return getBranchLabel(alumni.course, value || alumni.fieldOfStudy);
    }

    if (key === 'dob' || key === 'dateOfMarriage' || key === 'createdAt' || key === 'updatedAt') {
      return formatDate(value);
    }

    if (key === 'verified' || key === 'passwordResetRequired') {
      return value ? 'Yes' : 'No';
    }

    if (value === null || value === undefined || value === '') {
      return '—';
    }

    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }

    return String(value);
  };

  // Fetch the alumni data
  const fetchAlumni = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      console.log('Fetching alumni from:', `${apiBase}/admin/alumni`, 'with token:', !!token);
      const response = await axios.get(`${apiBase}/admin/alumni`, { headers });
      
      // Log the full response to check the structure
      console.log('Alumni API Response:', response.data);
      
      // Check if the alumni data exists and is an array
      const alumniData = response.data && Array.isArray(response.data.alumni) ? response.data.alumni : (Array.isArray(response.data) ? response.data : []);
      
      // If alumniData is an array, always show full admin list
      if (alumniData.length > 0) {
        setAlumni(alumniData);
      } else {
        console.log('No alumni found');
        setAlumni([]);
      }
      
      setError('');
      setLoading(false);
    } catch (error) {
      console.error('Error fetching alumni:', error.message, error.response?.data || error);
      setError(`Unable to fetch alumni: ${error.response?.data?.message || error.message}`);
      setAlumni([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, [showAll]);

  useEffect(() => {
    if (branchFilter && !branchOptions.some((branch) => branch.value === branchFilter)) {
      setBranchFilter('');
    }
  }, [branchOptions, branchFilter]);

  const normalizedSearch = search.trim().toLowerCase();
  const getAlumniBranch = (alumni) => alumni.branch || alumni.fieldOfStudy || '';

  const filteredAlumni = useMemo(
    () => alumniList.filter((alumni) => {
      const branchValue = getAlumniBranch(alumni);
      const matchesSearch = !normalizedSearch ||
        alumni.fullName?.toLowerCase().includes(normalizedSearch) ||
        alumni.collegeEmail?.toLowerCase().includes(normalizedSearch) ||
        alumni.registrationNumber?.toLowerCase().includes(normalizedSearch);
      const matchesBatch = !batchFilter || String(alumni.graduationYear) === batchFilter;
      const matchesCourse = !courseFilter || alumni.course === courseFilter;
      const matchesBranch = !branchFilter || branchValue === branchFilter;
      return matchesSearch && matchesBatch && matchesCourse && matchesBranch;
    }),
    [alumniList, normalizedSearch, batchFilter, courseFilter, branchFilter]
  );

  const filterCounters = useMemo(() => {
    const batchCounts = {};
    const courseCounts = {};
    const branchCounts = {};
    let allBatchesCount = 0;
    let allCoursesCount = 0;
    let allBranchesCount = 0;

    alumniList.forEach((alumni) => {
      const branchValue = getAlumniBranch(alumni);
      const batchKey = alumni.graduationYear ? String(alumni.graduationYear) : '';
      const matchesSearch = !normalizedSearch ||
        alumni.fullName?.toLowerCase().includes(normalizedSearch) ||
        alumni.collegeEmail?.toLowerCase().includes(normalizedSearch) ||
        alumni.registrationNumber?.toLowerCase().includes(normalizedSearch);
      const matchesBatch = !batchFilter || batchKey === batchFilter;
      const matchesCourse = !courseFilter || alumni.course === courseFilter;
      const matchesBranch = !branchFilter || branchValue === branchFilter;

      if (matchesSearch && matchesCourse && matchesBranch) {
        allBatchesCount += 1;
        if (batchKey) {
          batchCounts[batchKey] = (batchCounts[batchKey] || 0) + 1;
        }
      }

      if (matchesSearch && matchesBatch && matchesBranch) {
        allCoursesCount += 1;
        if (alumni.course) {
          courseCounts[alumni.course] = (courseCounts[alumni.course] || 0) + 1;
        }
      }

      if (matchesSearch && matchesBatch && matchesCourse) {
        allBranchesCount += 1;
        if (branchValue) {
          branchCounts[branchValue] = (branchCounts[branchValue] || 0) + 1;
        }
      }
    });

    return {
      allBatchesCount,
      allCoursesCount,
      allBranchesCount,
      batchCounts,
      courseCounts,
      branchCounts
    };
  }, [alumniList, normalizedSearch, batchFilter, courseFilter, branchFilter]);

  const batches = useMemo(
    () => [...new Set(alumniList.map((a) => a.graduationYear))].filter(Boolean).sort((a, b) => a - b),
    [alumniList]
  );
  const descendingBatches = useMemo(() => [...batches].sort((a, b) => b - a), [batches]);

  const handleResetPasswordToDob = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.put(`${apiBase}/admin/alumni/${id}/reset-password-dob`, null, { headers });
      const data = response.data || {};
      setResetInfo({
        fullName: data.fullName,
        registrationNumber: data.registrationNumber,
        temporaryPassword: data.temporaryPassword
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    }
  };

  const handleAddVisitDate = async (id) => {
    const visitDate = window.prompt('Enter visit date (YYYY-MM-DD):', new Date().toISOString().slice(0, 10));
    if (!visitDate) return;

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.put(`${apiBase}/admin/alumni/${id}/visit-date`, { visitDate }, { headers });
      setVisitInfo(`Visit date ${visitDate} added successfully.`);
      fetchAlumni();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add visit date');
    }
  };

  const handleDeleteAlumni = async (id, fullName) => {
    if (!window.confirm(`Are you sure you want to delete ${fullName}'s profile? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.delete(`${apiBase}/admin/alumni/${id}`, { headers });
      setError(`✓ ${response.data?.message || 'Alumni profile deleted successfully'}`);
      setDeleteConfirm(null);
      setSelectedAlumni(null);
      fetchAlumni();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete alumni profile');
    }
  };

  const sortedAlumni = useMemo(() => {
    const sorted = [...filteredAlumni];
    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.fullName || '').localeCompare(b.fullName || '');
        case 'batch':
          return b.graduationYear - a.graduationYear;
        case 'email':
          return (a.collegeEmail || '').localeCompare(b.collegeEmail || '');
        case 'regNumber':
          return (a.registrationNumber || '').localeCompare(b.registrationNumber || '');
        default:
          return 0;
      }
    });
    return sorted;
  }, [filteredAlumni, sortBy]);

  const skeletons = Array.from({ length: 3 });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Complete List</p>
          <h2 className="text-2xl font-bold text-white">All Alumni</h2>
          <p className="text-sm text-slate-400">
            {alumniList.length} total • {filteredAlumni.length} matching current filters
          </p>
        </div>
        <Shield className="w-6 h-6 text-cyan-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name/email/roll"
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100"
          />
        </div>
        <select value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)} className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100">
          <option value="">All Batches ({filterCounters.allBatchesCount})</option>
          {batches.map((batch) => (
            <option key={batch} value={batch}>{batch} ({filterCounters.batchCounts[String(batch)] || 0})</option>
          ))}
        </select>
        <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100">
          <option value="">All Courses ({filterCounters.allCoursesCount})</option>
          {courseOptions.map((course) => (
            <option key={course.value} value={course.value}>{course.label} ({filterCounters.courseCounts[course.value] || 0})</option>
          ))}
        </select>
        <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100">
          <option value="">All Branches ({filterCounters.allBranchesCount})</option>
          {branchOptions.map((branch) => (
            <option key={branch.value} value={branch.value}>{branch.label} ({filterCounters.branchCounts[branch.value] || 0})</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 inline" />
          <option value="name">Sort by Name</option>
          <option value="batch">Sort by Batch (Newest)</option>
          <option value="email">Sort by Email</option>
          <option value="regNumber">Sort by Reg. Number</option>
        </select>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('admin')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition ${
              viewMode === 'admin' ? 'bg-cyan-600 border border-cyan-500 text-white' : 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
          >
            <Eye className="w-3 h-3" /> Admin View
          </button>
          <button
            onClick={() => setViewMode('network')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition ${
              viewMode === 'network' ? 'bg-purple-600 border border-purple-500 text-white' : 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
          >
            <EyeOff className="w-3 h-3" /> Network View
          </button>
        </div>
      </div>
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-sm">
          Temporary password reset for {resetInfo.fullName} ({resetInfo.registrationNumber}):
          <span className="font-bold ml-2">{resetInfo.temporaryPassword}</span>
        </div>
      )}

      {visitInfo && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-200 text-sm">
          {visitInfo}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setBatchFilter('')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${!batchFilter ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'}`}
        >
          All Years ({filterCounters.allBatchesCount})
        </button>
        {descendingBatches.map((year) => (
          <button
            key={year}
            onClick={() => setBatchFilter(String(year))}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${String(year) === batchFilter ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'}`}
          >
            {year} ({filterCounters.batchCounts[String(year)] || 0})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {skeletons.map((_, idx) => (
            <div key={idx} className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl animate-pulse space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-slate-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-800 rounded" />
                  <div className="h-3 bg-slate-800 rounded w-1/2" />
                </div>
              </div>
              <div className="h-9 bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-200 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      ) : filteredAlumni.length === 0 ? (
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl text-center text-slate-300">
          <Shield className="w-8 h-8 mx-auto text-slate-500 mb-2" />
          No alumni found for selected filters.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sortedAlumni.map((alumni) => (
            <div key={alumni._id} className={`p-4 rounded-xl shadow-lg border ${viewMode === 'network' ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-900/60 border-slate-800'}`}>
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={makeAbsoluteUrl(alumni.profilePhoto)}
                  alt={alumni.fullName}
                  className="w-12 h-12 rounded-full object-cover border border-slate-700 flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm text-white truncate">{alumni.fullName || 'NA'}</h3>
                  {viewMode === 'admin' && <p className="text-xs text-slate-400 truncate">{alumni.registrationNumber || 'NA'}</p>}
                </div>
              </div>

              {viewMode === 'admin' ? (
                <>
                  <div className="mt-2 text-xs text-slate-400 space-y-1">
                    <p>Year: <span className="text-slate-200">{alumni.graduationYear || 'NA'}</span></p>
                    <p>Course: <span className="text-slate-200">{getCourseLabel(alumni.course)}</span></p>
                    <p>Branch: <span className="text-slate-200">{getBranchLabel(alumni.course, alumni.branch || alumni.fieldOfStudy)}</span></p>
                    <p>Email: <span className="text-slate-200 text-xs truncate">{alumni.collegeEmail || 'NA'}</span></p>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <button
                      onClick={() => setSelectedAlumni(alumni)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-white inline-flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      View Details
                    </button>
                  </div>

                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleResetPasswordToDob(alumni._id)}
                      className="px-2 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white"
                      title="Reset password to DOB"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => handleAddVisitDate(alumni._id)}
                      className="px-2 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white inline-flex items-center justify-center"
                      title="Add visit date"
                    >
                      <CalendarPlus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteAlumni(alumni._id, alumni.fullName)}
                      className="px-2 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-semibold text-white inline-flex items-center justify-center"
                      title="Delete alumni profile"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-500">
                    Last Visit: {formatDate((alumni.dateOfVisit || [])[alumni.dateOfVisit?.length - 1])}
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-2 text-xs text-slate-300 space-y-1">
                    <p>Batch: <span className="text-slate-100 font-semibold">{alumni.graduationYear || 'NA'}</span></p>
                    <p>Course: <span className="text-slate-100">{getCourseLabel(alumni.course)}</span></p>
                    <p>Branch: <span className="text-slate-100">{getBranchLabel(alumni.course, alumni.branch || alumni.fieldOfStudy)}</span></p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {alumni.linkedin && (
                        <a href={alumni.linkedin} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 hover:underline">
                          LinkedIn
                        </a>
                      )}
                      {alumni.github && (
                        <a href={alumni.github} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 hover:underline">
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedAlumni(alumni)}
                    className="w-full mt-3 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-white inline-flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    View Profile
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedAlumni && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 bg-slate-900 px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Alumni Details</p>
                <h3 className="text-2xl font-bold text-white">{selectedAlumni.fullName || 'NA'}</h3>
                <p className="text-sm text-slate-400">Registration No: {selectedAlumni.registrationNumber || selectedAlumni.usn || 'NA'}</p>
              </div>
              <button
                onClick={() => setSelectedAlumni(null)}
                className="rounded-full border border-slate-700 p-2 text-slate-300 hover:bg-slate-800 hover:text-white"
                aria-label="Close details"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[calc(90vh-88px)] overflow-y-auto p-6 space-y-6">
              <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <img
                    src={makeAbsoluteUrl(selectedAlumni.profilePhoto)}
                    alt={selectedAlumni.fullName}
                    className="h-56 w-full rounded-xl object-cover border border-slate-800"
                  />
                  <div className="mt-4 space-y-2 text-sm text-slate-300">
                    <p><span className="text-slate-500">Course:</span> {getCourseLabel(selectedAlumni.course)}</p>
                    <p><span className="text-slate-500">Branch:</span> {getBranchLabel(selectedAlumni.course, selectedAlumni.branch || selectedAlumni.fieldOfStudy)}</p>
                    <p><span className="text-slate-500">Batch:</span> {selectedAlumni.graduationYear || 'NA'}</p>
                    <p><span className="text-slate-500">Import:</span> {selectedAlumni.importSource || 'Manual / legacy'}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      title: 'Core Profile',
                      fields: [
                        ['fullName', 'Full Name'],
                        ['registrationNumber', 'Registration Number'],
                        ['usn', 'USN'],
                        ['graduationYear', 'Graduation Year'],
                        ['course', 'Course'],
                        ['branch', 'Branch'],
                        ['fieldOfStudy', 'Field of Study'],
                        ['gender', 'Gender'],
                        ['dob', 'Date of Birth'],
                        ['dateOfMarriage', 'Date of Marriage'],
                        ['religion', 'Religion'],
                        ['verified', 'Verified'],
                        ['passwordResetRequired', 'Password Reset Required']
                      ]
                    },
                    {
                      title: 'Contact & Family',
                      fields: [
                        ['collegeEmail', 'College Email'],
                        ['personalEmail', 'Personal Email'],
                        ['mobile', 'Mobile'],
                        ['parentsMobile', 'Parents Mobile'],
                        ['fatherName', 'Father Name'],
                        ['motherName', 'Mother Name'],
                        ['permanentAddress', 'Permanent Address']
                      ]
                    },
                    {
                      title: 'Career & Links',
                      fields: [
                        ['currentCompany', 'Current Company'],
                        ['designation', 'Designation'],
                        ['currentLocation', 'Current Location'],
                        ['higherStudy', 'Higher Study'],
                        ['linkedin', 'LinkedIn'],
                        ['github', 'GitHub'],
                        ['degreeCertificate', 'Degree Certificate'],
                        ['degreeCertificateImage', 'Degree Certificate Image'],
                        ['profilePhoto', 'Profile Photo']
                      ]
                    },
                    {
                      title: 'Tracking',
                      fields: [
                        ['dateOfVisit', 'Date Of Visit'],
                        ['createdAt', 'Created At'],
                        ['updatedAt', 'Updated At']
                      ]
                    }
                  ].map((section) => (
                    <div key={section.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                      <h4 className="mb-4 text-lg font-semibold text-white">{section.title}</h4>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {section.fields.map(([key, label]) => (
                          <div key={key} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
                            <p className="mt-2 break-words text-sm text-slate-100">{formatValue(key, selectedAlumni[key], selectedAlumni)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                    <h4 className="mb-4 text-lg font-semibold text-white">All Stored Fields</h4>
                    <div className="grid gap-3 md:grid-cols-2">
                      {Object.entries(selectedAlumni)
                        .filter(([key]) => key !== 'password' && key !== '__v')
                        .map(([key, value]) => (
                          <div key={key} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{key}</p>
                            <p className="mt-2 break-words text-sm text-slate-100">
                              {formatValue(key, value, selectedAlumni)}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Alumni;
