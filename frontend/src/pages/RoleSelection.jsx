// eslint-disable-next-line no-unused-vars
import React from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom'; // Assuming you're using react-router for navigation
import { useNavigate } from 'react-router-dom';


function RoleSelection() {
  const navigate = useNavigate()
  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 font-outfit mt-[-20px] sm:mt-[-28px]">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-10">
          <p className="text-cyan-400 text-xs uppercase tracking-[0.3em]">Get started</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-white mt-2">Choose how you want to join</h2>
          <p className="text-slate-400 mt-3 text-sm md:text-base">Pick the track that matches your journey. You can switch later by re-registering.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-slate-800 bg-slate-900 rounded-2xl p-8 shadow-2xl hover:border-cyan-500/60 transition">
            <div className="flex items-center gap-3 mb-4">
              <img src={assets.Student} alt="Student" className="w-16 h-16 object-contain" />
              <div>
                <p className="text-white text-xl font-semibold">Register as Student</p>
                <p className="text-slate-400 text-sm">Access mentoring, events, and opportunities.</p>
              </div>
            </div>
            <ul className="text-slate-300 text-sm space-y-2 mb-6">
              <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-cyan-400"></span>Create your profile and portfolio links</li>
              <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-cyan-400"></span>Apply to mentorships and jobs</li>
              <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-cyan-400"></span>Message alumni and peers</li>
            </ul>
            <button onClick={() => navigate('/student-register')} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-cyan-400 hover:to-blue-400 transition">Student Registration</button>
            <p className="text-slate-400 text-center text-sm mt-4">Already have an account? <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">Login</Link></p>
          </div>

          <div className="border border-slate-800 bg-slate-900 rounded-2xl p-8 shadow-2xl hover:border-emerald-500/60 transition">
            <div className="flex items-center gap-3 mb-4">
              <img src={assets.Alumni} alt="Alumni" className="w-16 h-16 object-contain" />
              <div>
                <p className="text-white text-xl font-semibold">Register as Alumni</p>
                <p className="text-slate-400 text-sm">Guide students and expand your network.</p>
              </div>
            </div>
            <ul className="text-slate-300 text-sm space-y-2 mb-6">
              <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-emerald-400"></span>Verify credentials and showcase expertise</li>
              <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-emerald-400"></span>Host mentorships and events</li>
              <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-emerald-400"></span>Share jobs and connect with students</li>
            </ul>
            <button onClick={() => navigate('/alumni-register')} className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 rounded-xl font-semibold hover:from-emerald-400 hover:to-green-400 transition">Alumni Registration</button>
            <p className="text-slate-400 text-center text-sm mt-4">Already have an account? <Link to="/login" className="text-emerald-300 hover:text-emerald-200 font-semibold">Login</Link></p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default RoleSelection;
