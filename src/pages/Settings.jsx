import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { supabase } from "../supabase/config";
import "./Settings.css";

export default function Settings() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.display_name || ""
  );
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpdateProfile = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName },
    });
    if (error) setErrorMsg(error.message);
    else setStatusMsg("Profile updated successfully.");
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(`users/${user.id}/avatar.${file.name.split(".").pop()}`, file, {
        upsert: true,
      });
    if (error) setErrorMsg(error.message);
    else {
      const publicUrl = supabase.storage
        .from("avatars")
        .getPublicUrl(data.path).data.publicUrl;
      await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });
      setStatusMsg("Photo uploaded successfully.");
    }
    setUploading(false);
  };

  const handlePasswordReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(user.email);
    if (error) setErrorMsg(error.message);
    else setStatusMsg("Password reset email sent.");
  };

  return (
    <div className="settings-page">
      <div className="container py-5">
        <motion.div
          className="settings-card mx-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3>Account Settings</h3>
          <div className="mb-4">
            <label className="form-label">Display Name</label>
            <input
              className="form-control"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <button
              className="btn btn-primary mt-2"
              onClick={handleUpdateProfile}
            >
              Save
            </button>
          </div>

          <div className="mb-4">
            <label className="form-label">Profile Picture</label>
            <input type="file" onChange={handleUploadPhoto} disabled={uploading} />
          </div>

          <div className="mb-4">
            <button className="btn btn-warning" onClick={handlePasswordReset}>
              Send Password Reset
            </button>
          </div>

          <div className="mb-4">
            <button className="btn btn-outline-dark" onClick={toggleTheme}>
              Toggle {theme === "light" ? "Dark" : "Light"} Mode
            </button>
          </div>

          <div className="mb-4">
            <button className="btn btn-danger" onClick={() => logout()}>
              Logout
            </button>
          </div>

          {statusMsg && <div className="alert alert-success">{statusMsg}</div>}
          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
        </motion.div>
      </div>
    </div>
  );
}
