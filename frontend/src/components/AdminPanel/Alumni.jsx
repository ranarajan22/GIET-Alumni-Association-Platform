import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle2, Shield, AlertTriangle, Loader2 } from 'lucide-react';

const Alumni = ({ showAll = false }) => {
  const [alumniList, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8083';

  const makeAbsoluteUrl = (value) => {
    if (!value) return '';
    const lower = value.toLowerCase();
    if (lower.startsWith('http://') || lower.startsWith('https://')) return value;
    return `${apiBase}/${value.replace(/^\//, '')}`;
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
      
      // If alumniData is an array, filter based on showAll prop
      if (alumniData.length > 0) {
        if (showAll) {
          // Show all alumni
          setAlumni(alumniData);
        } else {
          // Show only unverified alumni
          const unverifiedAlumni = alumniData.filter(alum => !alum.verified);
          setAlumni(unverifiedAlumni);
        }
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

  // Function to handle verification
  const handleVerify = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      console.log('Verifying alumni:', id);
      await axios.put(`${apiBase}/admin/alumni/${id}/verify`, null, { headers });
      // Re-fetch the alumni list after verification
      fetchAlumni();
    } catch (error) {
      console.error('Error verifying alumni:', error.message, error.response?.data || error);
      setError(`Failed to verify alumni: ${error.response?.data?.message || error.message}`);
    }
  };

  const skeletons = Array.from({ length: 3 });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{showAll ? 'Complete List' : 'Verification'}</p>
          <h2 className="text-2xl font-bold text-white">{showAll ? 'All Alumni' : 'Pending Alumni'}</h2>
          <p className="text-sm text-slate-400">{showAll ? 'View all registered alumni' : 'Review and verify submitted profiles'}</p>
        </div>
        <Shield className="w-6 h-6 text-cyan-400" />
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
      ) : alumniList.length === 0 ? (
        <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl text-center text-slate-300">
          <Shield className="w-8 h-8 mx-auto text-slate-500 mb-2" />
          {showAll ? 'No alumni registered yet.' : 'No pending verifications.'}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {alumniList.map((alumni) => (
            <div key={alumni._id} className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl shadow-lg">
              <div className="flex items-center gap-4">
                <img
                  src={makeAbsoluteUrl(alumni.profilePhoto)}
                  alt={alumni.fullName}
                  className="w-14 h-14 rounded-full object-cover border border-slate-700"
                />
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-white">{alumni.fullName}</h3>
                  <p className="text-sm text-slate-400">Class of {alumni.graduationYear}</p>
                  {alumni.verified && (
                    <div className="flex items-center gap-1 text-emerald-400 text-xs">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-300">
                <p className="flex justify-between"><span className="text-slate-400">Email:</span> <span className="text-white break-all">{alumni.collegeEmail}</span></p>
                {alumni.registrationNumber && (
                  <p className="flex justify-between"><span className="text-slate-400">Registration No:</span> <span className="text-white">{alumni.registrationNumber}</span></p>
                )}
                {(alumni.course || alumni.fieldOfStudy) && (
                  <p className="flex justify-between"><span className="text-slate-400">Course / Field:</span> <span className="text-white text-right">{alumni.course || '—'}{alumni.course && alumni.fieldOfStudy ? ' • ' : ''}{alumni.fieldOfStudy || ''}</span></p>
                )}
                {alumni.usn && (
                  <p className="flex justify-between"><span className="text-slate-400">USN:</span> <span className="text-white">{alumni.usn}</span></p>
                )}
                <div className="flex flex-wrap gap-2 items-center text-xs">
                  {alumni.linkedin && (
                    <a href={alumni.linkedin} target="_blank" rel="noreferrer" className="px-2 py-1 rounded bg-cyan-500/15 text-cyan-200 border border-cyan-500/30">LinkedIn</a>
                  )}
                  {alumni.github && (
                    <a href={alumni.github} target="_blank" rel="noreferrer" className="px-2 py-1 rounded bg-purple-500/15 text-purple-200 border border-purple-500/30">GitHub</a>
                  )}
                  {alumni.followers && alumni.followers.length > 0 && (
                    <span className="px-2 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">Followers: {alumni.followers.length}</span>
                  )}
                </div>
                {(alumni.degreeCertificate || alumni.degreeCertificateImage) && (
                  <div className="flex gap-2">
                    {alumni.degreeCertificate && (
                      <a
                        href={makeAbsoluteUrl(alumni.degreeCertificate)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-sm font-semibold text-white border border-cyan-500/60"
                      >
                        View Certificate Link
                      </a>
                    )}
                    {alumni.degreeCertificateImage && (
                      <a
                        href={makeAbsoluteUrl(alumni.degreeCertificateImage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-sm font-semibold text-white border border-purple-500/60"
                      >
                        View Certificate Image
                      </a>
                    )}
                  </div>
                )}
              </div>
              {!showAll && !alumni.verified && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-300 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    Pending
                  </div>
                  <button
                    onClick={() => handleVerify(alumni._id)}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm font-semibold text-white shadow"
                  >
                    Verify
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Alumni;
