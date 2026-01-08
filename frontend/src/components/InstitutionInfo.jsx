// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import { FaTrophy, FaStar } from "react-icons/fa";
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
    <div className="w-full bg-gradient-to-br from-blue-50 to-orange-50 py-16 font-outfit">
      <div className="container mx-auto px-4">
        {/* Title Section */}
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            Gandhi Institute of Engineering and Technology University
          </h2>
          <p className="text-xl text-gray-700">Odisha, Gunupur</p>
        </div>

        {/* Key Achievement Banner */}
        <div 
          className="bg-gradient-to-r from-primary to-orange-600 rounded-2xl shadow-2xl p-8 mb-12 text-white"
          data-aos="zoom-in"
          data-aos-delay="200"
        >
          <div className="flex flex-col md:flex-row items-center justify-center text-center md:text-left">
            <FaTrophy className="text-6xl mb-4 md:mb-0 md:mr-6" />
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                Best University in Eastern India for Campus Placement
              </h3>
              <p className="text-lg opacity-90">Asia Education Summit & Awards 2020</p>
            </div>
          </div>
        </div>

        {/* Accreditations */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8" data-aos="fade-up" data-aos-delay="300">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:scale-105 transition-transform">
            <FaStar className="text-4xl text-primary mx-auto mb-3" />
            <h4 className="font-bold text-secondary">NAAC</h4>
            <p className="text-sm text-gray-600">Accredited</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:scale-105 transition-transform">
            <FaStar className="text-4xl text-primary mx-auto mb-3" />
            <h4 className="font-bold text-secondary">NIRF</h4>
            <p className="text-sm text-gray-600">Ranked</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:scale-105 transition-transform">
            <FaStar className="text-4xl text-primary mx-auto mb-3" />
            <h4 className="font-bold text-secondary">NBA</h4>
            <p className="text-sm text-gray-600">Accredited</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:scale-105 transition-transform">
            <FaStar className="text-4xl text-primary mx-auto mb-3" />
            <h4 className="font-bold text-secondary">AICTE</h4>
            <p className="text-sm text-gray-600">Approved</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center hover:scale-105 transition-transform">
            <FaStar className="text-4xl text-primary mx-auto mb-3" />
            <h4 className="font-bold text-secondary">ARIIA</h4>
            <p className="text-sm text-gray-600">Ranked</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstitutionInfo;
