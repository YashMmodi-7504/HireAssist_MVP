import React, { useEffect, useState } from "react";

const BACKEND = "http://127.0.0.1:8000";

export default function AdminSkillHeatmap() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${BACKEND}/api/skills/heatmap`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load skill heatmap");
        return res.json();
      })
      .then(data => {
        // sort descending by demand for consistent rendering
        data.sort((a, b) => b.demand - a.demand);
        setSkills(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message || "Failed to load skill heatmap");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading skill heatmap...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (skills.length === 0) {
    return <p>No skill data available yet.</p>;
  }

  const maxDemand = Math.max(...skills.map(s => s.demand || 0));

  return (
    <div style={{ marginTop: 40 }}>
      <h3>🔥 Skill Demand Heatmap</h3>

      {skills.map(skill => (
        <div key={skill.skill} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 14, marginBottom: 4 }}>
            {skill.skill.toUpperCase()} ({skill.demand})
          </div>

          <div style={barContainer}>
            <div
              style={{
                ...barFill,
                width: `${(skill.demand / maxDemand) * 100}%`
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const barContainer = {
  height: 14,
  width: "100%",
  background: "#e5e7eb",
  borderRadius: 8,
  overflow: "hidden"
};

const barFill = {
  height: "100%",
  background: "linear-gradient(90deg, #3b82f6, #22c55e)"
};
