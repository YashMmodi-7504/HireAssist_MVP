import React, { useEffect, useState } from "react";

const BACKEND = "http://127.0.0.1:8000";

export default function SkillGapHeatmap() {
  const [data, setData] = useState([]);
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
      .then((d) => setData(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading skill heatmap...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ marginTop: 40 }}>
      <h3>🔥 Skill Gap Heatmap</h3>

      {data.length === 0 && <p>No skill gap data yet.</p>}

      {data.map(s => (
        <div key={s.skill} style={bar}>
          <span style={{ width: 120 }}>{s.skill}</span>
          <div
            style={{
              height: 10,
              width: `${s.demand * 10}px`,
              background: "#ef4444",
              marginLeft: 10
            }}
          />
          <span style={{ marginLeft: 10 }}>{s.demand}</span>
        </div>
      ))}
    </div>
  );
}

const bar = {
  display: "flex",
  alignItems: "center",
  marginBottom: 10
};
