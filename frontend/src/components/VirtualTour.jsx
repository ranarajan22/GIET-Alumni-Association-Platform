// eslint-disable-next-line no-unused-vars
import React, { useEffect } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
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
    <div className="w-full bg-gradient-to-br from-secondary to-blue-900 py-16 font-outfit">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 
          className="text-4xl font-bold text-center mb-4 text-white"
          data-aos="fade-up"
        >
          Explore Our Campus
        </h2>
        <p className="text-center text-gray-200 mb-12" data-aos="fade-up" data-aos-delay="100">
          Take a virtual tour and discover world-class facilities and sustainable initiatives
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Virtual Tour Card */}
          <div 
            className="bg-white rounded-xl shadow-2xl p-8 text-center hover:scale-105 transition-transform"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <div className="text-5xl mb-4">🎥</div>
            <h3 className="text-xl font-bold text-secondary mb-3">360° Virtual Tour</h3>
            <p className="text-gray-600 mb-4">Experience our campus from anywhere in the world</p>
            <a 
              href="https://360virtualtour.giet.edu/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center bg-primary text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors"
            >
              Take Tour <FaExternalLinkAlt className="ml-2" />
            </a>
          </div>

          {/* Campus Facilities Card */}
          <div 
            className="bg-white rounded-xl shadow-2xl p-8 text-center hover:scale-105 transition-transform"
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            <div className="text-5xl mb-4">🏛️</div>
            <h3 className="text-xl font-bold text-secondary mb-3">World-Class Facilities</h3>
            <ul className="text-gray-600 text-left space-y-2">
              <li>• Modern Laboratories</li>
              <li>• State-of-the-art Library</li>
              <li>• Sports Complex</li>
              <li>• Innovation Centers</li>
              <li>• Smart Classrooms</li>
            </ul>
          </div>

          {/* Environmental Sustainability Card */}
          <div 
            className="bg-white rounded-xl shadow-2xl p-8 text-center hover:scale-105 transition-transform"
            data-aos="zoom-in"
            data-aos-delay="400"
          >
            <div className="text-5xl mb-4">🌱</div>
            <h3 className="text-xl font-bold text-secondary mb-3">Sustainability Initiatives</h3>
            <ul className="text-gray-600 text-left space-y-2">
              <li>• Green Campus Program</li>
              <li>• Solar Energy Usage</li>
              <li>• Rainwater Harvesting</li>
              <li>• Waste Management</li>
              <li>• Tree Plantation Drives</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VirtualTour;
