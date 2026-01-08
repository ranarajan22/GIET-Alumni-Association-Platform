// eslint-disable-next-line no-unused-vars
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const ServerError = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-500 to-red-700 text-white px-4">
      <div className="text-center">
        <FaExclamationTriangle className="text-9xl mb-4 animate-bounce" />
        <h1 className="text-5xl font-bold mb-4">500</h1>
        <h2 className="text-3xl font-bold mb-4">Server Error</h2>
        <p className="text-lg mb-8 opacity-90">
          Something went wrong on our end. Our team has been notified and is working to fix it.
        </p>
        
        <button
          onClick={() => navigate("/")}
          className="bg-white text-red-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default ServerError;
