import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { Users, AlertTriangle, Search, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { mergeCourseOptions, mergeBranchOptions, getCourseLabel, getBranchLabel } from '../../constants/courseCatalog';

const STUDENTS_CACHE_KEY = 'admin_students_cache_v1';
const STUDENTS_CACHE_TTL = 5 * 60 * 1000;

const readStudentsCache = () => {
  try {
    const raw = sessionStorage.getItem(STUDENTS_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.timestamp || !Array.isArray(parsed?.data)) return null;
    if (Date.now() - parsed.timestamp > STUDENTS_CACHE_TTL) return null;
    return parsed.data;
  } catch {
    return null;
  }
};

const writeStudentsCache = (data) => {
  try {
    sessionStorage.setItem(
      STUDENTS_CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        data
      })
    );
  } catch {
    // Ignore cache write failures and continue with in-memory data.
  }
};

function Students({ theme = 'dark' }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterGradYear, setFilterGradYear] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const courseOptions = useMemo(() => mergeCourseOptions(students.map((student) => student.course)), [students]);
  const branchOptions = useMemo(
    () => mergeBranchOptions(filterCourse, students.map((student) => student.branch || student.fieldOfStudy)),
    [filterCourse, students]
  );

  useEffect(() => {
    const cachedStudents = readStudentsCache();
    if (cachedStudents) {
      setStudents(cachedStudents);
      setLoading(false);
      fetchStudents({ silent: true });
      return;
    }

    fetchStudents();
  }, []);

  useEffect(() => {
    if (filterBranch && !branchOptions.some((branch) => branch.value === filterBranch)) {
      setFilterBranch('');
    }
  }, [branchOptions, filterBranch]);

  const fetchStudents = async ({ silent = false } = {}) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      const base = API_BASE_URL;
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      console.log('Fetching students from:', `${base}/admin/students`, 'with token:', !!token);
      const res = await axios.get(`${base}/admin/students`, { headers });
      console.log('Students response:', res.data);
      const nextStudents = res.data?.students || [];
      setStudents(nextStudents);
      writeStudentsCache(nextStudents);
      setError('');
      setCurrentPage(1);
    } catch (err) {
      console.error('Error fetching students:', err.message, err.response?.data || err);
      setError(`Failed to fetch students: ${err.response?.data?.message || err.message}`);
      setStudents([]);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const getStudentBranch = (student) => student.branch || student.fieldOfStudy || '';

  // Filter and sort logic
  const filteredStudents = useMemo(() => {
    let result = students.filter((s) => {
      const matchesSearch =
        !normalizedSearchQuery ||
        s.fullName?.toLowerCase().includes(normalizedSearchQuery) ||
        s.collegeEmail?.toLowerCase().includes(normalizedSearchQuery) ||
        s.usn?.toLowerCase().includes(normalizedSearchQuery);
      const matchesCourse = !filterCourse || s.course === filterCourse;
      const studentBranch = getStudentBranch(s);
      const matchesBranch = !filterBranch || studentBranch === filterBranch;
      const matchesYear = !filterGradYear || String(s.graduationYear) === filterGradYear;
      return matchesSearch && matchesCourse && matchesBranch && matchesYear;
    });

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.fullName.localeCompare(b.fullName);
        case 'email':
          return a.collegeEmail.localeCompare(b.collegeEmail);
        case 'year':
          return b.graduationYear - a.graduationYear;
        default:
          return 0;
      }
    });

    return result;
  }, [students, normalizedSearchQuery, filterCourse, filterBranch, filterGradYear, sortBy]);

  const filterCounters = useMemo(() => {
    const courseCounts = {};
    const branchCounts = {};
    const yearCounts = {};
    let allCoursesCount = 0;
    let allBranchesCount = 0;
    let allYearsCount = 0;

    students.forEach((student) => {
      const studentBranch = getStudentBranch(student);
      const yearKey = student.graduationYear ? String(student.graduationYear) : '';
      const matchesSearch =
        !normalizedSearchQuery ||
        student.fullName?.toLowerCase().includes(normalizedSearchQuery) ||
        student.collegeEmail?.toLowerCase().includes(normalizedSearchQuery) ||
        student.usn?.toLowerCase().includes(normalizedSearchQuery);
      const matchesCourse = !filterCourse || student.course === filterCourse;
      const matchesBranch = !filterBranch || studentBranch === filterBranch;
      const matchesYear = !filterGradYear || yearKey === filterGradYear;

      if (matchesSearch && matchesBranch && matchesYear) {
        allCoursesCount += 1;
        if (student.course) {
          courseCounts[student.course] = (courseCounts[student.course] || 0) + 1;
        }
      }

      if (matchesSearch && matchesCourse && matchesYear) {
        allBranchesCount += 1;
        if (studentBranch) {
          branchCounts[studentBranch] = (branchCounts[studentBranch] || 0) + 1;
        }
      }

      if (matchesSearch && matchesCourse && matchesBranch) {
        allYearsCount += 1;
        if (yearKey) {
          yearCounts[yearKey] = (yearCounts[yearKey] || 0) + 1;
        }
      }
    });

    return {
      allCoursesCount,
      allBranchesCount,
      allYearsCount,
      courseCounts,
      branchCounts,
      yearCounts
    };
  }, [students, normalizedSearchQuery, filterCourse, filterBranch, filterGradYear]);

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIdx, startIdx + itemsPerPage);

  // Get unique values for filters
  const gradYears = [...new Set(students.map((s) => s.graduationYear))].filter(Boolean).sort().reverse();

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Registration Number', 'Course', 'Branch', 'Grad Year', 'Joined'];
    const rows = filteredStudents.map((s) => [
      s.fullName,
      s.collegeEmail,
      s.registrationNumber || s.usn,
      getCourseLabel(s.course),
      getBranchLabel(s.course, s.branch || s.fieldOfStudy),
      s.graduationYear,
      new Date(s.createdAt).toLocaleDateString()
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((r) => r.map((cell) => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const total = students.length;
  const isDark = theme === 'dark';

  return (
    <section className={isDark ? 'bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl backdrop-blur p-6 space-y-4' : 'bg-white border border-slate-200 rounded-2xl shadow-xl backdrop-blur p-6 space-y-4'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className={isDark ? 'text-xs uppercase tracking-[0.3em] text-slate-500' : 'text-xs uppercase tracking-[0.3em] text-slate-600'}>Roster</p>
          <h2 className={isDark ? 'text-2xl font-bold text-white' : 'text-2xl font-bold text-slate-900'}>Students</h2>
          <p className={isDark ? 'text-sm text-slate-400' : 'text-sm text-slate-600'}>
            {total} total • Showing {paginatedStudents.length} of {filteredStudents.length} results
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => fetchStudents()}
            className={isDark ? 'px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm font-semibold text-white' : 'px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-sm font-semibold text-slate-800'}
          >
            Refresh
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-sm font-semibold text-white flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, email, or Registration Number..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className={isDark ? 'w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500' : 'w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:border-cyan-500'}
          />
        </div>

        <select
          value={filterCourse}
          onChange={(e) => {
            setFilterCourse(e.target.value);
            setCurrentPage(1);
          }}
          className={isDark ? 'px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500' : 'px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-cyan-500'}
        >
          <option value="">All Courses ({filterCounters.allCoursesCount})</option>
          {courseOptions.map((course) => (
            <option key={course.value} value={course.value}>
              {course.label} ({filterCounters.courseCounts[course.value] || 0})
            </option>
          ))}
        </select>

        <select
          value={filterGradYear}
          onChange={(e) => {
            setFilterGradYear(e.target.value);
            setCurrentPage(1);
          }}
          className={isDark ? 'px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500' : 'px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-cyan-500'}
        >
          <option value="">All Years ({filterCounters.allYearsCount})</option>
          {gradYears.map((y) => (
            <option key={y} value={y}>
              Class of {y} ({filterCounters.yearCounts[String(y)] || 0})
            </option>
          ))}
        </select>

        <select
          value={filterBranch}
          onChange={(e) => {
            setFilterBranch(e.target.value);
            setCurrentPage(1);
          }}
          className={isDark ? 'px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500' : 'px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-cyan-500'}
        >
          <option value="">All Branches ({filterCounters.allBranchesCount})</option>
          {branchOptions.map((branch) => (
            <option key={branch.value} value={branch.value}>
              {branch.label} ({filterCounters.branchCounts[branch.value] || 0})
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={isDark ? 'px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500' : 'px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-cyan-500'}
        >
          <option value="name">Sort by Name</option>
          <option value="email">Sort by Email</option>
          <option value="year">Sort by Graduation Year</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className={isDark ? 'h-12 bg-slate-800 rounded-lg animate-pulse' : 'h-12 bg-slate-100 rounded-lg animate-pulse'} />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-200 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className={isDark ? 'p-6 bg-slate-900/60 border border-slate-800 rounded-2xl text-center text-slate-300' : 'p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center text-slate-700'}>
          <Users className={isDark ? 'w-8 h-8 mx-auto text-slate-500 mb-2' : 'w-8 h-8 mx-auto text-slate-500 mb-2'} />
          No students found matching your criteria.
        </div>
      ) : (
        <>
          <div className={isDark ? 'overflow-hidden rounded-xl border border-slate-800' : 'overflow-hidden rounded-xl border border-slate-200'}>
            <div className="overflow-x-auto">
              <table className={isDark ? 'min-w-full text-sm text-left text-slate-200' : 'min-w-full text-sm text-left text-slate-800'}>
                <thead className={isDark ? 'bg-slate-800 text-xs uppercase tracking-wide text-slate-400' : 'bg-slate-100 text-xs uppercase tracking-wide text-slate-600'}>
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Registration Number</th>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">Branch</th>
                    <th className="px-4 py-3">Grad Year</th>
                    <th className="px-4 py-3">Joined</th>
                  </tr>
                </thead>
                <tbody className={isDark ? 'divide-y divide-slate-800' : 'divide-y divide-slate-200'}>
                  {paginatedStudents.map((s) => (
                    <tr key={s._id} className={isDark ? 'hover:bg-slate-800/60 transition-colors' : 'hover:bg-slate-50 transition-colors'}>
                      <td className={isDark ? 'px-4 py-3 font-semibold text-slate-100' : 'px-4 py-3 font-semibold text-slate-900'}>{s.fullName}</td>
                      <td className={isDark ? 'px-4 py-3 text-slate-300 text-xs sm:text-sm' : 'px-4 py-3 text-slate-700 text-xs sm:text-sm'}>{s.collegeEmail}</td>
                      <td className={isDark ? 'px-4 py-3 text-slate-400' : 'px-4 py-3 text-slate-600'}>{s.registrationNumber || s.usn || 'NA'}</td>
                      <td className="px-4 py-3">{getCourseLabel(s.course)}</td>
                      <td className="px-4 py-3">{getBranchLabel(s.course, s.branch || s.fieldOfStudy)}</td>
                      <td className="px-4 py-3">{s.graduationYear}</td>
                      <td className={isDark ? 'px-4 py-3 text-slate-400 text-xs' : 'px-4 py-3 text-slate-600 text-xs'}>
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-slate-400">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-600 text-white transition flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                        page === currentPage
                          ? 'bg-cyan-600 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-600 text-white transition flex items-center gap-1"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default Students;
