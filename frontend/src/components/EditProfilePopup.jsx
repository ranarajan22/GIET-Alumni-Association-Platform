/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { handleError, handleSuccess } from "../utils/utils";
import { API_BASE_URL } from "../config";

const EditProfilePopup = ({ onClose }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    graduationYear: "",
    course: "",
    usn: "",
    fieldOfStudy: "",
    mobile: "",
    parentsMobile: "",
    personalEmail: "",
    fatherName: "",
    motherName: "",
    religion: "",
    higherStudy: "",
    permanentAddress: "",
    dob: "",
    dateOfMarriage: "",
    currentCompany: "",
    designation: "",
    currentLocation: "",
    linkedin: "",
    github: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState(null); // 'alumni' or 'student'

  const userId = localStorage.getItem("userId"); // Get userId from localStorage

  // Fetch the user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!userId) {
          console.error('No userId found in localStorage');
          setError("User ID not found. Please log in again.");
          setIsLoading(false);
          return;
        }

        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        console.log('Attempting to fetch profile for userId:', userId);
        
        // Try to fetch as alumni first
        try {
          console.log('Trying alumni endpoint: /api/alumni-profile/' + userId);
          const alumniResponse = await axios.get(`${API_BASE_URL}/alumni-profile/${userId}`, { headers });
          console.log('Alumni profile fetched successfully:', alumniResponse.data);
          setUserType('alumni');
          setFormData({
            fullName: alumniResponse.data.alumni?.fullName || "",
            graduationYear: alumniResponse.data.alumni?.graduationYear || "",
            course: alumniResponse.data.alumni?.course || "",
            usn: alumniResponse.data.alumni?.registrationNumber || alumniResponse.data.alumni?.usn || "",
            fieldOfStudy: alumniResponse.data.alumni?.fieldOfStudy || "",
            mobile: alumniResponse.data.alumni?.mobile || "",
            parentsMobile: alumniResponse.data.alumni?.parentsMobile || "",
            personalEmail: alumniResponse.data.alumni?.personalEmail || "",
            fatherName: alumniResponse.data.alumni?.fatherName || "",
            motherName: alumniResponse.data.alumni?.motherName || "",
            religion: alumniResponse.data.alumni?.religion || "",
            higherStudy: alumniResponse.data.alumni?.higherStudy || "",
            permanentAddress: alumniResponse.data.alumni?.permanentAddress || "",
            dob: alumniResponse.data.alumni?.dob ? String(alumniResponse.data.alumni.dob).slice(0, 10) : "",
            dateOfMarriage: alumniResponse.data.alumni?.dateOfMarriage ? String(alumniResponse.data.alumni.dateOfMarriage).slice(0, 10) : "",
            currentCompany: alumniResponse.data.alumni?.currentCompany || "",
            designation: alumniResponse.data.alumni?.designation || "",
            currentLocation: alumniResponse.data.alumni?.currentLocation || "",
            linkedin: alumniResponse.data.alumni?.linkedin || "",
            github: alumniResponse.data.alumni?.github || "",
          });
        } catch (alumniError) {
          console.error('Alumni fetch error:', alumniError.response?.status, alumniError.response?.data || alumniError.message);
          // If not alumni, fetch as student
          try {
            console.log('Trying student endpoint: /api/user/' + userId);
            const userResponse = await axios.get(`${API_BASE_URL}/user/${userId}`, { headers });
            console.log('Student profile fetched successfully:', userResponse.data);
            setUserType('student');
            setFormData({
              fullName: userResponse.data.fullName || "",
              graduationYear: userResponse.data.graduationYear || "",
              course: userResponse.data.course || "",
              usn: userResponse.data.usn || "",
              fieldOfStudy: userResponse.data.fieldOfStudy || "",
              mobile: "",
              parentsMobile: "",
              personalEmail: "",
              fatherName: "",
              motherName: "",
              religion: "",
              higherStudy: "",
              permanentAddress: "",
              dob: "",
              dateOfMarriage: "",
              currentCompany: "",
              designation: "",
              currentLocation: "",
              linkedin: "",
              github: "",
            });
          } catch (studentError) {
            console.error('Student fetch error:', studentError.response?.status, studentError.response?.data || studentError.message);
            setError("Failed to load profile details. Please try again.");
            setIsLoading(false);
            return;
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError("Failed to load profile details.");
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Make the PUT request to update the profile based on user type
      const endpoint = userType === 'alumni' 
        ? `${API_BASE_URL}/alumni-profile/${userId}`
        : `${API_BASE_URL}/user/${userId}`;
      
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.put(endpoint, formData, { headers });
      setError(null);
  
      // Save only the updated fullName (as a string) in localStorage
      localStorage.setItem("loggedInUser", formData.fullName);
    
      handleSuccess("Profile updated successfully!");
      onClose(); // Close the popup
    } catch (error) {
      console.error("Error updating profile:", error);
      handleError(error.response?.data?.error || "Failed to update profile.");
    }
  };
  
  
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-[760px] max-h-[88vh] overflow-y-auto h-auto">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <strong className="font-bold">Error!</strong> <span>{error}</span>
              </div>
            )}
            <h2 className="text-lg font-bold mb-4">Edit Profile</h2>

            {/* Form Fields in Two Columns */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="border rounded-lg px-3 py-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Graduation Year
                </label>
                <input
                  type="number"
                  name="graduationYear"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  className="border rounded-lg px-3 py-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Course</label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="border rounded-lg px-3 py-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Registration number</label>
                <input
                  type="text"
                  name="usn"
                  value={formData.usn}
                  onChange={handleInputChange}
                  className="border rounded-lg px-3 py-2 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Branch</label>
                <input
                  type="text"
                  name="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={handleInputChange}
                  className="border rounded-lg px-3 py-2 w-full"
                />
              </div>

              {userType === 'alumni' && (
                <>
                  <div>
                    <label className="block text-sm font-medium">Mobile Number</label>
                    <input type="text" name="mobile" value={formData.mobile} onChange={handleInputChange} className="border rounded-lg px-3 py-2 w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Parents Mobile Number</label>
                    <input type="text" name="parentsMobile" value={formData.parentsMobile} onChange={handleInputChange} className="border rounded-lg px-3 py-2 w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Personal Mail ID</label>
                    <input type="email" name="personalEmail" value={formData.personalEmail} onChange={handleInputChange} className="border rounded-lg px-3 py-2 w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Religion</label>
                    <input type="text" name="religion" value={formData.religion} onChange={handleInputChange} className="border rounded-lg px-3 py-2 w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Father Name</label>
                    <input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} className="border rounded-lg px-3 py-2 w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Mother Name</label>
                    <input type="text" name="motherName" value={formData.motherName} onChange={handleInputChange} className="border rounded-lg px-3 py-2 w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Date of Birth</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="border rounded-lg px-3 py-2 w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Date of Marriage</label>
                    <input type="date" name="dateOfMarriage" value={formData.dateOfMarriage} onChange={handleInputChange} className="border rounded-lg px-3 py-2 w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Current Company</label>
                    <input type="text" name="currentCompany" value={formData.currentCompany} onChange={handleInputChange} className="border rounded-lg px-3 py-2 w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Designation</label>
                    <input type="text" name="designation" value={formData.designation} onChange={handleInputChange} className="border rounded-lg px-3 py-2 w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Current Location</label>
                    <input type="text" name="currentLocation" value={formData.currentLocation} onChange={handleInputChange} className="border rounded-lg px-3 py-2 w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Higher Study</label>
                    <input type="text" name="higherStudy" value={formData.higherStudy} onChange={handleInputChange} className="border rounded-lg px-3 py-2 w-full" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium">Permanent Address</label>
                    <textarea name="permanentAddress" value={formData.permanentAddress} onChange={handleInputChange} className="border rounded-lg px-3 py-2 w-full" rows="2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">LinkedIn URL</label>
                    <input type="text" name="linkedin" value={formData.linkedin} onChange={handleInputChange} className="border rounded-lg px-3 py-2 w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">GitHub URL</label>
                    <input type="text" name="github" value={formData.github} onChange={handleInputChange} className="border rounded-lg px-3 py-2 w-full" />
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
EditProfilePopup.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default EditProfilePopup;

