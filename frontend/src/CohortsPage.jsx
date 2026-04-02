import React, { useEffect, useState } from "react";

const BACKEND = "http://127.0.0.1:8000";

export default function CohortsPage() {
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadCohorts() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${BACKEND}/api/training/cohorts`);
      const data = await res.json();

      // ✅ Single trusted response shape
      setCohorts(data.cohorts || []);
    } catch {
      setError("Failed to load cohorts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCohorts();
  }, []);

  if (loading) {
    return <div style={{ padding: 20 }}>Loading cohorts...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 20, color: "red" }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>📅 Cohorts</h2>

      {cohorts.length === 0 ? (
        <p>No cohorts created yet.</p>
      ) : (
        <ul>
          {cohorts.map((c) => (
            <li key={c.id} style={item}>
              <b>Cohort #{c.id}</b>
              <br />
              Program ID: {c.program_id}
              <br />
              Duration: {c.start_date} → {c.end_date}
              <br />
              Seats: {c.enrolled_count}/{c.seats}
              <br />
              Status: <b>{c.status}</b>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- styles ---------- */

const item = {
  marginBottom: 14,
  padding: 12,
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  background: "#ffffff"
};
