// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { FaUserCheck, FaBriefcase, FaCheckCircle, FaClock } from "react-icons/fa";

const ReferralSystem = () => {
  const [referrals] = useState([
    {
      id: 1,
      name: "Rahul Sharma",
      position: "Software Engineer at Google",
      status: "Successful",
      reward: 500,
      date: "2024-12-20",
    },
    {
      id: 2,
      name: "Priya Patel",
      position: "Product Manager at Microsoft",
      status: "Pending",
      reward: 250,
      date: "2024-12-10",
    },
    {
      id: 3,
      name: "Arjun Kumar",
      position: "Senior Developer at Amazon",
      status: "Successful",
      reward: 500,
      date: "2024-12-01",
    },
  ]);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6 font-outfit">
      <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
        <FaUserCheck /> Job Referral System
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-3xl font-bold text-green-600 mb-2">2</div>
          <p className="text-gray-600">Successful Referrals</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-3xl font-bold text-orange-600 mb-2">1</div>
          <p className="text-gray-600">Pending Referrals</p>
        </div>

        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-3xl font-bold text-green-600 mb-2">1000</div>
          <p className="text-gray-600">Reward Points Earned</p>
        </div>
      </div>

      {/* Referral List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">Your Referrals</h3>
        {referrals.map((referral) => (
          <div key={referral.id} className="bg-white rounded-lg p-4 shadow-md">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-800">{referral.name}</h4>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <FaBriefcase className="text-primary" />
                  {referral.position}
                </p>
              </div>

              <div className="text-right">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                    referral.status === "Successful"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {referral.status === "Successful" ? (
                    <FaCheckCircle />
                  ) : (
                    <FaClock />
                  )}
                  {referral.status}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{referral.date}</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded font-semibold">
                +{referral.reward} Points
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button className="w-full mt-6 bg-gradient-to-r from-primary to-orange-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition">
        Refer a Friend
      </button>
    </div>
  );
};

export default ReferralSystem;
