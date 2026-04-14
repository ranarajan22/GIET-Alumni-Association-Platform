// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import AboutImage from "../assets/About.png";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { ArrowRight, Zap, Users, Target, Award, TrendingUp } from "lucide-react";

function Header() {
  const [scrollY, setScrollY] = useState(0);
  const heroShowcaseImage = "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1400";
  const careerSectionImage = "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1400";

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
      <div className="relative w-full min-h-[calc(100vh-4rem)] lg:min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        {/* Grid Background Pattern */}
        <div className="absolute inset-0 opacity-[0.07]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(0deg, transparent 24%, rgba(255,255,255,.06) 25%, rgba(255,255,255,.06) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.06) 75%, rgba(255,255,255,.06) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.06) 25%, rgba(255,255,255,.06) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.06) 75%, rgba(255,255,255,.06) 76%, transparent 77%, transparent)",
              backgroundSize: "52px 52px",
            }}
          ></div>
        </div>

        {/* Ambient Blobs */}
        <div
          className="absolute inset-0 opacity-30"
          style={{ transform: `translateY(${scrollY * 0.45}px)` }}
        >
          <div className="absolute top-24 -left-10 w-96 h-96 bg-blue-500/70 rounded-full mix-blend-screen blur-3xl animate-blob"></div>
          <div className="absolute top-20 right-0 w-[28rem] h-[28rem] bg-cyan-500/60 rounded-full mix-blend-screen blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-indigo-500/50 rounded-full mix-blend-screen blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-12 sm:pb-16 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 text-left" data-aos="fade-up" data-aos-delay="80">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-300/10 px-4 py-2 text-xs sm:text-sm font-semibold tracking-wide uppercase text-cyan-100">
                <Zap className="w-4 h-4" />
                Career Network For GIET Alumni
              </div>

              <h1 className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.98]">
                Build Your
                <span className="block bg-gradient-to-r from-cyan-300 via-sky-300 to-lime-300 bg-clip-text text-transparent">
                  Professional Legacy
                </span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-slate-200/95 max-w-2xl leading-relaxed">
                Connect with industry leaders, access trusted mentorship, and discover curated opportunities through one modern alumni ecosystem.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
                <div className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-md px-4 py-3">
                  <p className="text-cyan-200 font-bold text-xl">10K+</p>
                  <p className="text-slate-200 text-sm">Active Alumni</p>
                </div>
                <div className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-md px-4 py-3">
                  <p className="text-cyan-200 font-bold text-xl">500+</p>
                  <p className="text-slate-200 text-sm">Expert Mentors</p>
                </div>
                <div className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-md px-4 py-3">
                  <p className="text-cyan-200 font-bold text-xl">200+</p>
                  <p className="text-slate-200 text-sm">Job Openings</p>
                </div>
              </div>

              <div className="mt-9 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/roleselection")}
                  className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl shadow-xl hover:shadow-cyan-500/30 hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-base sm:text-lg overflow-hidden cursor-pointer"
                >
                  <span className="relative z-10">Join Network</span>
                  <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-4 border border-slate-300/60 text-slate-100 hover:text-white font-bold rounded-xl transition-all duration-300 hover:bg-white/10 backdrop-blur-sm text-base sm:text-lg cursor-pointer"
                >
                  Sign In
                </button>
              </div>

              <div className="mt-9 space-y-3 text-slate-200">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-cyan-300" />
                  <span>Verified alumni and student profiles</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-cyan-300" />
                  <span>Mentorship, jobs, events, and collaboration in one place</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-cyan-300" />
                  <span>Professional-first platform for long-term career growth</span>
                </div>
              </div>
            </div>

            {/* Right Showcase */}
            <div className="lg:col-span-5 relative" data-aos="fade-left" data-aos-delay="160">
              <div className="relative rounded-[28px] border border-cyan-200/30 bg-slate-900/55 backdrop-blur-xl p-4 sm:p-5 shadow-2xl">
                <div className="absolute inset-0 rounded-[28px] bg-gradient-to-b from-cyan-300/10 via-transparent to-blue-500/10 pointer-events-none"></div>

                <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-slate-950/60">
                  <img
                    src={heroShowcaseImage}
                    alt="GIET University Campus Achievement"
                    className="w-full h-[340px] sm:h-[390px] object-cover object-center"
                    onError={(e) => {
                      e.currentTarget.src = AboutImage;
                    }}
                  />

                  <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-slate-950/95 via-slate-950/70 to-transparent">
                    <p className="text-white font-semibold text-lg">Trusted Alumni Community</p>
                    <p className="mt-1 text-slate-200 text-sm leading-relaxed">
                      Build meaningful professional connections with verified mentors, peers, and recruiters.
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3">
                    <p className="text-emerald-300 font-bold text-lg">95%</p>
                    <p className="text-slate-200 text-xs">Engagement Rate</p>
                  </div>
                  <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3">
                    <p className="text-sky-300 font-bold text-lg">24/7</p>
                    <p className="text-slate-200 text-xs">Platform Access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            className="w-6 h-6 text-blue-200/80"
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
              <div className="rounded-3xl border border-cyan-200/25 bg-slate-900/60 backdrop-blur-lg p-3 shadow-2xl">
                <div className="relative overflow-hidden rounded-2xl border border-white/15">
                  <img
                    src={careerSectionImage}
                    alt="Alumni mentorship and career guidance"
                    className="w-full h-[320px] sm:h-[380px] object-cover object-center"
                    onError={(e) => {
                      e.currentTarget.src = AboutImage;
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-5">
                    <p className="text-white font-semibold text-lg">Mentorship That Creates Momentum</p>
                    <p className="mt-1 text-slate-200 text-sm">Learn from accomplished alumni and accelerate your career decisions with confidence.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
