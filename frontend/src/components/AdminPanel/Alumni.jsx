import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { Shield, AlertTriangle, Search, CalendarPlus, Eye, X, Trash2, EyeOff, ArrowUpDown, Rows3, Columns3, RefreshCw } from 'lucide-react';
import { mergeCourseOptions, mergeBranchOptions, getCourseLabel, getBranchLabel } from '../../constants/courseCatalog';

const ALUMNI_CACHE_KEY = 'admin_alumni_cache_v1';
const ALUMNI_CACHE_TTL = 5 * 60 * 1000;

const readAlumniCache = () => {
  try {
    const raw = sessionStorage.getItem(ALUMNI_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.timestamp || !Array.isArray(parsed?.data)) return null;
    if (Date.now() - parsed.timestamp > ALUMNI_CACHE_TTL) return null;
    return parsed.data;
  } catch {
    return null;
  }
};

const writeAlumniCache = (data) => {
  try {
    sessionStorage.setItem(
      ALUMNI_CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        data
      })
    );
  } catch {
    // Ignore cache write failures and continue with in-memory data.
  }
};

const Alumni = ({ showAll = true, theme = 'dark' }) => {
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
  const [layoutMode, setLayoutMode] = useState('vertical');
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

  // Hardcoded field name mapping for display labels
  const fieldDisplayNames = {
    fullName: 'Full Name',
    graduationYear: 'Graduation Year',
    collegeEmail: 'College Email',
    personalEmail: 'Personal Email',
    profilePhoto: 'Profile Photo',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    course: 'Course',
    usn: 'Registration Number',
    registrationNumber: 'Roll Number',
    fieldOfStudy: 'Field of Study',
    branch: 'Branch',
    mobile: 'Mobile',
    parentsMobile: 'Parents Mobile',
    fatherName: 'Father Name',
    motherName: 'Mother Name',
    religion: 'Religion',
    higherStudy: 'Higher Study',
    permanentAddress: 'Permanent Address',
    dob: 'Date of Birth',
    dateOfMarriage: 'Date of Marriage',
    currentCompany: 'Current Company',
    designation: 'Designation',
    currentLocation: 'Current Location',
    dateOfVisit: 'Date Of Visit',
    createdAt: 'Created At',
    updatedAt: 'Updated At',
    gender: 'Gender',
    verified: 'Verified',
    passwordResetRequired: 'Password Reset Required',
    degreeCertificate: 'Degree Certificate',
    degreeCertificateImage: 'Degree Certificate Image',
    importSource: 'Import Source',
    followers: 'Followers',
    _id: 'ID'
  };

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

  const getStoredFieldEntries = (alumni) => {
    const coreEntries = Object.entries(alumni || {})
      .filter(([key]) => !['password', '__v', 'additionalFields', 'additionalFieldLabels'].includes(key))
      .map(([key, value]) => ({
        id: key,
        label: fieldDisplayNames[key] || key,
        key,
        value
      }));

    const dynamicValues = alumni?.additionalFields || {};
    const dynamicLabels = alumni?.additionalFieldLabels || {};
    const dynamicEntries = Object.entries(dynamicValues).map(([key, value]) => ({
      id: `additional_${key}`,
      label: dynamicLabels[key] || key,
      key: `additionalFields.${key}`,
      value
    }));

    return [...coreEntries, ...dynamicEntries];
  };

  // Fetch the alumni data
  const fetchAlumni = async ({ silent = false } = {}) => {
    try {
      if (!silent) {
        setLoading(true);
      }
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
        const nextAlumni = alumniData.filter(Boolean);
        setAlumni(nextAlumni);
        writeAlumniCache(nextAlumni);
      } else {
        console.log('No alumni found');
        setAlumni([]);
        writeAlumniCache([]);
      }
      
      setError('');
    } catch (error) {
      console.error('Error fetching alumni:', error.message, error.response?.data || error);
      setError(`Unable to fetch alumni: ${error.response?.data?.message || error.message}`);
      setAlumni([]);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const cachedAlumni = readAlumniCache();
    if (cachedAlumni) {
      setAlumni(cachedAlumni);
      setLoading(false);
      fetchAlumni({ silent: true });
      return;
    }

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
  const isDark = theme === 'dark';

  return (
    <section className={isDark ? 'space-y-4' : 'space-y-4 text-slate-900'}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Complete List</p>
          <h2 className={isDark ? 'text-2xl font-bold text-white' : 'text-2xl font-bold text-slate-900'}>All Alumni</h2>
          <p className={isDark ? 'text-sm text-slate-400' : 'text-sm text-slate-600'}>
            {alumniList.length} total • {filteredAlumni.length} matching current filters
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchAlumni()}
            className={isDark ? 'px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-white inline-flex items-center gap-1.5' : 'px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-semibold text-slate-800 inline-flex items-center gap-1.5'}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <Shield className={isDark ? 'w-6 h-6 text-cyan-400' : 'w-6 h-6 text-cyan-600'} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name/email/roll"
            className={isDark ? 'w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100' : 'w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900'}
          />
        </div>
        <select value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)} className={isDark ? 'px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100' : 'px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900'}>
          <option value="">All Batches ({filterCounters.allBatchesCount})</option>
          {batches.map((batch) => (
            <option key={batch} value={batch}>{batch} ({filterCounters.batchCounts[String(batch)] || 0})</option>
          ))}
        </select>
        <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className={isDark ? 'px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100' : 'px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900'}>
          <option value="">All Courses ({filterCounters.allCoursesCount})</option>
          {courseOptions.map((course) => (
            <option key={course.value} value={course.value}>{course.label} ({filterCounters.courseCounts[course.value] || 0})</option>
          ))}
        </select>
        <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} className={isDark ? 'px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100' : 'px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900'}>
          <option value="">All Branches ({filterCounters.allBranchesCount})</option>
          {branchOptions.map((branch) => (
            <option key={branch.value} value={branch.value}>{branch.label} ({filterCounters.branchCounts[branch.value] || 0})</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={isDark ? 'px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 flex items-center gap-2' : 'px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 flex items-center gap-2'}>
          <ArrowUpDown className="w-4 h-4 inline" />
          <option value="name">Sort by Name</option>
          <option value="batch">Sort by Batch (Newest)</option>
          <option value="email">Sort by Email</option>
          <option value="regNumber">Sort by Reg. Number</option>
        </select>
        <div className="flex gap-2">
          <button
            onClick={() => setLayoutMode('vertical')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition ${
              layoutMode === 'vertical' ? 'bg-emerald-600 border border-emerald-500 text-white' : isDark ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-slate-600' : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'
            }`}
          >
            <Rows3 className="w-3 h-3" /> Vertical
          </button>
          <button
            onClick={() => setLayoutMode('horizontal')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition ${
              layoutMode === 'horizontal' ? 'bg-emerald-600 border border-emerald-500 text-white' : isDark ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-slate-600' : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'
            }`}
          >
            <Columns3 className="w-3 h-3" /> Horizontal
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('admin')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition ${
              viewMode === 'admin' ? 'bg-cyan-600 border border-cyan-500 text-white' : isDark ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-slate-600' : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'
            }`}
          >
            <Eye className="w-3 h-3" /> Admin View
          </button>
          <button
            onClick={() => setViewMode('network')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition ${
              viewMode === 'network' ? 'bg-purple-600 border border-purple-500 text-white' : isDark ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:border-slate-600' : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'
            }`}
          >
            <EyeOff className="w-3 h-3" /> Network View
          </button>
        </div>
      </div>

      {resetInfo && (
        <div className={isDark ? 'p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-sm' : 'p-3 bg-amber-100 border border-amber-300 rounded-xl text-amber-800 text-sm'}>
          Temporary password reset for {resetInfo.fullName} ({resetInfo.registrationNumber}):
          <span className="font-bold ml-2">{resetInfo.temporaryPassword}</span>
        </div>
      )}

      {visitInfo && (
        <div className={isDark ? 'p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-200 text-sm' : 'p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-800 text-sm'}>
          {visitInfo}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setBatchFilter('')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${!batchFilter ? 'bg-cyan-600 border-cyan-500 text-white' : isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border border-slate-300 text-slate-700'}`}
        >
          All Years ({filterCounters.allBatchesCount})
        </button>
        {descendingBatches.map((year) => (
          <button
            key={year}
            onClick={() => setBatchFilter(String(year))}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${String(year) === batchFilter ? 'bg-cyan-600 border-cyan-500 text-white' : isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border border-slate-300 text-slate-700'}`}
          >
            {year} ({filterCounters.batchCounts[String(year)] || 0})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {skeletons.map((_, idx) => (
            <div key={idx} className={isDark ? 'p-4 bg-slate-900/60 border border-slate-800 rounded-2xl animate-pulse space-y-3' : 'p-4 bg-white border border-slate-200 rounded-2xl animate-pulse space-y-3'}>
              <div className="flex items-center gap-3">
                <div className={isDark ? 'w-14 h-14 rounded-full bg-slate-800' : 'w-14 h-14 rounded-full bg-slate-200'} />
                <div className="flex-1 space-y-2">
                  <div className={isDark ? 'h-3 bg-slate-800 rounded' : 'h-3 bg-slate-200 rounded'} />
                  <div className={isDark ? 'h-3 bg-slate-800 rounded w-1/2' : 'h-3 bg-slate-200 rounded w-1/2'} />
                </div>
              </div>
              <div className={isDark ? 'h-9 bg-slate-800 rounded' : 'h-9 bg-slate-200 rounded'} />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-200 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      ) : filteredAlumni.length === 0 ? (
        <div className={isDark ? 'p-6 bg-slate-900/60 border border-slate-800 rounded-2xl text-center text-slate-300' : 'p-6 bg-white border border-slate-200 rounded-2xl text-center text-slate-700'}>
          <Shield className={isDark ? 'w-8 h-8 mx-auto text-slate-500 mb-2' : 'w-8 h-8 mx-auto text-slate-500 mb-2'} />
          No alumni found for selected filters.
        </div>
      ) : (
        <div className={layoutMode === 'horizontal' ? 'space-y-3' : 'grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}>
          {sortedAlumni.map((alumni) => (
            <div
              key={alumni._id}
              className={`p-4 rounded-xl shadow-lg border ${viewMode === 'network' ? isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-50 border-slate-200' : isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'} ${layoutMode === 'horizontal' ? 'flex flex-col md:flex-row md:items-start md:justify-between md:gap-4' : ''}`}
            >
              <div className={`flex items-start gap-3 mb-3 ${layoutMode === 'horizontal' ? 'md:mb-0 md:flex-1' : ''}`}>
                <img
                  src={makeAbsoluteUrl(alumni.profilePhoto)}
                  alt={alumni.fullName}
                  className="w-12 h-12 rounded-full object-cover border border-slate-700 flex-shrink-0"
                />
                <div className={`min-w-0 flex-1 ${layoutMode === 'horizontal' ? 'md:max-w-xs' : ''}`}>
                  <h3 className={isDark ? 'font-bold text-sm text-white truncate' : 'font-bold text-sm text-slate-900 truncate'}>{alumni.fullName || 'NA'}</h3>
                  {viewMode === 'admin' && <p className={isDark ? 'text-xs text-slate-400 truncate' : 'text-xs text-slate-600 truncate'}>{alumni.registrationNumber || 'NA'}</p>}
                </div>
              </div>

              {viewMode === 'admin' ? (
                <div className={layoutMode === 'horizontal' ? 'md:flex md:items-center md:gap-6 md:flex-1' : ''}>
                  <div className={`mt-2 text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'} space-y-1 ${layoutMode === 'horizontal' ? 'md:mt-0 md:min-w-[220px]' : ''}`}>
                    <p>Year: <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>{alumni.graduationYear || 'NA'}</span></p>
                    <p>Course: <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>{getCourseLabel(alumni.course)}</span></p>
                    <p>Branch: <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>{getBranchLabel(alumni.course, alumni.branch || alumni.fieldOfStudy)}</span></p>
                    <p>Email: <span className={isDark ? 'text-slate-200 text-xs truncate' : 'text-slate-800 text-xs truncate'}>{alumni.collegeEmail || 'NA'}</span></p>
                  </div>

                  <div className={`mt-3 grid grid-cols-1 gap-2 ${layoutMode === 'horizontal' ? 'md:mt-0 md:min-w-[170px]' : ''}`}>
                    <button
                      onClick={() => setSelectedAlumni(alumni)}
                      className={isDark ? 'w-full px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-semibold text-white inline-flex items-center justify-center gap-1' : 'w-full px-3 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-xs font-semibold text-slate-900 inline-flex items-center justify-center gap-1'}
                    >
                      <Eye className="w-3 h-3" />
                      View Details
                    </button>
                  </div>

                  <div className={`mt-2 grid grid-cols-3 gap-2 ${layoutMode === 'horizontal' ? 'md:mt-0 md:min-w-[180px]' : ''}`}>
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

                  <div className={`mt-2 text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-600'} ${layoutMode === 'horizontal' ? 'md:mt-0 md:min-w-[140px]' : ''}`}>
                    Last Visit: {formatDate((alumni.dateOfVisit || [])[alumni.dateOfVisit?.length - 1])}
                  </div>
                </div>
              ) : (
                <div className={layoutMode === 'horizontal' ? 'md:flex md:items-center md:gap-6 md:flex-1' : ''}>
                  <div className={`mt-2 text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'} space-y-1 ${layoutMode === 'horizontal' ? 'md:mt-0 md:min-w-[220px]' : ''}`}>
                    <p>Batch: <span className={isDark ? 'text-slate-100 font-semibold' : 'text-slate-900 font-semibold'}>{alumni.graduationYear || 'NA'}</span></p>
                    <p>Course: <span className={isDark ? 'text-slate-100' : 'text-slate-900'}>{getCourseLabel(alumni.course)}</span></p>
                    <p>Branch: <span className={isDark ? 'text-slate-100' : 'text-slate-900'}>{getBranchLabel(alumni.course, alumni.branch || alumni.fieldOfStudy)}</span></p>
                  </div>

                  <div className={`mt-3 pt-3 border-t border-slate-700 ${layoutMode === 'horizontal' ? 'md:mt-0 md:pt-0 md:border-t-0 md:min-w-[160px]' : ''}`}>
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
                    className={`w-full mt-3 px-3 py-2 rounded-lg ${isDark ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'} text-xs font-semibold inline-flex items-center justify-center gap-1 ${layoutMode === 'horizontal' ? 'md:mt-0 md:w-auto md:min-w-[150px]' : ''}`}
                  >
                    <Eye className="w-3 h-3" />
                    View Profile
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedAlumni && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className={isDark ? 'w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl' : 'w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-2xl'}>
            <div className={isDark ? 'flex items-start justify-between gap-4 border-b border-slate-800 bg-slate-900 px-6 py-5' : 'flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-5'}>
              <div>
                <p className={isDark ? 'text-xs uppercase tracking-[0.3em] text-slate-500' : 'text-xs uppercase tracking-[0.3em] text-slate-600'}>Alumni Details</p>
                <h3 className={isDark ? 'text-2xl font-bold text-white' : 'text-2xl font-bold text-slate-900'}>{selectedAlumni.fullName || 'NA'}</h3>
                <p className={isDark ? 'text-sm text-slate-400' : 'text-sm text-slate-600'}>Roll Number: {selectedAlumni.registrationNumber || selectedAlumni.usn || 'NA'}</p>
              </div>
              <button
                onClick={() => setSelectedAlumni(null)}
                className={isDark ? 'rounded-full border border-slate-700 p-2 text-slate-300 hover:bg-slate-800 hover:text-white' : 'rounded-full border border-slate-300 p-2 text-slate-600 hover:bg-slate-200 hover:text-slate-900'}
                aria-label="Close details"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[calc(90vh-88px)] overflow-y-auto p-6 space-y-6">
              <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
                <div className={isDark ? 'rounded-2xl border border-slate-800 bg-slate-900/70 p-4' : 'rounded-2xl border border-slate-200 bg-slate-50 p-4'}>
                  <img
                    src={makeAbsoluteUrl(selectedAlumni.profilePhoto)}
                    alt={selectedAlumni.fullName}
                    className={isDark ? 'h-56 w-full rounded-xl object-cover border border-slate-800' : 'h-56 w-full rounded-xl object-cover border border-slate-200'}
                  />
                  <div className={isDark ? 'mt-4 space-y-2 text-sm text-slate-300' : 'mt-4 space-y-2 text-sm text-slate-700'}>
                    <p><span className={isDark ? 'text-slate-500' : 'text-slate-600'}>Course:</span> {getCourseLabel(selectedAlumni.course)}</p>
                    <p><span className={isDark ? 'text-slate-500' : 'text-slate-600'}>Branch:</span> {getBranchLabel(selectedAlumni.course, selectedAlumni.branch || selectedAlumni.fieldOfStudy)}</p>
                    <p><span className={isDark ? 'text-slate-500' : 'text-slate-600'}>Batch:</span> {selectedAlumni.graduationYear || 'NA'}</p>
                    <p><span className={isDark ? 'text-slate-500' : 'text-slate-600'}>Import:</span> {selectedAlumni.importSource || 'Manual / legacy'}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      title: 'Core Profile',
                      fields: [
                        ['fullName', 'Full Name'],
                        ['registrationNumber', 'Roll Number'],
                        ['usn', 'Registration Number'],
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
                    <div key={section.title} className={isDark ? 'rounded-2xl border border-slate-800 bg-slate-900/60 p-5' : 'rounded-2xl border border-slate-200 bg-slate-50 p-5'}>
                      <h4 className={isDark ? 'mb-4 text-lg font-semibold text-white' : 'mb-4 text-lg font-semibold text-slate-900'}>{section.title}</h4>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {section.fields.map(([key, label]) => (
                          <div key={key} className={isDark ? 'rounded-xl border border-slate-800 bg-slate-950/60 p-4' : 'rounded-xl border border-slate-200 bg-white p-4'}>
                            <p className={isDark ? 'text-xs uppercase tracking-[0.2em] text-slate-500' : 'text-xs uppercase tracking-[0.2em] text-slate-600'}>{label}</p>
                            <p className={isDark ? 'mt-2 break-words text-sm text-slate-100' : 'mt-2 break-words text-sm text-slate-900'}>{formatValue(key, selectedAlumni[key], selectedAlumni)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className={isDark ? 'rounded-2xl border border-slate-800 bg-slate-900/60 p-5' : 'rounded-2xl border border-slate-200 bg-slate-50 p-5'}>
                    <h4 className={isDark ? 'mb-4 text-lg font-semibold text-white' : 'mb-4 text-lg font-semibold text-slate-900'}>All Stored Fields</h4>
                    <div className="grid gap-3 md:grid-cols-2">
                      {getStoredFieldEntries(selectedAlumni)
                        .map((entry) => (
                          <div key={entry.id} className={isDark ? 'rounded-xl border border-slate-800 bg-slate-950/60 p-4' : 'rounded-xl border border-slate-200 bg-white p-4'}>
                            <p className={isDark ? 'text-xs uppercase tracking-[0.2em] text-slate-500' : 'text-xs uppercase tracking-[0.2em] text-slate-600'}>{entry.label}</p>
                            <p className={isDark ? 'mt-2 break-words text-sm text-slate-100' : 'mt-2 break-words text-sm text-slate-900'}>
                              {formatValue(entry.key, entry.value, selectedAlumni)}
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
