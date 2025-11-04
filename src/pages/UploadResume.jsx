import React, { useState } from "react";
import { motion } from "framer-motion";
import { storage } from "../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../contexts/AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./UploadResume.css";

const UploadResume = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === "application/pdf" || selectedFile.type.includes("doc")) {
        setFile(selectedFile);
        setErrorMsg("");
      } else {
        setErrorMsg("Please upload a PDF or DOC file.");
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !user) return;

    setUploading(true);
    setStatusMsg("");
    setErrorMsg("");

    try {
      const storageRef = ref(storage, `users/${user.uid}/resume.${file.name.split(".").pop()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setStatusMsg("Resume uploaded successfully!");
      setFile(null);
      // Reset file input
      e.target.reset();
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMsg("Failed to upload resume. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-resume-page">
      <div className="container py-5">
        <motion.div
          className="upload-resume-card mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="upload-header">
            <i className="bi bi-file-earmark-arrow-up"></i>
            <h2>Upload Resume</h2>
            <p>Upload your resume in PDF or DOC format</p>
          </div>

          <form onSubmit={handleUpload} className="upload-form">
            <div className="upload-area">
              <input
                type="file"
                id="resume-upload"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="file-input"
                disabled={uploading}
              />
              <label htmlFor="resume-upload" className="upload-label">
                <i className="bi bi-cloud-upload"></i>
                <span>{file ? file.name : "Choose file or drag it here"}</span>
                <small>PDF, DOC, or DOCX (Max 10MB)</small>
              </label>
            </div>

            {errorMsg && (
              <div className="alert alert-danger">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {errorMsg}
              </div>
            )}

            {statusMsg && (
              <div className="alert alert-success">
                <i className="bi bi-check-circle me-2"></i>
                {statusMsg}
              </div>
            )}

            <button
              type="submit"
              className="btn-upload-primary"
              disabled={!file || uploading}
            >
              {uploading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <i className="bi bi-upload me-2"></i>
                  Upload Resume
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadResume;


