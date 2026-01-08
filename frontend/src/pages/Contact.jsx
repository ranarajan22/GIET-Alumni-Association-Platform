import React, { useState, useEffect } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube, FaWhatsapp, FaGlobe, FaClock, FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import { API_BASE_URL } from '../config';
import AOS from "aos";
import "aos/dist/aos.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 100 });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Send to backend
      await axios.post(`${API_BASE_URL}/contact/submit`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      });
      
      console.log("Form submitted:", formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      // Show error message
      const errorMsg = err.response?.data?.message || 'Error submitting form';
      setError(errorMsg);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 font-outfit">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mb-16" data-aos="fade-up">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-4">Get In <span className="text-cyan-400">Touch</span></h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">We're here to help. Reach out to us through any channel that's convenient for you.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            {/* Main Contact Details */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-8" data-aos="fade-up">
              <h2 className="text-3xl font-bold text-white mb-8">GIET University</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 pb-6 border-b border-slate-700">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-cyan-500/50">
                    <FaMapMarkerAlt className="text-cyan-400 text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-1">Address</h3>
                    <p className="text-slate-400">Gobriguda, Po-Kharling, Gunupur, Rayagada, Odisha 765022</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-6 border-b border-slate-700">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-500/50">
                    <FaEnvelope className="text-blue-400 text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-1">Email</h3>
                    <a href="mailto:enquiry@giet.edu" className="text-blue-400 hover:text-blue-300 transition">enquiry@giet.edu</a>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-6 border-b border-slate-700">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-green-500/50">
                    <FaPhone className="text-green-400 text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-1">Phone</h3>
                    <p className="text-slate-400"><a href="tel:+917735745535" className="hover:text-cyan-400 transition">+91-7735745535</a></p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-purple-500/50">
                    <FaGlobe className="text-purple-400 text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-1">Website</h3>
                    <a href="https://www.giet.edu" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition">www.giet.edu</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Department-wise Contacts */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-8" data-aos="fade-up" data-aos-delay="100">
              <h2 className="text-2xl font-bold text-white mb-6">Department Contacts</h2>
              
              <div className="space-y-4">
                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 hover:border-cyan-500/50 transition">
                  <h3 className="font-semibold text-cyan-300 mb-2">Alumni Office</h3>
                  <p className="text-slate-300 text-sm"><a href="mailto:alumni@giet.edu" className="hover:text-cyan-400">alumni@giet.edu</a> | <a href="tel:+917735745535" className="hover:text-cyan-400">+91-7735745535</a></p>
                </div>

                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 hover:border-blue-500/50 transition">
                  <h3 className="font-semibold text-blue-300 mb-2">Placement Cell</h3>
                  <p className="text-slate-300 text-sm"><a href="mailto:placements@giet.edu" className="hover:text-blue-400">placements@giet.edu</a> | <a href="tel:+917735745535" className="hover:text-blue-400">+91-7735745535</a></p>
                </div>

                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 hover:border-green-500/50 transition">
                  <h3 className="font-semibold text-green-300 mb-2">Mentorship Coordinator</h3>
                  <p className="text-slate-300 text-sm"><a href="mailto:mentorship@giet.edu" className="hover:text-green-400">mentorship@giet.edu</a> | <a href="tel:+917735745535" className="hover:text-green-400">+91-7735745535</a></p>
                </div>

                <div className="bg-slate-700/30 border border-slate-600 rounded-lg p-4 hover:border-purple-500/50 transition">
                  <h3 className="font-semibold text-purple-300 mb-2">Technical Support</h3>
                  <p className="text-slate-300 text-sm"><a href="mailto:support@giet.edu" className="hover:text-purple-400">support@giet.edu</a> | <a href="tel:+917735745535" className="hover:text-purple-400">+91-7735745535</a></p>
                </div>
              </div>
            </div>

          </div>

          {/* Request a Call Back Form */}
          <div className="space-y-6">
            {/* Form Container */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 h-fit" data-aos="fade-up">
              <h2 className="text-2xl font-bold text-white mb-1">Send us a Message</h2>
              <p className="text-slate-400 mb-4">We'll get back to you within 24 hours</p>
            
              {submitted && (
                <div className="bg-green-500/20 border border-green-500/50 text-green-300 p-4 rounded-lg mb-4 flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  <span>Thank you! We'll contact you soon.</span>
                </div>
              )}

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-4 rounded-lg mb-4 flex items-center gap-2">
                  <span className="text-2xl">✕</span>
                  <span>{error}</span>
                </div>
              )}
            
              <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                    placeholder="+91-XXXXXXXXXX"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-slate-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                  placeholder="What is this regarding?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-slate-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition resize-none"
                  placeholder="Tell us more about your inquiry..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-2 px-6 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                <FaPaperPlane className="text-lg" />
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
            </div>

            {/* Emergency Contacts Container */}
            <div className="bg-gradient-to-br from-red-900/30 to-red-950/30 border border-red-700/50 rounded-2xl shadow-2xl p-8" data-aos="fade-up" data-aos-delay="200">
              <div className="flex items-center gap-3 mb-6">
                <FaClock className="text-red-400 text-2xl" />
                <h2 className="text-2xl font-bold text-red-300">24/7 Emergency Support</h2>
              </div>
              
              <div className="space-y-4">
                <div className="bg-red-950/30 border border-red-700/30 rounded-lg p-4">
                  <h3 className="font-semibold text-red-300 mb-2">Anti-Ragging Helpline</h3>
                  <p className="text-slate-300 text-sm">📞 <a href="tel:+917735745535" className="hover:text-red-400">+91-7735745535</a></p>
                  <p className="text-slate-300 text-sm">✉️ <a href="mailto:antiragging@giet.edu" className="hover:text-red-400">antiragging@giet.edu</a></p>
                </div>

                <div className="bg-red-950/30 border border-red-700/30 rounded-lg p-4">
                  <h3 className="font-semibold text-red-300 mb-2">Student Grievance Redressal</h3>
                  <p className="text-slate-300 text-sm">📞 <a href="tel:+917735745535" className="hover:text-red-400">+91-7735745535</a></p>
                  <p className="text-slate-300 text-sm">✉️ <a href="mailto:grievance@giet.edu" className="hover:text-red-400">grievance@giet.edu</a></p>
                </div>
              </div>
            </div>
          </div>

          </div>

        {/* Google Maps Embed */}
        <div className="mt-16 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-8 overflow-hidden" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-white mb-6">Find Our Location</h2>
          <div className="w-full h-[500px] rounded-xl overflow-hidden border border-slate-600 shadow-xl">
            <iframe
              src="https://maps.google.com/maps?q=19.0483316,83.8322469&z=16&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="GIET University Location"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
