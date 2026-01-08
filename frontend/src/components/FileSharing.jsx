// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { FaFileUpload, FaTimes, FaDownload, FaFile } from "react-icons/fa";

const FileSharing = () => {
  const [files, setFiles] = useState([
    { id: 1, name: "Resume_Template.pdf", size: "2.4 MB", uploaded: "2 days ago", downloads: 15 },
    { id: 2, name: "Interview_Tips.docx", size: "1.8 MB", uploaded: "1 week ago", downloads: 23 },
    { id: 3, name: "Study_Materials.zip", size: "5.2 MB", uploaded: "2 weeks ago", downloads: 42 },
  ]);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      alert(`File "${selectedFile.name}" uploaded successfully!`);
      setSelectedFile(null);
    }
  };

  const deleteFile = (id) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 font-outfit">
      <h2 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
        <FaFileUpload /> Document Repository
      </h2>

      {/* Upload Section */}
      <div className="bg-blue-50 border-2 border-dashed border-primary rounded-lg p-8 mb-6 text-center">
        <FaFileUpload className="text-5xl text-primary mx-auto mb-4" />
        <h3 className="font-semibold text-gray-800 mb-2">Drag & Drop Files Here</h3>
        <p className="text-gray-600 text-sm mb-4">or</p>

        <div className="flex justify-center gap-3">
          <input
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            id="file-input"
          />
          <label
            htmlFor="file-input"
            className="bg-primary text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-orange-600 transition"
          >
            Select File
          </label>
          <button
            onClick={handleUpload}
            disabled={!selectedFile}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            Upload
          </button>
        </div>

        {selectedFile && (
          <p className="text-sm text-gray-600 mt-3">Selected: {selectedFile.name}</p>
        )}
      </div>

      {/* Files List */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-4">Shared Files</h3>
        <div className="space-y-3">
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition">
              <div className="flex items-center gap-4 flex-1">
                <FaFile className="text-2xl text-primary" />
                <div>
                  <p className="font-semibold text-gray-800">{file.name}</p>
                  <p className="text-sm text-gray-600">{file.size} • Uploaded {file.uploaded}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-700">{file.downloads}</p>
                  <p className="text-xs text-gray-500">Downloads</p>
                </div>

                <div className="flex gap-2">
                  <button className="text-primary hover:text-orange-600 transition p-2">
                    <FaDownload />
                  </button>
                  <button
                    onClick={() => deleteFile(file.id)}
                    className="text-red-500 hover:text-red-700 transition p-2"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileSharing;
