import React, { useState } from "react";
import { getCandidateId } from "./utils/session";
import { requireAuth } from "./guards/requireAuth";

const BACKEND = "http://127.0.0.1:8000";

export default function ResumeUpload() {
  const auth = requireAuth("student");
  const candidateId = getCandidateId();

  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState(null);

  if (!auth.ok || !candidateId) {
    return (
      <p style={{ color: "red", padding: 20 }}>
        No active student session found. Please login again.
      </p>
    );
  }

  async function upload() {
    if (!file) {
      setMsg("Please select a resume file");
      return;
    }

    const form = new FormData();
    form.append("candidate_id", candidateId);
    form.append("file", file);

    try {
      const res = await fetch(`${BACKEND}/api/resume/upload`, {
        method: "POST",
        body: form
      });

      if (!res.ok) {
        setMsg("Upload failed");
        return;
      }

      setMsg("✅ Resume uploaded successfully");
    } catch {
      setMsg("⚠️ Backend not responding");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>📄 Upload Resume</h2>

      <input
        type="file"
        onChange={e => setFile(e.target.files[0])}
      /><br /><br />

      <button onClick={upload}>Upload</button>
      {msg && <p>{msg}</p>}
    </div>
  );
}
