import React, { useEffect, useState } from "react";

import Card from "./components/Card";
import KPI from "./components/KPI";
import Spinner from "./components/Spinner";
import PrimaryButton from "./components/PrimaryButton";
import { COLORS, FONTS } from "./theme";
import AppLayout from "./layouts/AppLayout";

const BACKEND = "http://127.0.0.1:8000";
import { fetchJSON } from "./utils/api";

export default function DirectorDashboard() {
  const [data, setData] = useState(null);
  const [whatIf, setWhatIf] = useState(null);
  const [trainerBoost, setTrainerBoost] = useState(0);
  const [skillBoost, setSkillBoost] = useState(0);
  const [loadingSim, setLoadingSim] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    setError(null);
    fetchJSON(`${BACKEND}/api/director/dashboard`)
      .then(res => {
        if (res.error) setError(res.error || "We couldn't load strategic insights at the moment. Please try again.");
        else { setData(res.data); setLastUpdated(Date.now()); }
      })
      .catch(err => setError(err.message || "We couldn't load strategic insights at the moment. Please try again."));
  }, []);

  function formatUpdated(ts) {
    if (!ts) return "";
    const delta = Math.round((Date.now() - ts) / 1000);
    if (delta < 60) return "Last updated just now";
    return `Last updated ${new Date(ts).toLocaleString()}`;
  }
  if (error) return <div style={{ padding: 24 }}><Card style={{ padding: 24, color: COLORS.danger }}>We couldn't load strategic insights at the moment. Please try again.</Card></div>;
  if (!data) return (
    <div style={{ padding: 24 }}>
      <Card style={{ padding: 24, textAlign: 'center' }}><Spinner /> Compiling strategic insights…</Card>
    </div>
  );

  /* ---------------- HELPERS ---------------- */
  function trendUI(t) {
    if (t === "↑" || t === "up") return { icon: "↑", color: "#16a34a", label: "Improving" };
    if (t === "↓" || t === "down") return { icon: "↓", color: "#ef4444", label: "Declining" };
    return { icon: "→", color: "#6b7280", label: "Stable" };
  }

  function decisionPill(decision) {
    if (!decision) return null;
    if (decision.decision_state === "monitor")
      return <span style={{ ...pill, background: "#ecfdf5", color: "#047857" }}>Monitor</span>;
    if (decision.decision_state === "intervene")
      return <span style={{ ...pill, background: "#fffbeb", color: "#92400e" }}>Action Required</span>;
    return <span style={{ ...pill, background: "#fef2f2", color: "#991b1b" }}>Escalate</span>;
  }

  async function simulate() {
    setLoadingSim(true);
    setWhatIf(null);

    const res = await fetch(`${BACKEND}/api/director/what-if`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        current_at_risk_pct: data.at_risk_pct,
        trainer_readiness_improvement_pct: trainerBoost,
        skill_gap_reduction_pct: skillBoost
      })
    });

    setWhatIf(await res.json());
    setLoadingSim(false);
  }

  const placementTrend = trendUI(data.placement_trend);

  return (
    <AppLayout role="director" active="/director">
      {/* ---------------- HEADER ---------------- */}
      <div style={header}>
        <div>
          <h2 style={{ margin: 0 }}>🎯 Director War Room</h2>
          <div style={subtle}>Strategic overview & risk intelligence</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: COLORS.muted }}>{formatUpdated(lastUpdated)}</div>
          {decisionPill(data.decision_intelligence)}
        </div>
      </div>

      {/* ---------------- KPI GRID ---------------- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
    <Card style={{ padding: 18 }}><KPI label="Total Learners" value={data.total_learners} /></Card>
    <Card style={{ padding: 18 }}><KPI label="Placement Rate" value={`${data.placement_rate}%`} /></Card>
    <Card style={{ padding: 18 }}><KPI label="Avg Score" value={data.avg_score} /></Card>
    <Card style={{ padding: 18 }}><KPI label="Active Programs" value={data.active_programs} /></Card>
      </div>

      {/* ---------------- RISK PANEL ---------------- */}
      <Card style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, padding: 20 }}>
        <div>
          <div style={riskLabel}>At-Risk Learners</div>
          <div style={riskValue}>{data.at_risk_pct}%</div>
          <div style={subtle}>
            {data.at_risk_learners} learners currently below threshold
          </div>
        </div>

        <div style={{ color: placementTrend.color, textAlign: "right" }}>
          <div style={{ fontSize: 26 }}>{placementTrend.icon}</div>
          <div style={{ fontWeight: 600 }}>{placementTrend.label}</div>
        </div>
      </Card>

      {/* ---------------- HIGHEST RISK / RECOMMENDATION ---------------- */}
      {data.highest_risk_cohort && (
        <Card style={{ marginBottom: 16, padding: 12, borderRadius: 10, background: '#fff7f7', border: '1px solid #fee2e2' }}>
          <div style={{ fontSize: 13, color: COLORS.danger, fontWeight: 700 }}>Highest Risk Cohort</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>#{data.highest_risk_cohort.cohort_id} — {data.highest_risk_cohort.red_pct}% red</div>
          {data.intervention_recommendation && (
            <div style={{ marginTop: 8, color: COLORS.warn }}>{data.intervention_recommendation}</div>
          )}
        </Card>
      )}

      {/* ---------------- INTERVENTION ---------------- */}
      {data.intervention?.intervention_required && (
        <Card style={interventionBox}>
          <div style={{ fontWeight: 600 }}>
            Recommended Action:{" "}
            {data.intervention.intervention_type.replace("_", " ")}
          </div>
          <div style={subtle}>
            Priority {data.intervention.priority} · SLA {data.intervention.sla_days} days · Assigned to{" "}
            {data.intervention.assigned_role}
          </div>
        </Card>
      )}

      {/* ---------------- WHAT-IF SIMULATOR ---------------- */}
      <Card style={whatIfBox}>
        <h3 style={{ marginTop: 0 }}>🧪 What-If Simulator</h3>

        <Slider
          label="Trainer Readiness Improvement"
          value={trainerBoost}
          onChange={setTrainerBoost}
        />

        <Slider
          label="Skill Gap Reduction"
          value={skillBoost}
          onChange={setSkillBoost}
        />

        <PrimaryButton onClick={simulate} disabled={loadingSim} style={{ minWidth: 160 }}>
          {loadingSim ? "Simulating…" : "Simulate Impact"}
        </PrimaryButton>

        {whatIf && (
          <div style={resultBox}>
            <Result label="Projected Risk" value={`${whatIf.projected.projected_at_risk_pct}%`} />
            <Result label="Risk Delta" value={`${whatIf.projected.risk_delta}%`} />
            <Result label="Projected Status" value={whatIf.projected.projected_readiness_flag} />
          </div>
        )}
      </Card>
    </AppLayout>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function Slider({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={subtle}>{label}: {value}%</div>
      <input
        type="range"
        min="0"
        max="30"
        value={value}
        onChange={e => onChange(+e.target.value)}
        style={{ width: "100%" }}
      />
    </div>
  );
}

function Result({ label, value }) {
  return (
    <div>
      <div style={subtle}>{label}</div>
      <div style={{ fontWeight: 700 }}>{value}</div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const page = {
  padding: 28,
  background: "#f9fafb",
  minHeight: "100vh"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 24
};

const subtle = {
  fontSize: 12,
  color: "#6b7280"
};

const pill = {
  padding: "6px 12px",
  borderRadius: 999,
  fontWeight: 600,
  fontSize: 13
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 16,
  marginBottom: 24
};

const kpi = {
  padding: 18,
  borderRadius: 14,
  background: "#ffffff",
  border: "1px solid #e9eef3",
  textAlign: 'center'
};

const kpiLabel = {
  fontSize: 12,
  color: COLORS.muted,
  marginBottom: 6
};

const kpiValue = {
  fontSize: 32,
  fontWeight: 800,
  color: '#0f172a'
};

const riskPanel = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: 20,
  borderRadius: 14,
  background: "#ffffff",
  border: "1px solid #fee2e2",
  marginBottom: 24
};

const riskLabel = {
  fontSize: 12,
  color: "#b91c1c"
};

const riskValue = {
  fontSize: 36,
  fontWeight: 800,
  color: "#b91c1c"
};

const interventionBox = {
  padding: 16,
  borderRadius: 14,
  background: "#fff7ed",
  border: "1px solid #fed7aa",
  marginBottom: 24
};

const whatIfBox = {
  padding: 20,
  borderRadius: 14,
  background: "#ffffff",
  border: "1px solid #e5e7eb"
};

const button = {
  marginTop: 10,
  padding: "8px 16px",
  background: "#111827",
  color: "#ffffff",
  borderRadius: 8,
  border: "none",
  cursor: "pointer"
};

const resultBox = {
  marginTop: 16,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: 16
};
