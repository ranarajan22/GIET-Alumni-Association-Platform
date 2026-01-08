// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils/utils';
import { ToastContainer } from 'react-toastify';
import api from '../utils/api';
import { Eye, EyeOff } from 'lucide-react';

function StudentReg() {
  const [fullName, setFullName] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [collegeEmail, setCollegeEmail] = useState('');
  const [course, setCourse] = useState('');
  const [usn, setUsn] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^\S+@\S+\.\S+$/;
    const urlValid = (url) => {
      try {
        // eslint-disable-next-line no-new
        new URL(url);
        return true;
      } catch (e) {
        return false;
      }
    };
    if (!fullName) newErrors.fullName = 'Full name is required';
    if (!graduationYear) newErrors.graduationYear = 'Graduation year is required';
    if (!collegeEmail) newErrors.collegeEmail = 'College email is required';
    else if (!emailRegex.test(collegeEmail)) newErrors.collegeEmail = 'Enter a valid email';
    if (!course) newErrors.course = 'Course is required';
    if (!usn) newErrors.usn = 'Registration number is required';
    if (!fieldOfStudy) newErrors.fieldOfStudy = 'Branch is required';
    if (linkedin && !urlValid(linkedin)) newErrors.linkedin = 'Enter a valid URL';
    if (github && !urlValid(github)) newErrors.github = 'Enter a valid URL';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Minimum 8 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Confirm your password';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!profilePhoto) newErrors.profilePhoto = 'Profile photo is required';
    else if (profilePhoto.size > 2 * 1024 * 1024) newErrors.profilePhoto = 'Max file size is 2MB';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('graduationYear', graduationYear);
    formData.append('collegeEmail', collegeEmail);
    formData.append('course', course);
    formData.append('usn', usn);
    formData.append('fieldOfStudy', fieldOfStudy);
    formData.append('linkedin', linkedin);
    formData.append('github', github);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);
    formData.append('image', profilePhoto);

    try {
      const { data } = await api.post('/auth/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.success) {
        handleSuccess(data.message);
        localStorage.setItem('userId', data._id);
        setTimeout(() => navigate('/login'), 1000);
      } else {
        handleError(data.message);
      }
    } catch (error) {
      handleError(error.response?.data?.message || error.message);
    }
  };

  const years = Array.from({ length: 5 }, (_, i) => 2024 + i);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-16 px-4 font-outfit">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-cyan-400 text-xs uppercase tracking-[0.3em]">Join as student</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mt-2">Create your student profile</h2>
            <p className="text-slate-400 mt-3 text-sm md:text-base">Tell us about your course and links so alumni can find and mentor you.</p>
          </div>

          <form onSubmit={submitForm} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
            <div className="flex flex-col gap-2">
              <label htmlFor="fullName" className="text-slate-300 text-sm">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.fullName && <p className="text-rose-400 text-xs">{errors.fullName}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="graduationYear" className="text-slate-300 text-sm">Graduation Year</label>
              <input
                type="number"
                id="graduationYear"
                name="graduationYear"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                min="1900"
                max="2100"
                placeholder="Enter graduation year"
                className="bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.graduationYear && <p className="text-rose-400 text-xs">{errors.graduationYear}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="collegeEmail" className="text-slate-300 text-sm">College Email Address</label>
              <input
                type="email"
                id="collegeEmail"
                name="collegeEmail"
                value={collegeEmail}
                onChange={(e) => setCollegeEmail(e.target.value)}
                placeholder="Enter your college mail"
                className="bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.collegeEmail && <p className="text-rose-400 text-xs">{errors.collegeEmail}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="course" className="text-slate-300 text-sm">Course</label>
              <input
                type="text"
                id="course"
                name="course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="Enter your course"
                className="bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.course && <p className="text-rose-400 text-xs">{errors.course}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="usn" className="text-slate-300 text-sm">Registration Number</label>
              <input
                type="text"
                id="usn"
                name="usn"
                value={usn}
                onChange={(e) => setUsn(e.target.value)}
                placeholder="Enter your registration number"
                className="bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.usn && <p className="text-rose-400 text-xs">{errors.usn}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="fieldOfStudy" className="text-slate-300 text-sm">Branch</label>
              <input
                type="text"
                id="fieldOfStudy"
                name="fieldOfStudy"
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                placeholder="Enter your branch"
                className="bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.fieldOfStudy && <p className="text-rose-400 text-xs">{errors.fieldOfStudy}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="linkedin" className="text-slate-300 text-sm">LinkedIn</label>
              <input
                type="url"
                id="linkedin"
                name="linkedin"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="Enter your LinkedIn URL"
                className="bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.linkedin && <p className="text-rose-400 text-xs">{errors.linkedin}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="github" className="text-slate-300 text-sm">GitHub</label>
              <input
                type="url"
                id="github"
                name="github"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="Enter your GitHub URL"
                className="bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              {errors.github && <p className="text-rose-400 text-xs">{errors.github}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-slate-300 text-sm">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
              {errors.password && <p className="text-rose-400 text-xs">{errors.password}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-slate-300 text-sm">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-200"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-rose-400 text-xs">{errors.confirmPassword}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="profilePhoto" className="text-slate-300 text-sm">Profile Photo</label>
              <input
                type="file"
                id="profilePhoto"
                name="image"
                accept="image/*"
                onChange={(e) => setProfilePhoto(e.target.files[0])}
                className="bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-cyan-500 file:text-white file:cursor-pointer"
              />
              {errors.profilePhoto && <p className="text-rose-400 text-xs">{errors.profilePhoto}</p>}
            </div>

            <div className="md:col-span-2 flex flex-col gap-3">
              <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-cyan-400 hover:to-blue-400 transition">
                Create Student Account
              </button>
              <p className="text-center text-slate-400 text-sm">Already registered? <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">Login</Link></p>
            </div>
          </form>

          <ToastContainer />
        </div>
      </div>
    </>
  );
}

export default StudentReg;
