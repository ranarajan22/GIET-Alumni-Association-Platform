// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import { FaUsers, FaCalendar, FaBriefcase, FaComment, FaUserTie, FaTrophy, FaArrowRight, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

function Features() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 100 });
  }, []);

  const features = [
    {
      icon: FaUsers,
      title: "Alumni Network",
      description: "Connect with thousands of alumni worldwide. Build meaningful relationships and expand your professional network.",
      color: "cyan",
      delay: 0
    },
    {
      icon: FaCalendar,
      title: "Event Management",
      description: "Discover and organize alumni gatherings, workshops, and seminars. Stay updated with the latest events.",
      color: "blue",
      delay: 100
    },
    {
      icon: FaBriefcase,
      title: "Job Opportunities",
      description: "Access exclusive job postings from companies that value GIET alumni. Find career growth opportunities.",
      color: "green",
      delay: 200
    },
    {
      icon: FaComment,
      title: "Direct Messaging",
      description: "Communicate seamlessly with fellow alumni. Share insights and collaborate on projects with your network.",
      color: "purple",
      delay: 300
    },
    {
      icon: FaUserTie,
      title: "Mentorship Program",
      description: "Learn from experienced alumni mentors. Get guidance on career decisions and skill development.",
      color: "pink",
      delay: 400
    },
    {
      icon: FaTrophy,
      title: "Success Stories",
      description: "Celebrate alumni achievements. Get inspired by success stories and share your own journey.",
      color: "yellow",
      delay: 500
    }
  ];

  const colorMap = {
    cyan: { bg: "from-cyan-900/30 to-cyan-950/30", border: "border-cyan-700/50", icon: "text-cyan-400", hover: "hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20" },
    blue: { bg: "from-blue-900/30 to-blue-950/30", border: "border-blue-700/50", icon: "text-blue-400", hover: "hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20" },
    green: { bg: "from-green-900/30 to-green-950/30", border: "border-green-700/50", icon: "text-green-400", hover: "hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/20" },
    purple: { bg: "from-purple-900/30 to-purple-950/30", border: "border-purple-700/50", icon: "text-purple-400", hover: "hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20" },
    pink: { bg: "from-pink-900/30 to-pink-950/30", border: "border-pink-700/50", icon: "text-pink-400", hover: "hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/20" },
    yellow: { bg: "from-yellow-900/30 to-yellow-950/30", border: "border-yellow-700/50", icon: "text-yellow-400", hover: "hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/20" }
  };

  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 py-16 px-4 sm:px-6 lg:px-8 font-outfit">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-4">
            <span className="text-cyan-400">Powerful Features</span>
            <br />
            For Your Success
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Everything you need to stay connected, grow professionally, and achieve your goals
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, idx) => {
            const colors = colorMap[feature.color];
            const IconComponent = feature.icon;
            
            return (
              <div
                key={idx}
                className={`bg-gradient-to-br ${colors.bg} ${colors.border} border rounded-2xl shadow-xl p-8 transition-all duration-300 ${colors.hover}`}
                data-aos="fade-up"
                data-aos-delay={feature.delay}
              >
                {/* Icon Container */}
                <div className={`w-20 h-20 rounded-lg bg-slate-700/30 flex items-center justify-center mb-6 border border-slate-600/50`}>
                  <IconComponent className={`text-4xl ${colors.icon}`} />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-12 mb-16" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">Why Choose Alumni Connect?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "10,000+", desc: "Active Alumni Members" },
              { title: "500+", desc: "Expert Mentors" },
              { title: "200+", desc: "Job Opportunities" },
              { title: "95%", desc: "Community Rating" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center" data-aos="fade-up" data-aos-delay={idx * 100}>
                <h4 className="text-4xl font-bold text-cyan-400 mb-2">{stat.title}</h4>
                <p className="text-slate-300">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/roleselection")}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 mx-auto"
            data-aos="zoom-in"
          >
            <span>Get Started Today</span>
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Features;
