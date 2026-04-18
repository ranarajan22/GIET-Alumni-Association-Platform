import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { Shield, AlertTriangle, Search, CalendarPlus } from 'lucide-react';

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

  const filteredAlumni = alumniList.filter((alumni) => {
    const branchValue = alumni.branch || alumni.fieldOfStudy;
    const matchesSearch = !search ||
      alumni.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      alumni.collegeEmail?.toLowerCase().includes(search.toLowerCase()) ||
      alumni.registrationNumber?.toLowerCase().includes(search.toLowerCase());
    const matchesBatch = !batchFilter || String(alumni.graduationYear) === batchFilter;
    const matchesCourse = !courseFilter || alumni.course === courseFilter;
    const matchesBranch = !branchFilter || branchValue === branchFilter;
    return matchesSearch && matchesBatch && matchesCourse && matchesBranch;
  });

  const batches = [...new Set(alumniList.map((a) => a.graduationYear))].filter(Boolean).sort((a, b) => a - b);
  const courses = [...new Set(alumniList.map((a) => a.course))].filter(Boolean).sort();
  const branches = [...new Set(alumniList.map((a) => a.branch || a.fieldOfStudy))].filter(Boolean).sort();

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

  const skeletons = Array.from({ length: 3 });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Complete List</p>
          <h2 className="text-2xl font-bold text-white">All Alumni</h2>
          <p className="text-sm text-slate-400">View all directly registered alumni profiles</p>
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
          <option value="">All Batches</option>
          {batches.map((batch) => <option key={batch} value={batch}>{batch}</option>)}
        </select>
        <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100">
          <option value="">All Courses</option>
          {courses.map((course) => <option key={course} value={course}>{course}</option>)}
        </select>
        <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100">
          <option value="">All Branches</option>
          {branches.map((branch) => <option key={branch} value={branch}>{branch}</option>)}
        </select>
      </div>

      {resetInfo && (
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
          All Years
        </button>
        {batches.sort((a, b) => b - a).map((year) => (
          <button
            key={year}
            onClick={() => setBatchFilter(String(year))}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${String(year) === batchFilter ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'}`}
          >
            {year}
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
          {filteredAlumni.map((alumni) => (
            <div key={alumni._id} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <img
                  src={makeAbsoluteUrl(alumni.profilePhoto)}
                  alt={alumni.fullName}
                  className="w-12 h-12 rounded-full object-cover border border-slate-700"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-white truncate">{alumni.fullName || 'NA'}</h3>
                  <p className="text-xs text-slate-400 truncate">{alumni.registrationNumber || 'NA'}</p>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-400">
                <p>Year: <span className="text-slate-200">{alumni.graduationYear || 'NA'}</span></p>
                <p>Course: <span className="text-slate-200">{alumni.course || 'NA'}</span></p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleResetPasswordToDob(alumni._id)}
                  className="w-full px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-white"
                >
                  Reset Password to DOB
                </button>
                <button
                  onClick={() => handleAddVisitDate(alumni._id)}
                  className="w-full px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white inline-flex items-center justify-center gap-1"
                >
                  <CalendarPlus className="w-3 h-3" />
                  Add Visit Date
                </button>
              </div>

              <div className="mt-2 text-[11px] text-slate-500">
                Last Visit: {formatDate((alumni.dateOfVisit || [])[alumni.dateOfVisit?.length - 1])}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Alumni;
