// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import { ExternalLink, Video, Building2, Leaf } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

function VirtualTour() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <div className="w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 font-outfit">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20" data-aos="fade-up">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4">
            Explore <span className="text-cyan-400">GIET University</span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
            Discover our world-class campus, cutting-edge facilities, and commitment to sustainability
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {/* Virtual Tour Card */}
          <div 
            className="group relative overflow-hidden p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/30 border border-slate-700/60 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20"
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 to-transparent group-hover:from-cyan-600/10 transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Video className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">360° Virtual Tour</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">Step into our campus and explore world-class infrastructure, innovation centers, and vibrant student life</p>
              <a 
                href="https://360virtualtour.giet.edu/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/40 transition-all duration-300 group/btn hover:gap-3"
              >
                Take Tour
                <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Campus Facilities Card */}
          <div 
            className="group relative overflow-hidden p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/30 border border-slate-700/60 hover:border-blue-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent group-hover:from-blue-600/10 transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">World-Class Facilities</h3>
              <ul className="text-slate-300 space-y-3 mb-4">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span>Modern Laboratories & Labs</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span>State-of-the-art Library</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span>Sports Complex & Gymnasium</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span>Innovation & Research Centers</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span>Smart Classrooms & Auditorium</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Environmental Sustainability Card */}
          <div 
            className="group relative overflow-hidden p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/30 border border-slate-700/60 hover:border-emerald-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20"
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-transparent group-hover:from-emerald-600/10 transition-all duration-300"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Sustainability Initiatives</h3>
              <ul className="text-slate-300 space-y-3">
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  <span>Green Campus Program</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  <span>Solar Power & Renewable Energy</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  <span>Rainwater Harvesting Systems</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  <span>Advanced Waste Management</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  <span>Tree Plantation & Eco-Friendly Campus</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VirtualTour;
