// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import { FaUsers, FaHandshake, FaBriefcase, FaGraduationCap } from "react-icons/fa";
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

  return (
    <div className="w-full bg-white py-16 font-outfit">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 
          className="text-4xl font-bold text-center mb-12 text-secondary"
          data-aos="fade-up"
        >
          Alumni Network Statistics
        </h2>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Stat 1 - Alumni Count */}
          <div 
            className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-8 text-center hover:scale-105 transition-transform"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <FaGraduationCap className="text-5xl text-primary mx-auto mb-4" />
            <h3 className="text-4xl font-bold text-secondary mb-2">10,000+</h3>
            <p className="text-gray-700 font-medium">Alumni Worldwide</p>
          </div>

          {/* Stat 2 - Placement Success */}
          <div 
            className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg p-8 text-center hover:scale-105 transition-transform"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <FaBriefcase className="text-5xl text-primary mx-auto mb-4" />
            <h3 className="text-4xl font-bold text-secondary mb-2">95%</h3>
            <p className="text-gray-700 font-medium">Placement Success Rate</p>
          </div>

          {/* Stat 3 - Active Mentorship */}
          <div 
            className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-8 text-center hover:scale-105 transition-transform"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <FaHandshake className="text-5xl text-primary mx-auto mb-4" />
            <h3 className="text-4xl font-bold text-secondary mb-2">500+</h3>
            <p className="text-gray-700 font-medium">Active Mentorship Programs</p>
          </div>

          {/* Stat 4 - Companies Recruiting */}
          <div 
            className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg p-8 text-center hover:scale-105 transition-transform"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <FaUsers className="text-5xl text-primary mx-auto mb-4" />
            <h3 className="text-4xl font-bold text-secondary mb-2">200+</h3>
            <p className="text-gray-700 font-medium">Companies Recruiting</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsSection;
