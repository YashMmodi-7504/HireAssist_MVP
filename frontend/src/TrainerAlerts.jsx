import React, { useEffect, useState } from "react";
import { fetchJSON } from "./utils/api";

const BACKEND = "http://127.0.0.1:8000";

export default function TrainerAlerts() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchJSON(`${BACKEND}/api/trainer/alerts`);
        if (res.error) {
          if (mounted) { setData(null); setError(res.error); }
        } else {
          if (mounted) setData(res.data);
        }
      } catch (e) {
        if (mounted) { setData(null); setError(e.message); }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <p>Loading alerts...</p>;
  if (error) return <p style={{ color: 'red' }}>Unable to load alerts. {error}</p>;

  return (
    <div style={{ marginTop: 30 }}>
      <h3>🚨 Early Warning Alerts</h3>

      <p>
        <b>Total Learners:</b> {data?.total_learners ?? 0} |{" "}
        <b>At Risk:</b> {data?.at_risk?.length ?? 0}
      </p>

      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Avg Score</th>
            <th>Risk</th>
          </tr>
        </thead>
        <tbody>
          {(data?.alerts || []).map(a => (
            <tr key={a.candidate_id}>
              <td>{a.name}</td>
              <td>{a.email}</td>
              <td>{a.avg_score}</td>
              <td
                style={{
                  color:
                    a.risk_level === "HIGH"
                      ? "red"
                      : a.risk_level === "MEDIUM"
                      ? "orange"
                      : "green",
                  fontWeight: "bold"
                }}
              >
                {a.risk_level}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
