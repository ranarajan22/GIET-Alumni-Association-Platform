
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils/utils';
import { ToastContainer } from 'react-toastify';
import api from '../utils/api';
import { Eye, EyeOff } from 'lucide-react';

function AlumniReg() {
  const [fullName, setFullName] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [collegeEmail, setCollegeEmail] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [degreeCertificate, setDegreeCertificate] = useState(null);
  const [degreeCertificateImage, setDegreeCertificateImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^\S+@\S+\.\S+$/;
    const urlValid = (url) => {
      if (!url) return true;
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
    if (!registrationNumber) newErrors.registrationNumber = 'Registration number is required';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Minimum 8 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Confirm your password';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (linkedin && !urlValid(linkedin)) newErrors.linkedin = 'Enter a valid LinkedIn URL';
    if (!profilePhoto) newErrors.profilePhoto = 'Profile photo is required';
    else if (profilePhoto.size > 2 * 1024 * 1024) newErrors.profilePhoto = 'Max file size is 2MB';
    if (degreeCertificate && !urlValid(degreeCertificate)) newErrors.degreeCertificate = 'Enter a valid certificate URL';
    if (degreeCertificateImage && degreeCertificateImage.size > 2 * 1024 * 1024) newErrors.degreeCertificateImage = 'Max file size is 2MB';

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
    formData.append('registrationNumber', registrationNumber);
    formData.append('password', password);
    formData.append('confirmPassword', confirmPassword);
    formData.append('linkedin', linkedin);
    formData.append('image', profilePhoto);
    if (degreeCertificate) {
      formData.append('degreeCertificate', degreeCertificate);
    }
    if (degreeCertificateImage) {
      formData.append('degreeCertificateImage', degreeCertificateImage);
    }

    try {
      const { data } = await api.post('/api/alumni/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (data.success) {
        handleSuccess(data.message);
        setTimeout(() => navigate('/login'), 1000);
      } else {
        handleError(data.message);
      }
    } catch (error) {
      handleError(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-16 px-4 font-outfit">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-emerald-400 text-xs uppercase tracking-[0.3em]">Join as alumni</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-white mt-2">Share experience and mentor students</h2>
          <p className="text-slate-400 mt-3 text-sm md:text-base">Verify your profile, add links, and start guiding the next cohort.</p>
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
              placeholder="Enter full name"
              className="bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              placeholder="2018"
              className="bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.graduationYear && <p className="text-rose-400 text-xs">{errors.graduationYear}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="collegeEmail" className="text-slate-300 text-sm">College Email</label>
            <input
              type="email"
              id="collegeEmail"
              name="collegeEmail"
              value={collegeEmail}
              onChange={(e) => setCollegeEmail(e.target.value)}
              placeholder="Enter your college mail"
              className="bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.collegeEmail && <p className="text-rose-400 text-xs">{errors.collegeEmail}</p>}
          </div>

          <div className="flex flex-col gap-2">            <label htmlFor="registrationNumber" className="text-slate-300 text-sm">Registration Number</label>
            <input
              type="text"
              id="registrationNumber"
              name="registrationNumber"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              placeholder="Enter your registration number"
              className="bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.registrationNumber && <p className="text-rose-400 text-xs">{errors.registrationNumber}</p>}
          </div>

          <div className="flex flex-col gap-2">            <label htmlFor="password" className="text-slate-300 text-sm">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                placeholder="Repeat password"
                className="bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
            <label htmlFor="linkedin" className="text-slate-300 text-sm">LinkedIn URL</label>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="https://linkedin.com/in/you"
              className="bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.linkedin && <p className="text-rose-400 text-xs">{errors.linkedin}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="profilePhoto" className="text-slate-300 text-sm">Profile Photo</label>
            <input
              type="file"
              id="profilePhoto"
              name="image"
              accept="image/*"
              onChange={(e) => setProfilePhoto(e.target.files[0])}
              className="bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-emerald-500 file:text-white file:cursor-pointer"
            />
            {errors.profilePhoto && <p className="text-rose-400 text-xs">{errors.profilePhoto}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="degreeCertificate" className="text-slate-300 text-sm">Degree Certificate Link</label>
            <input
              type="url"
              id="degreeCertificate"
              name="degreeCertificate"
              placeholder="Link to your certificate (optional)"
              onChange={(e) => setDegreeCertificate(e.target.value)}
              className="bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {errors.degreeCertificate && <p className="text-rose-400 text-xs">{errors.degreeCertificate}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="degreeCertificateImage" className="text-slate-300 text-sm">Degree Certificate Image</label>
            <input
              type="file"
              id="degreeCertificateImage"
              name="degreeCertificateImage"
              accept="image/*"
              onChange={(e) => setDegreeCertificateImage(e.target.files[0])}
              className="bg-slate-800 text-white border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-emerald-500 file:text-white file:cursor-pointer"
            />
            {errors.degreeCertificateImage && <p className="text-rose-400 text-xs">{errors.degreeCertificateImage}</p>}
          </div>

          <div className="md:col-span-2 flex flex-col gap-3">
            <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white py-3 rounded-xl font-semibold hover:from-emerald-400 hover:to-green-400 transition">
              Create Alumni Account
            </button>
            <p className="text-center text-slate-400 text-sm">Already registered? <a href="/login" className="text-emerald-300 hover:text-emerald-200 font-semibold">Login</a></p>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default AlumniReg;
