import { useEffect } from "react";
import { FaTrophy, FaUniversity, FaUsers, FaHandshake, FaBullseye, FaEye, FaStar, FaAward, FaGraduationCap } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";

function About() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true, offset: 100 });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 font-outfit">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto mb-20" data-aos="fade-up">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-4">
            About <span className="text-cyan-400">Alumni Connect</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Building bridges between past, present, and future leaders of GIET University
          </p>
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="max-w-7xl mx-auto mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div
            className="bg-gradient-to-br from-blue-900/30 to-blue-950/30 border border-blue-700/50 rounded-2xl shadow-2xl p-10"
            data-aos="fade-right"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/50">
                <FaEye className="text-4xl text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">Our Vision</h2>
            </div>
            <p className="text-slate-300 text-lg leading-relaxed">
              To create a vibrant alumni network that fosters lifelong connections, empowers professional growth, and strengthens the bond between past and present members of the GIET University community.
            </p>
          </div>

          <div
            className="bg-gradient-to-br from-cyan-900/30 to-cyan-950/30 border border-cyan-700/50 rounded-2xl shadow-2xl p-10"
            data-aos="fade-left"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/50">
                <FaBullseye className="text-4xl text-cyan-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">Our Mission</h2>
            </div>
            <p className="text-slate-300 text-lg leading-relaxed">
              To facilitate meaningful interactions between alumni and students through mentorship, career guidance, networking opportunities, and collaborative initiatives that contribute to individual and institutional excellence.
            </p>
          </div>
        </div>
      </div>

      {/* Recognition & Awards */}
      <div className="max-w-7xl mx-auto mb-20" data-aos="fade-up">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-12">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-500/50">
              <FaTrophy className="text-4xl text-yellow-400" />
            </div>
            <h2 className="text-4xl font-bold text-white">Recognition & Awards</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-8 hover:border-yellow-500/50 transition">
              <div className="flex items-center gap-3 mb-4">
                <FaStar className="text-yellow-400 text-2xl" />
                <h3 className="text-2xl font-bold text-white">Asia Education Summit 2020</h3>
              </div>
              <p className="text-cyan-300 font-semibold mb-3">Best University in Eastern India for Campus Placement</p>
              <p className="text-slate-400">Awarded by Shri Pratap Chandra Sarangi, Hon&apos;ble Union Minister, MSME, Govt. of India</p>
            </div>

            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-8 hover:border-cyan-500/50 transition">
              <div className="flex items-center gap-3 mb-4">
                <FaAward className="text-cyan-400 text-2xl" />
                <h3 className="text-2xl font-bold text-white">Accreditations</h3>
              </div>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  <span>NAAC Accredited</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  <span>NIRF Ranked</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  <span>NBA Accredited Programs</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                  <span>AICTE Approved & ARIIA Ranked</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Departments & Programs */}
      <div className="max-w-7xl mx-auto mb-20" data-aos="fade-up">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-12">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-16 h-16 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/50">
              <FaUniversity className="text-4xl text-purple-400" />
            </div>
            <h2 className="text-4xl font-bold text-white">Departments & Programs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Engineering Departments", items: ["Computer Science & Engineering", "Electronics & Communication", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Information Technology"] },
              { title: "Specialized Programs", items: ["M.Tech Programs", "Ph.D. Research Programs", "MBA", "MCA", "Integrated Programs"] },
              { title: "International Programs", items: ["International Student Admissions", "Exchange Programs", "Collaborative Research", "Global Partnerships"] }
            ].map((category, idx) => (
              <div key={idx} className="bg-slate-700/30 border border-slate-600 rounded-xl p-8 hover:border-purple-500/50 transition" data-aos="fade-up" data-aos-delay={idx * 100}>
                <h3 className="text-xl font-bold text-purple-300 mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.items.map((item, i) => (
                    <li key={i} className="text-slate-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Special Cells & Committees */}
      <div className="max-w-7xl mx-auto mb-20" data-aos="fade-up">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-12">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-16 h-16 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/50">
              <FaUsers className="text-4xl text-green-400" />
            </div>
            <h2 className="text-4xl font-bold text-white">Special Cells & Committees</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Anti-Ragging Committee", desc: "Ensuring safe campus environment" },
              { name: "Internal Complaints Committee (ICC)", desc: "Addressing workplace grievances" },
              { name: "IQAC", desc: "Internal Quality Assurance Cell" },
              { name: "COVID-19 Cell", desc: "Health & safety monitoring" },
              { name: "NCC Unit", desc: "Elite University Corps Unit" },
              { name: "Innovation Cells", desc: "ACIC, E-YUVA CENTER, IPFC" }
            ].map((cell, idx) => (
              <div key={idx} className="bg-gradient-to-br from-green-900/20 to-green-950/20 border border-green-700/30 rounded-lg p-6 hover:border-green-500/50 transition" data-aos="fade-up" data-aos-delay={idx * 50}>
                <h4 className="font-bold text-green-300 mb-2 text-lg">{cell.name}</h4>
                <p className="text-sm text-slate-400">{cell.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partnerships */}
      <div className="max-w-7xl mx-auto mb-20" data-aos="fade-up">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-12">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-16 h-16 bg-red-500/20 rounded-lg flex items-center justify-center border border-red-500/50">
              <FaHandshake className="text-4xl text-red-400" />
            </div>
            <h2 className="text-4xl font-bold text-white">Partnerships & Collaborations</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-8" data-aos="fade-right">
              <h3 className="text-2xl font-bold text-red-300 mb-4">Industry MoUs</h3>
              <p className="text-slate-300 mb-6">
                GIET University has established enduring partnerships with leading corporations and industries to provide students with real-world exposure and career opportunities.
              </p>
              <ul className="space-y-3">
                {["Technology Companies", "Manufacturing Industries", "Research Organizations", "Startup Ecosystem"].map((item, idx) => (
                  <li key={idx} className="text-slate-300 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-8" data-aos="fade-left">
              <h3 className="text-2xl font-bold text-blue-300 mb-4">Corporate Partnerships</h3>
              <p className="text-slate-300 mb-6">
                Strategic alliances with top recruiters ensure quality placements and provide foot-in-the-door opportunities for eligible students.
              </p>
              <ul className="space-y-3">
                {["Campus Recruitment Programs", "Internship Opportunities", "Industry-Academia Collaboration", "Skill Development Initiatives"].map((item, idx) => (
                  <li key={idx} className="text-slate-300 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Why Alumni Connect */}
      <div className="max-w-7xl mx-auto" data-aos="fade-up">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-500/50">
              <FaGraduationCap className="text-4xl text-yellow-400" />
            </div>
            <h2 className="text-4xl font-bold text-white">Why Alumni Connect?</h2>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Together, let&apos;s make this journey <span className="text-cyan-300 font-bold">unforgettable</span>. Join us in creating lasting memories, building professional relationships, and becoming part of a network that celebrates every achievement. Alumni Connect is more than a platform—it&apos;s a community that empowers, inspires, and connects.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
