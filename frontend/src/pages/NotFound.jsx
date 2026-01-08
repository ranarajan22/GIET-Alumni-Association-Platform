// eslint-disable-next-line no-unused-vars
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary to-orange-600 text-white px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold mb-4">404</h1>
        <h2 className="text-4xl font-bold mb-4">Page Not Found</h2>
        <p className="text-xl mb-8 opacity-90">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 bg-white text-primary font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FaHome /> Go to Home
          </button>
          
          <div className="mt-8">
            <p className="text-sm opacity-75">Quick Links:</p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <button onClick={() => navigate("/about")} className="hover:underline">About</button>
              <button onClick={() => navigate("/contact")} className="hover:underline">Contact</button>
              <button onClick={() => navigate("/roleselection")} className="hover:underline">Login</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
