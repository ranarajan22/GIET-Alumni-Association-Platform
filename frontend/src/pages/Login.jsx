/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils/utils';
import { ToastContainer } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';
import api from '../utils/api';

function Login() {
    const [loginInfo, setLoginInfo] = useState({
        collegeEmail: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [userType, setUserType] = useState('student');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setLoginInfo({
            ...loginInfo,
            [e.target.name]: e.target.value,
        });
    };

    const handleUserTypeChange = (e) => {
        setUserType(e.target.value); // Update user type based on selection
    };

    const validate = () => {
        const newErrors = {};
        if (!loginInfo.collegeEmail) newErrors.collegeEmail = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(loginInfo.collegeEmail)) newErrors.collegeEmail = 'Enter a valid email';
        if (!loginInfo.password) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const url = userType === 'alumni' ? '/api/alumni/login' : '/auth/login';

        try {
            const { data } = await api.post(url, loginInfo);
            const { success, message, token, fullname, profilePhoto, _id, role } = data;

            if (success) {
                handleSuccess(message);
                
                // Clear old data first
                localStorage.removeItem('userRole');
                localStorage.removeItem('userId');
                
                // Set new data
                localStorage.setItem('token', token);
                localStorage.setItem('profilePhoto', profilePhoto);
                localStorage.setItem('loggedInUser', fullname);
                localStorage.setItem('userId', _id);
                // Enforce correct role routing and disallow admin auth via student/alumni selection
                let effectiveRole = userType;
                if (role === 'admin') {
                    if (userType !== 'admin') {
                        handleError('Use the Admin option to sign in.');
                        return;
                    }
                    effectiveRole = 'admin';
                } else if (userType === 'admin' && role !== 'admin') {
                    handleError('Admin credentials invalid or user is not an admin');
                    return;
                }

                localStorage.setItem('userRole', effectiveRole);

                console.log('Login success - Role:', role, 'UserType:', userType, 'Effective:', effectiveRole); // Debug log

                setTimeout(() => {
                    if (effectiveRole === 'admin') navigate('/admin');
                    else navigate('/dashboard');
                }, 800);
            } else {
                handleError(message || 'Login failed');
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Login failed';
            handleError(message);
        }
    };

    const handleAdminRedirect = () => {
        navigate('/admin'); // Navigate to the Admin Panel
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 text-outfit mt-[-12px] sm:mt-[-16px]">
                <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="hidden lg:flex flex-col justify-center bg-slate-900/60 border border-slate-800 rounded-2xl p-10 shadow-2xl">
                        <h2 className="text-3xl font-semibold text-white mb-4">Welcome back</h2>
                        <p className="text-slate-300 text-sm leading-relaxed mb-6">
                            Sign in to access your dashboard, connect with alumni, and stay updated with events.
                        </p>
                        <ul className="space-y-3 text-slate-200 text-sm">
                            <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-emerald-400"></span>Secure login for students and alumni</li>
                            <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-emerald-400"></span>Access messages, events, and mentorships</li>
                            <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-emerald-400"></span>Fast navigation after successful login</li>
                        </ul>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-xs uppercase tracking-widest text-cyan-400">Access</p>
                                <h3 className="text-2xl font-semibold text-white">Login</h3>
                            </div>
                            <div className="flex bg-slate-800 rounded-full p-1 text-xs text-slate-200">
                                <label className={`px-3 py-1 rounded-full cursor-pointer transition ${userType === 'student' ? 'bg-cyan-500 text-white' : ''}`}>
                                    <input
                                        type="radio"
                                        value="student"
                                        checked={userType === 'student'}
                                        onChange={handleUserTypeChange}
                                        className="hidden"
                                    />
                                    Student
                                </label>
                                <label className={`px-3 py-1 rounded-full cursor-pointer transition ${userType === 'alumni' ? 'bg-cyan-500 text-white' : ''}`}>
                                    <input
                                        type="radio"
                                        value="alumni"
                                        checked={userType === 'alumni'}
                                        onChange={handleUserTypeChange}
                                        className="hidden"
                                    />
                                    Alumni
                                </label>
                                <label className={`px-3 py-1 rounded-full cursor-pointer transition ${userType === 'admin' ? 'bg-cyan-500 text-white' : ''}`}>
                                    <input
                                        type="radio"
                                        value="admin"
                                        checked={userType === 'admin'}
                                        onChange={handleUserTypeChange}
                                        className="hidden"
                                    />
                                    Admin
                                </label>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="collegeEmail" className="text-slate-300 text-sm mb-2 block">Email</label>
                                <input
                                    type="text"
                                    id="collegeEmail"
                                    name="collegeEmail"
                                    value={loginInfo.collegeEmail}
                                    onChange={handleChange}
                                    className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    placeholder="name@college.edu"
                                />
                                {errors.collegeEmail && <p className="text-rose-400 text-xs mt-1">{errors.collegeEmail}</p>}
                            </div>
                            <div>
                                <label htmlFor="password" className="text-slate-300 text-sm mb-2 block">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={loginInfo.password}
                                        onChange={handleChange}
                                        className="w-full bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-12"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-200"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-rose-400 text-xs mt-1">{errors.password}</p>}
                                <p className="text-slate-500 text-xs mt-1">Use at least 8 characters.</p>
                            </div>
                            <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:from-cyan-400 hover:to-blue-400 transition">
                                Continue to Dashboard
                            </button>
                        </form>

                        <p className="text-slate-400 text-center text-sm mt-6">
                            Don't have an account?{' '}
                            <Link to="/roleselection" className="text-cyan-400 hover:text-cyan-300 font-semibold">Register here</Link>
                        </p>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </>
    );
}

export default Login;
