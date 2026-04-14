// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import { Users, TrendingUp, Handshake, Briefcase } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

function StatsSection() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);

  const stats = [
    {
      icon: Users,
      value: "10,000+",
      label: "Active Alumni",
      desc: "Global professional network",
      color: "cyan",
      gradient: "from-cyan-600 to-cyan-500",
      border: "border-cyan-500/30"
    },
    {
      icon: TrendingUp,
      value: "95%",
      label: "Placement Success",
      desc: "Industry-leading placement rate",
      color: "blue",
      gradient: "from-blue-600 to-blue-500",
      border: "border-blue-500/30"
    },
    {
      icon: Handshake,
      value: "500+",
      label: "Expert Mentors",
      desc: "Industry leaders & achievers",
      color: "violet",
      gradient: "from-violet-600 to-violet-500",
      border: "border-violet-500/30"
    },
    {
      icon: Briefcase,
      value: "200+",
      label: "Hiring Partners",
      desc: "Fortune 500 and startups",
      color: "emerald",
      gradient: "from-emerald-600 to-emerald-500",
      border: "border-emerald-500/30"
    }
  ];

  return (
    <div className="w-full bg-gradient-to-b from-slate-900 to-slate-950 py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 font-outfit">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20" data-aos="fade-up">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Proven Impact</span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
            Join a thriving ecosystem of achievers, innovators, and industry leaders
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={idx}
                className={`group relative p-8 sm:p-10 rounded-2xl bg-slate-800/40 border ${stat.border} backdrop-blur-xl hover:bg-slate-800/60 transition-all duration-300 hover:shadow-2xl`}
                data-aos="fade-up"
                data-aos-delay={idx * 100}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>

                {/* Icon */}
                <div className={`relative mb-6 inline-block p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-4xl sm:text-5xl font-black text-white mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-lg font-bold text-slate-100 mb-2 leading-tight">
                    {stat.label}
                  </p>
                  <p className="text-sm sm:text-base text-slate-400">
                    {stat.desc}
                  </p>
                </div>

                {/* Bottom accent */}
                <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${stat.gradient} rounded-full w-0 group-hover:w-full transition-all duration-300`}></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StatsSection;
