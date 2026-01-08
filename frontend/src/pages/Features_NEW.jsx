import { useEffect } from "react";
import { FaUsers, FaCalendar, FaBriefcase, FaComment, FaUserTie, FaTrophy, FaArrowRight, FaStar } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

function Features() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 100 });
  }, []);

  const features = [
    {
      icon: FaUsers,
      title: "Alumni Network",
      description: "Connect with thousands of alumni worldwide. Build meaningful relationships and expand your professional network across industries and geographies.",
      color: "cyan",
      delay: 0
    },
    {
      icon: FaCalendar,
      title: "Event Management",
      description: "Discover and organize alumni gatherings, workshops, and seminars. Stay updated with the latest events and reunions happening in your network.",
      color: "blue",
      delay: 100
    },
    {
      icon: FaBriefcase,
      title: "Job Opportunities",
      description: "Access exclusive job postings from companies that value GIET alumni. Find career growth opportunities tailored to your expertise and aspirations.",
      color: "green",
      delay: 200
    },
    {
      icon: FaComment,
      title: "Direct Messaging",
      description: "Communicate seamlessly with fellow alumni and mentors. Share insights, advice, and collaborate on projects with your network.",
      color: "purple",
      delay: 300
    },
    {
      icon: FaUserTie,
      title: "Mentorship Program",
      description: "Learn from experienced alumni mentors. Get guidance on career decisions, skill development, and personal growth from industry experts.",
      color: "pink",
      delay: 400
    },
    {
      icon: FaTrophy,
      title: "Success Stories",
      description: "Celebrate alumni achievements and milestones. Get inspired by success stories from your peers and share your own journey.",
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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 font-outfit">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mb-20" data-aos="fade-up">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-4">
            <span className="text-cyan-400">Powerful Features</span>
            <br />
            For Your Success
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Everything you need to stay connected, grow professionally, and achieve your goals
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                <p className="text-slate-400 leading-relaxed mb-6">{feature.description}</p>

                {/* Bottom Arrow */}
                <div className={`flex items-center gap-2 ${colors.icon} font-semibold`}>
                  <span>Learn more</span>
                  <FaArrowRight className="text-lg group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto mb-20" data-aos="fade-up">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-12">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Why Choose Alumni Connect?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "10,000+ Alumni", desc: "Active community members" },
              { title: "500+ Mentors", desc: "Industry experts ready to guide" },
              { title: "200+ Jobs", desc: "Exclusive opportunities" },
              { title: "95% Rating", desc: "Trusted by our community" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center" data-aos="fade-up" data-aos-delay={idx * 100}>
                <h4 className="text-3xl font-bold text-cyan-400 mb-2">{stat.title}</h4>
                <p className="text-slate-300">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto mb-20" data-aos="fade-up">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">How It Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: "1", title: "Register", desc: "Create your alumni profile and join the community" },
            { step: "2", title: "Connect", desc: "Browse and connect with fellow alumni and mentors" },
            { step: "3", title: "Engage", desc: "Participate in events, mentorship, and discussions" },
            { step: "4", title: "Grow", desc: "Advance your career and build lasting relationships" }
          ].map((item, idx) => (
            <div key={idx} className="text-center" data-aos="fade-up" data-aos-delay={idx * 100}>
              <div className="bg-gradient-to-br from-cyan-900/30 to-cyan-950/30 border border-cyan-700/50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <span className="text-5xl font-bold text-cyan-400">{item.step}</span>
              </div>
              <h4 className="text-2xl font-bold text-white mb-3">{item.title}</h4>
              <p className="text-slate-400">{item.desc}</p>
              {idx < 3 && (
                <div className="hidden md:block absolute left-1/2 mt-8 ml-12 text-cyan-400/50">
                  <FaArrowRight className="text-3xl" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="max-w-7xl mx-auto mb-20" data-aos="fade-up">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-12">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">Premium Capabilities</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6" data-aos="fade-right">
              <h3 className="text-2xl font-bold text-cyan-400 mb-6">For Alumni</h3>
              {[
                "Showcase your professional achievements",
                "Find and apply for exclusive job opportunities",
                "Join mentorship programs",
                "Organize and attend networking events",
                "Collaborate on projects and startups",
                "Build your professional reputation"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaStar className="text-white text-sm" />
                  </div>
                  <span className="text-slate-300 text-lg">{item}</span>
                </div>
              ))}
            </div>

            <div className="space-y-6" data-aos="fade-left">
              <h3 className="text-2xl font-bold text-blue-400 mb-6">For Students</h3>
              {[
                "Access mentorship from experienced alumni",
                "Learn from real-world industry insights",
                "Network with peers and seniors",
                "Discover internship opportunities",
                "Get career guidance and advice",
                "Build connections before graduation"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaStar className="text-white text-sm" />
                  </div>
                  <span className="text-slate-300 text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto" data-aos="fade-up">
        <div className="bg-gradient-to-r from-cyan-900/40 via-blue-900/40 to-purple-900/40 border border-cyan-700/50 rounded-2xl shadow-2xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Join Our Community?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Start building your professional network today. Connect with alumni, mentors, and peers who share your vision of success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
              <span>Get Started</span>
              <FaArrowRight />
            </button>
            <button className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 font-bold py-4 px-8 rounded-lg transition-all">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Features;
