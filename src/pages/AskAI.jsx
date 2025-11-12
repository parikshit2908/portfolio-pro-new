import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../supabase/config";
import { jsPDF } from "jspdf";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.mjs";
import "./AskAI.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

const FUNC_BASE = "https://us-central1/YOUR_PROJECT.cloudfunctions.net";

export default function AskAI() {
  const { user } = useAuth();
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  const FUNC_SECRET = import.meta.env.VITE_FUNC_SECRET || "";

  // 📄 Extract text from PDF or TXT
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");
    setLoading(true);
    setFileName(file.name);

    try {
      if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let textContent = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const text = await page.getTextContent();
          textContent += text.items.map((s) => s.str).join(" ") + "\n";
        }
        setResumeText(textContent);
      } else if (file.type === "text/plain") {
        const text = await file.text();
        setResumeText(text);
      } else setError("Unsupported file type. Please upload PDF or TXT.");
    } catch {
      setError("Failed to extract text. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🤖 AI Analysis
  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError("Please paste or upload your resume text first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${FUNC_BASE}/analyzeResume`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-func-secret": FUNC_SECRET,
        },
        body: JSON.stringify({ resumeText }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Analysis failed");

      setResult(data.result);

      // 💾 Save in Supabase
      await supabase.from("atsReports").insert([
        {
          uid: user?.id || "guest",
          userName:
            user?.user_metadata?.display_name || user?.email?.split("@")[0],
          fileName: fileName || "pasted_resume",
          score: data.result.score,
          summary: data.result.summary,
          suggestions: data.result.suggestions || [],
          keywords: data.result.top_keywords || [],
          created_at: new Date(),
        },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!result) return;
    const doc = new jsPDF();
    doc.text("PortfolioPro ATS Report", 20, 20);
    doc.text(`Score: ${result.score}/100`, 20, 30);
    doc.text(`Summary: ${result.summary}`, 20, 40);
    doc.save("ATS_Report.pdf");
  };

  return (
    <div className="askai-page">
      <div className="container py-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="askai-title">Improve Resume</h1>
          <p className="askai-subtitle">
            Upload or paste your resume. The AI ATS Tracker will score and give
            suggestions.
          </p>

          <div className="ats-section mt-4">
            <label className="form-label">Upload Resume</label>
            <input
              type="file"
              accept=".pdf,.txt"
              className="form-control mb-3"
              onChange={handleFileUpload}
              disabled={loading}
            />
            <label className="form-label">Or Paste Resume Text</label>
            <textarea
              className="form-control"
              rows="10"
              placeholder="Paste your resume text here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
            <div className="d-flex gap-2 mt-3">
              <button className="btn custom-cta-btn" onClick={handleAnalyze}>
                {loading ? "Analyzing..." : "Run ATS Tracker"}
              </button>
            </div>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </div>

          {result && (
            <div className="ats-results mt-5">
              <div className="ats-card">
                <h3>
                  ATS Score: <span className="score">{result.score}</span>/100
                </h3>
                <p>{result.summary}</p>
                <button
                  className="btn btn-outline-primary mt-3"
                  onClick={handleDownloadReport}
                >
                  Download Report
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
