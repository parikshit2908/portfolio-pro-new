import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { auth, storage } from "../firebase/config.js";
import { updateProfile, sendPasswordResetEmail, deleteUser } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./Settings.css";

const Settings = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setStatusMsg("");
    setErrorMsg("");

    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName || auth.currentUser.displayName,
      });
      setStatusMsg("Profile updated successfully.");
    } catch (err) {
      console.error("updateProfile error", err);
      setErrorMsg("Failed to update profile. Try again.");
    }
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setStatusMsg("");
    setErrorMsg("");

    try {
      const storageRef = ref(storage, `users/${auth.currentUser.uid}/profile.${file.name.split(".").pop()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await updateProfile(auth.currentUser, { photoURL: url });
      setStatusMsg("Profile photo uploaded.");
    } catch (err) {
      console.error("upload error", err);
      setErrorMsg("Failed to upload photo.");
    } finally {
      setUploading(false);
    }
  };

  const handleSendPasswordReset = async () => {
    setStatusMsg("");
    setErrorMsg("");
    try {
      await sendPasswordResetEmail(auth, auth.currentUser.email);
      setStatusMsg("Password reset email sent to your account.");
    } catch (err) {
      console.error("password reset error", err);
      setErrorMsg("Could not send password reset email.");
    }
  };

  const handleDeleteAccount = async () => {
    // CAUTION: deleteUser will fail if user needs re-authentication.
    // This flow shows a user-facing warning and attempts deletion.
    setStatusMsg("");
    setErrorMsg("");
    if (!confirm("This will permanently delete your account. Are you sure?")) return;
    try {
      await deleteUser(auth.currentUser);
      setStatusMsg("Account deleted.");
    } catch (err) {
      console.error("delete account error", err);
      setErrorMsg("Could not delete account. You may need to sign-in again and try.");
    }
  };

  return (
    <div className="settings-page">
      <div className="container py-5">
        <motion.div
          className="settings-card mx-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="fw-bold mb-3">Account Settings</h3>

          <div className="profile-row d-flex gap-4 align-items-center mb-4">
            <div className="profile-avatar">
              <img
                src={
                  user?.photoURL ||
                  "https://via.placeholder.com/96?text=Avatar"
                }
                alt="avatar"
                className="rounded-circle"
                width="96"
                height="96"
              />
            </div>

            <div className="profile-meta flex-grow-1">
              <p className="mb-1"><strong>{user?.displayName || "No display name"}</strong></p>
              <p className="text-muted small mb-1">{user?.email}</p>

              <label className="btn btn-sm btn-outline-secondary mt-2 upload-btn">
                {uploading ? "Uploading..." : "Upload Photo"}
                <input type="file" accept="image/*" onChange={handleUploadPhoto} style={{ display: "none" }} />
              </label>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="mb-4">
            <label className="form-label">Display name</label>
            <input
              className="form-control mb-3"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
            />

            <div className="d-flex gap-2">
              <button className="btn btn-primary" type="submit" style={{ backgroundColor: "var(--accent-primary)", border: "none" }}>
                Save
              </button>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setDisplayName(user?.displayName || "");
                }}
              >
                Reset
              </button>
            </div>
          </form>

          <div className="mb-4">
            <label className="form-label">Security</label>
            <div className="d-flex gap-2 align-items-center">
              <button className="btn btn-warning" onClick={handleSendPasswordReset}>
                Send Password Reset Email
              </button>
              <button className="btn btn-danger" onClick={handleDeleteAccount}>
                Delete Account
              </button>
            </div>
            <div className="form-text mt-2 text-muted">
              Sending a reset email is safe and recommended if you want to change password.
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label">Appearance</label>
            <div className="d-flex gap-2 align-items-center">
              <button
                className="btn theme-btn"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                Toggle to {theme === "light" ? "dark" : "light"} mode
              </button>
              <div className="form-text ms-2 text-muted">Current: <strong>{theme}</strong></div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              {statusMsg && <div className="alert alert-success py-2">{statusMsg}</div>}
              {errorMsg && <div className="alert alert-danger py-2">{errorMsg}</div>}
            </div>

            <div>
              <button className="btn btn-outline-secondary me-2" onClick={() => logout()}>Sign out</button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
