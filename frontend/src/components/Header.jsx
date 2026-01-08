// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import AboutImage from "../assets/About.png";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { ArrowRight, Zap, Users, Target, Award, TrendingUp } from "lucide-react";

function Header() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col items-center">
      {/* Premium Hero Section */}
      <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden flex items-center justify-center pt-6 sm:pt-10">
        {/* Grid Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)",
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>

        {/* Animated Gradient Blobs */}
        <div
          className="absolute inset-0 opacity-20"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
          <div className="absolute top-20 left-10 w-80 h-80 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-10 w-80 h-80 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-80 h-80 bg-blue-400 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left">
              {/* Badge removed as requested */}

              {/* Main Heading */}
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                Build Your{" "}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-yellow-300 bg-clip-text text-transparent">
                  Professional Legacy
                </span>
              </h1>

              {/* Subheading */}
              <p
                className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                Connect with industry leaders, access exclusive mentorship, and discover career opportunities within a vibrant community of innovators and achievers.
              </p>

              {/* Key Benefits */}
              <div
                className="space-y-4 mb-10"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/30 rounded-lg flex items-center justify-center border border-blue-400/50">
                    <Users className="w-6 h-6 text-cyan-300" />
                  </div>
                  <span className="text-slate-200 font-medium">
                    Network with 10,000+ Alumni Professionals
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/30 rounded-lg flex items-center justify-center border border-blue-400/50">
                    <TrendingUp className="w-6 h-6 text-cyan-300" />
                  </div>
                  <span className="text-slate-200 font-medium">
                    Access 200+ Exclusive Job Opportunities
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/30 rounded-lg flex items-center justify-center border border-blue-400/50">
                    <Award className="w-6 h-6 text-cyan-300" />
                  </div>
                  <span className="text-slate-200 font-medium">
                    Learn from 500+ Expert Mentors
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div
                className="flex flex-col sm:flex-row gap-4 z-20 relative"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <button
                  onClick={() => navigate("/roleselection")}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl shadow-2xl hover:shadow-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-lg overflow-hidden cursor-pointer"
                >
                  <span className="relative z-10">Register</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-4 border-2 border-slate-300 text-slate-100 hover:text-white font-bold rounded-xl transition-all duration-300 hover:bg-white/10 backdrop-blur-sm text-lg cursor-pointer"
                >
                  Login
                </button>
              </div>

              {/* Social Proof */}
              <div
                className="mt-12 flex items-center gap-8 pt-8 border-t border-slate-700"
                data-aos="fade-up"
                data-aos-delay="500"
              >
                <div>
                  <p className="text-3xl font-bold text-white">10K+</p>
                  <p className="text-slate-400 text-sm">Active Alumni</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">500+</p>
                  <p className="text-slate-400 text-sm">Mentors</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">200+</p>
                  <p className="text-slate-400 text-sm">Job Openings</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">95%</p>
                  <p className="text-slate-400 text-sm">Placement Rate</p>
                </div>
              </div>
            </div>

            {/* Right Side - Illustration / Image */}
            <div
              className="relative hidden lg:flex justify-center items-center"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-3xl"></div>
              <div className="relative z-10 w-full max-w-md">
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/30 rounded-3xl p-8 backdrop-blur-sm">
                  <img
                    src={AboutImage}
                    alt="Professional Community"
                    className="w-full h-auto rounded-2xl shadow-2xl"
                  />
                </div>

                {/* Floating Cards */}
                <div
                  className="absolute -bottom-10 -left-10 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl backdrop-blur-sm transform hover:scale-105 transition-transform"
                  data-aos="flip-up"
                  data-aos-delay="400"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">95%</p>
                      <p className="text-slate-400 text-xs">Success Rate</p>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute -top-10 -right-10 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl backdrop-blur-sm transform hover:scale-105 transition-transform"
                  data-aos="flip-down"
                  data-aos-delay="500"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Verified</p>
                      <p className="text-slate-400 text-xs">Community</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-blue-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>

      {/* Premium Features Section */}
      <div className="w-full py-20 px-4 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-6xl mx-auto">
          <div
            className="text-center mb-16"
            data-aos="fade-up"
          >
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Why Choose <span className="text-cyan-400">Alumni Connect?</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              We provide everything you need to succeed in your professional journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "Verified Network", desc: "Connect with authenticated alumni and professionals" },
              { icon: Award, title: "Expert Mentorship", desc: "Learn from industry leaders with proven experience" },
              { icon: TrendingUp, title: "Career Growth", desc: "Access exclusive jobs and growth opportunities" },
              { icon: Target, title: "Goal Achievement", desc: "Track progress with structured mentorship plans" },
              { icon: Zap, title: "Real-time Interaction", desc: "Instant messaging and video mentorship sessions" },
              { icon: Users, title: "Community Support", desc: "Join events, webinars, and networking sessions" },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group relative p-8 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl hover:border-cyan-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20"
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About/CTA Section */}
      <div className="w-full py-20 px-4 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
                Empower Your <span className="text-cyan-400">Career Path</span>
              </h2>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Alumni Connect bridges the gap between talented students and experienced professionals, creating meaningful connections that last a lifetime.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "Access to exclusive job opportunities",
                  "Personalized mentorship from industry experts",
                  "Real-time networking and collaboration tools",
                  "Professional development resources",
                  "24/7 community support",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-slate-200 text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate("/roleselection")}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 text-lg inline-flex items-center gap-2"
              >
                Start Your Journey <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div data-aos="fade-left" className="relative">
              <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/30 rounded-3xl p-1 backdrop-blur-sm">
                <img
                  src={AboutImage}
                  alt="Professional Network"
                  className="w-full h-auto rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
