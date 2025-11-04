import React, { useState } from "react";
import { motion } from "framer-motion";
import { storage } from "../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../contexts/AuthContext";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./UploadPortfolio.css";

const UploadPortfolio = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [uploadType, setUploadType] = useState("file"); // "file" or "url"

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === "application/zip" || selectedFile.name.endsWith(".zip")) {
        setFile(selectedFile);
        setErrorMsg("");
      } else {
        setErrorMsg("Please upload a ZIP file.");
      }
    }
  };

  const handleUrlChange = (e) => {
    setPortfolioUrl(e.target.value);
    setErrorMsg("");
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!user) return;

    setUploading(true);
    setStatusMsg("");
    setErrorMsg("");

    try {
      if (uploadType === "file") {
        if (!file) {
          setErrorMsg("Please select a file to upload.");
          setUploading(false);
          return;
        }
        const storageRef = ref(storage, `users/${user.uid}/portfolio.${file.name.split(".").pop()}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        setStatusMsg("Portfolio uploaded successfully!");
        setFile(null);
        e.target.reset();
      } else {
        if (!portfolioUrl || !isValidUrl(portfolioUrl)) {
          setErrorMsg("Please enter a valid URL.");
          setUploading(false);
          return;
        }
        // Here you would save the URL to Firestore
        setStatusMsg("Portfolio URL saved successfully!");
        setPortfolioUrl("");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMsg("Failed to upload portfolio. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-portfolio-page">
      <div className="container py-5">
        <motion.div
          className="upload-portfolio-card mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="upload-header">
            <i className="bi bi-cloud-upload"></i>
            <h2>Upload Portfolio</h2>
            <p>Upload your portfolio files or link to an existing portfolio</p>
          </div>

          <div className="upload-type-selector">
            <button
              type="button"
              className={`type-btn ${uploadType === "file" ? "active" : ""}`}
              onClick={() => setUploadType("file")}
            >
              <i className="bi bi-file-zip"></i> Upload File
            </button>
            <button
              type="button"
              className={`type-btn ${uploadType === "url" ? "active" : ""}`}
              onClick={() => setUploadType("url")}
            >
              <i className="bi bi-link-45deg"></i> Link URL
            </button>
          </div>

          <form onSubmit={handleUpload} className="upload-form">
            {uploadType === "file" ? (
              <div className="upload-area">
                <input
                  type="file"
                  id="portfolio-upload"
                  accept=".zip"
                  onChange={handleFileChange}
                  className="file-input"
                  disabled={uploading}
                />
                <label htmlFor="portfolio-upload" className="upload-label">
                  <i className="bi bi-cloud-upload"></i>
                  <span>{file ? file.name : "Choose ZIP file or drag it here"}</span>
                  <small>ZIP file containing your portfolio (Max 50MB)</small>
                </label>
              </div>
            ) : (
              <div className="url-input-area">
                <label htmlFor="portfolio-url" className="form-label">Portfolio URL</label>
                <input
                  type="url"
                  id="portfolio-url"
                  value={portfolioUrl}
                  onChange={handleUrlChange}
                  placeholder="https://your-portfolio.com"
                  className="form-control"
                  disabled={uploading}
                />
              </div>
            )}

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
              disabled={uploading || (uploadType === "file" && !file) || (uploadType === "url" && !portfolioUrl)}
            >
              {uploading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  {uploadType === "file" ? "Uploading..." : "Saving..."}
                </>
              ) : (
                <>
                  <i className="bi bi-upload me-2"></i>
                  {uploadType === "file" ? "Upload Portfolio" : "Save URL"}
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadPortfolio;


