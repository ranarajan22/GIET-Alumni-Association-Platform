// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import { Award, Target, Zap, Star, CheckCircle } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

function InstitutionInfo() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <div className="w-full bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 font-outfit">
      <div className="max-w-7xl mx-auto">
        {/* Title Section */}
        <div className="text-center mb-16 sm:mb-20" data-aos="fade-up">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">GIET University</span>
            <br />
            <span className="text-white">A Hub of Excellence</span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 mt-6 max-w-3xl mx-auto leading-relaxed">
            Odisha, Gunupur | A premier institution recognized for innovation, research, and world-class placement records
          </p>
        </div>

        {/* Key Achievement Banner */}
        <div 
          className="relative mb-20 group"
          data-aos="zoom-in"
          data-aos-delay="100"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div className="relative bg-gradient-to-r from-cyan-600/10 to-blue-600/10 border border-cyan-400/30 rounded-2xl p-8 sm:p-10 lg:p-12 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 shadow-2xl shadow-cyan-500/50">
                  <Award className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Best University in Eastern India for Campus Placement
                </h3>
                <p className="text-lg text-cyan-200">Asia Education Summit & Awards 2020</p>
              </div>
            </div>
          </div>
        </div>

        {/* Accreditations Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6" data-aos="fade-up" data-aos-delay="200">
          {[
            { name: "NAAC", desc: "Accredited", icon: CheckCircle },
            { name: "NIRF", desc: "Ranked", icon: Target },
            { name: "NBA", desc: "Accredited", icon: CheckCircle },
            { name: "AICTE", desc: "Approved", icon: Star },
            { name: "ARIIA", desc: "Ranked", icon: Zap }
          ].map((cred, idx) => {
            const IconComp = cred.icon;
            return (
              <div 
                key={idx}
                className="group relative p-6 sm:p-7 rounded-xl border border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/60 backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10"
                data-aos="fade-up"
                data-aos-delay={100 + idx * 50}
              >
                <div className="flex flex-col items-center mb-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 mb-3 group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all">
                    <IconComp className="w-6 h-6 text-cyan-300" />
                  </div>
                  <h4 className="font-bold text-lg text-white text-center">{cred.name}</h4>
                </div>
                <p className="text-sm text-slate-300 text-center">{cred.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default InstitutionInfo;
