// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from '../config';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { assets } from "../assets/assets";

const EnhancedFooter = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      await axios.post(`${API_BASE_URL}/subscribers/subscribe`, { email });
      
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to subscribe. Please try again.';
      setError(errorMsg);
      setTimeout(() => setError(""), 3000);
      console.error('Subscription error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-outfit bg-gray-900 text-white">
      {/* Newsletter Subscription */}
      <div className="bg-gradient-to-r from-primary to-orange-600 px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold mb-2 text-center">Stay Connected</h3>
          <p className="text-center mb-4 opacity-90">Subscribe to our newsletter for updates on events, opportunities, and alumni news</p>
          
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none"
              required
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
          
          {subscribed && (
            <p className="text-center mt-3 text-green-200">✓ Thank you for subscribing!</p>
          )}

          {error && (
            <p className="text-center mt-3 text-red-300">✕ {error}</p>
          )}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
            {/* Logo & About */}
            <div className="lg:col-span-1">
              <img className="mb-5 w-32" src={assets.Logo} alt="Alumni Connect" />
              <p className="text-gray-400 text-sm leading-6 mb-4">
                Connecting alumni, empowering students, and fostering a vibrant professional community.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-primary">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/" className="hover:text-white transition">Home</a></li>
                <li><a href="/about" className="hover:text-white transition">About Us</a></li>
                <li><a href="/contact" className="hover:text-white transition">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition">Sitemap</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-primary">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-primary">Get In Touch</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-white transition">
                  📞 +91-7735745535<br />
                  <span className="text-xs">06857-250172</span>
                </li>
                <li className="hover:text-white transition">✉️ enquiry@giet.edu</li>
                <li className="hover:text-white transition">📍 Gunupur, Odisha</li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-bold mb-4 text-primary">Follow Us</h4>
              <div className="flex flex-wrap gap-3">
                <a href="https://facebook.com/gietuniversitygunupur" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition">
                  <FaFacebook />
                </a>
                <a href="https://twitter.com/gietuniversity" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center hover:bg-sky-600 transition">
                  <FaTwitter />
                </a>
                <a href="https://linkedin.com/school/gietuniversitygunupur" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition">
                  <FaLinkedin />
                </a>
                <a href="https://instagram.com/gietuniversitygunupur" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition">
                  <FaInstagram />
                </a>
                <a href="https://youtube.com/gietuniversitygunupur" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition">
                  <FaYoutube />
                </a>
                <a href="https://wa.me/917735745535" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition">
                  <FaWhatsapp />
                </a>
              </div>
            </div>
          </div>

          {/* Sitemap & Footer Bottom */}
          <div className="border-t border-gray-700 pt-8">
            <p className="text-gray-400 text-sm mb-4">
              © 2025 Alumni Connect - All Rights Reserved. | Designed with ❤️ for GIET University
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
              <span>Privacy Policy</span>
              <span>•</span>
              <span>Terms of Service</span>
              <span>•</span>
              <span>Cookie Policy</span>
              <span>•</span>
              <span>Accessibility</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedFooter;
