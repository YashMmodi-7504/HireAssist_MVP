import React, { useEffect, useState } from "react";

import Card from "./components/Card";
import Spinner from "./components/Spinner";
import { COLORS } from "./theme";
import AppLayout from "./layouts/AppLayout";

const BACKEND = "http://127.0.0.1:8000";

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(`${BACKEND}/api/student/dashboard`)
      .then(res => res.json())
      .then(d => { setData(d); setLastUpdated(Date.now()); setLoading(false); })
      .catch(() => { setData(null); setLoading(false); });
  }, []);

  if (loading) return (
    <div style={{ padding: 24 }}>
      <Card style={{ padding: 24, textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><span style={{ marginRight: 12 }}><Spinner /></span><div>Analyzing your learning readiness…</div></div>
      </Card>
    </div>
  );

  if (!data) return (
    <div style={{ padding: 24 }}>
      <Card style={{ padding: 24, textAlign: 'center', color: COLORS.muted }}>No progress available yet — complete assignments and assessments to populate your progress dashboard.</Card>
    </div>
  );

  function statusPill(flag) {
    if (flag === "green") return pill("#ecfdf5", "#047857", "Job Ready");
    if (flag === "amber") return pill("#fffbeb", "#92400e", "Near Ready");
    return pill("#fef2f2", "#991b1b", "At Risk");
  }

  return (
    <AppLayout role="student" active="/student">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <h2 style={{ margin: 0 }}>🎓 Student Progress</h2>
          <div style={{ color: COLORS.muted, fontSize: 13 }}>Your learning readiness & assessment insights</div>
        </div>
        <div style={{ color: COLORS.muted, fontSize: 12 }}>{lastUpdated ? `Last updated just now` : ''}</div>
      </div>

      <Card style={{ marginTop: 12, maxWidth: 640 }}>
        <div style={row}>
          <div>
            <div style={label}>Assessment Score</div>
            <div style={value}>{data.assessment_score}</div>
          </div>
          {statusPill(data.readiness_flag)}
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={label}>Skill Readiness</div>
          <div style={progressBg}>
            <div
              style={{
                ...progressFill,
                width: `${data.readiness_pct}%`,
                background:
                  data.readiness_pct >= 70
                    ? COLORS.success
                    : data.readiness_pct >= 50
                    ? COLORS.warn
                    : COLORS.danger
              }}
            />
          </div>
          <div style={subtle}>{data.readiness_pct}% complete</div>
        </div>
      </Card>
    </AppLayout>
  );
}

/* ---------------- UI HELPERS ---------------- */

const pill = (bg, color, text) => (
  <span style={{ background: bg, color, padding: "6px 14px", borderRadius: 999, fontWeight: 600 }}>
    {text}
  </span>
);

const page = { padding: 28, background: "#f9fafb", minHeight: "100vh" };
const row = { display: "flex", justifyContent: "space-between", alignItems: "center" };
const label = { fontSize: 12, color: "#6b7280" };
const value = { fontSize: 32, fontWeight: 700 };
const subtle = { fontSize: 12, color: "#6b7280" };
const progressBg = { height: 10, background: "#e5e7eb", borderRadius: 6, marginTop: 6 };
const progressFill = { height: "100%", borderRadius: 6 };
