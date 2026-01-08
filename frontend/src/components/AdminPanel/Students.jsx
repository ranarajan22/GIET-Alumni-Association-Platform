import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Users, AlertTriangle, Search, ChevronLeft, ChevronRight, Download } from 'lucide-react';

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterGradYear, setFilterGradYear] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8083';
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      console.log('Fetching students from:', `${base}/admin/students`, 'with token:', !!token);
      const res = await axios.get(`${base}/admin/students`, { headers });
      console.log('Students response:', res.data);
      setStudents(res.data?.students || []);
      setError('');
      setCurrentPage(1);
    } catch (err) {
      console.error('Error fetching students:', err.message, err.response?.data || err);
      setError(`Failed to fetch students: ${err.response?.data?.message || err.message}`);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort logic
  const filteredStudents = useMemo(() => {
    let result = students.filter((s) => {
      const matchesSearch =
        s.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.collegeEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.usn?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCourse = !filterCourse || s.course === filterCourse;
      const matchesYear = !filterGradYear || s.graduationYear.toString() === filterGradYear;
      return matchesSearch && matchesCourse && matchesYear;
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
  }, [students, searchQuery, filterCourse, filterGradYear, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedStudents = filteredStudents.slice(startIdx, startIdx + itemsPerPage);

  // Get unique values for filters
  const courses = [...new Set(students.map((s) => s.course))].filter(Boolean).sort();
  const gradYears = [...new Set(students.map((s) => s.graduationYear))].sort().reverse();

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'USN', 'Course', 'Grad Year', 'Joined'];
    const rows = filteredStudents.map((s) => [
      s.fullName,
      s.collegeEmail,
      s.usn,
      s.course,
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

  return (
    <section className="bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl backdrop-blur p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Roster</p>
          <h2 className="text-2xl font-bold text-white">Students</h2>
          <p className="text-sm text-slate-400">
            {total} total • Showing {paginatedStudents.length} of {filteredStudents.length} results
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={fetchStudents}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm font-semibold text-white"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, email, or USN..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <select
          value={filterCourse}
          onChange={(e) => {
            setFilterCourse(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
        >
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={filterGradYear}
          onChange={(e) => {
            setFilterGradYear(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
        >
          <option value="">All Years</option>
          {gradYears.map((y) => (
            <option key={y} value={y}>
              Class of {y}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
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
            <div key={i} className="h-12 bg-slate-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-200 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl text-center text-slate-300">
          <Users className="w-8 h-8 mx-auto text-slate-500 mb-2" />
          No students found matching your criteria.
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-slate-800">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left text-slate-200">
                <thead className="bg-slate-800 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">USN</th>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">Grad Year</th>
                    <th className="px-4 py-3">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {paginatedStudents.map((s) => (
                    <tr key={s._id} className="hover:bg-slate-800/60 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-100">{s.fullName}</td>
                      <td className="px-4 py-3 text-slate-300 text-xs sm:text-sm">{s.collegeEmail}</td>
                      <td className="px-4 py-3 text-slate-400">{s.usn}</td>
                      <td className="px-4 py-3">{s.course}</td>
                      <td className="px-4 py-3">{s.graduationYear}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
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
