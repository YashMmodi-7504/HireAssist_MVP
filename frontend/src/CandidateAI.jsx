import React, { useEffect, useState } from "react";

const BACKEND = "http://127.0.0.1:8000";

export default function CandidateAI({ candidateId }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!candidateId) return;
    setLoading(true);
    setError(null);

    fetch(`${BACKEND}/api/ai/evaluate/${candidateId}`)
      .then((res) => {
        if (!res.ok) throw new Error("AI evaluation not available");
        return res.json();
      })
      .then((json) => setData(json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [candidateId]);

  if (!candidateId) return null;
  if (loading) return <p>Loading AI evaluation...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!data) return null;

  return (
    <div style={{ marginTop: 20, padding: 12, border: "1px solid #e5e7eb", borderRadius: 8 }}>
      <h3>🤖 AI Employability</h3>

      <p><b>Employability Score:</b> {data.employability_score}</p>
      <p><b>Readiness Level:</b> {data.readiness_level || data.readiness}</p>

      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: "#6b7280" }}>Strengths</div>
          <ul>
            {(data.strengths || []).map((s) => (<li key={s}>{s}</li>))}
          </ul>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: "#6b7280" }}>Skill Gaps</div>
          <ul>
            {(data.skill_gaps || []).map((s) => (<li key={s}>{s}</li>))}
          </ul>
        </div>
      </div>

      {data.recommended_programs && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 13, color: "#6b7280" }}>Recommended Programs</div>
          <ul>
            {data.recommended_programs.map((p) => (
              <li key={p.program_id}>{p.title} — score {p.score}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
