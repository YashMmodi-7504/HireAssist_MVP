import React, { useState } from "react";

const BACKEND = "http://localhost:8000";

export default function EnrollCandidate({ cohortId }) {
  const [candidateId, setCandidateId] = useState("");
  const [score, setScore] = useState("");
  const [message, setMessage] = useState("");

  async function enroll() {
    try {
      const res = await fetch(`${BACKEND}/api/training/cohorts/${cohortId}/enroll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_id: Number(candidateId),
          assessment_score: Number(score)
        }),
      });

      const data = await res.json();

      if (data.learner_id) {
        setMessage("Candidate enrolled successfully!");
      } else {
        setMessage("Failed to enroll.");
      }
    } catch (err) {
      setMessage("Server error while enrolling.");
    }
  }

  return (
    <div style={{ padding: 12 }}>
      <h2>Enroll into Cohort #{cohortId}</h2>

      <input
        placeholder="Candidate ID"
        value={candidateId}
        onChange={(e) => setCandidateId(e.target.value)}
        style={{ display: "block", marginBottom: 8, padding: 6 }}
      />

      <input
        placeholder="Assessment score"
        value={score}
        onChange={(e) => setScore(e.target.value)}
        style={{ display: "block", marginBottom: 8, padding: 6 }}
      />

      <button onClick={enroll} style={{ padding: "6px 12px" }}>
        Enroll
      </button>

      {message && <div style={{ marginTop: 12 }}>{message}</div>}
    </div>
  );
}
