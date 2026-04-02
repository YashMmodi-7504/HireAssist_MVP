import React, { useEffect, useState } from "react";

import Card from "./components/Card";
import Spinner from "./components/Spinner";
import { COLORS, FONTS } from "./theme";
import AppLayout from "./layouts/AppLayout";

const BACKEND = "http://127.0.0.1:8000";
import { fetchJSON } from "./utils/api";

export default function TrainerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  /* ---------------- LOAD DASHBOARD ---------------- */
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchJSON(`${BACKEND}/api/trainer/dashboard`)
      .then(res => {
        if (res.error) {
          setError(res.error || "We couldn't load cohort readiness insights at the moment. Please try again.");
        } else {
          setDashboard(res.data);
          setLastUpdated(Date.now());
        }
      })
      .catch(err => setError(err.message || "We couldn't load cohort readiness insights at the moment. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  /* ---------------- LOAD ALERTS ---------------- */
  useEffect(() => {
    fetchJSON(`${BACKEND}/api/trainer/alerts`)
      .then(res => setAlerts(res.error ? null : res.data))
      .catch(() => setAlerts(null));
  }, []);

  function formatUpdated(ts) {
    if (!ts) return "";
    const delta = Math.round((Date.now() - ts) / 1000);
    if (delta < 60) return "Last updated just now";
    return `Last updated ${new Date(ts).toLocaleString()}`;
  }

  function formatRisk(level) {
    if (!level) return "";
    const l = String(level).toLowerCase();
    if (l.includes("high")) return "High Risk";
    if (l.includes("medium")) return "Medium Risk";
    return "Low Risk";
  }

  function flagToBadge(flag) {
    if (flag === "green") return { emoji: "🟢", label: "Job Ready", color: "#047857" };
    if (flag === "amber") return { emoji: "🟠", label: "Near Ready", color: "#92400e" };
    return { emoji: "🔴", label: "At Risk", color: "#991b1b" };
  }

  function decisionPill(decision) {
    if (!decision) return null;
    if (decision.decision_state === "monitor")
      return pill("#ecfdf5", "#047857", "Monitor");
    if (decision.decision_state === "intervene")
      return pill("#fffbeb", "#92400e", "Action Required");
    return pill("#fef2f2", "#991b1b", "Escalate");
  }

  /* ---------------- RENDER STATES ---------------- */
  if (loading) return (
    <div style={{ padding: 24 }}>
      <Card style={{ padding: 24, textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}><span style={{ marginRight: 12 }}><Spinner /></span><div>Analyzing cohort readiness…</div></div>
      </Card>
    </div>
  );
  if (error) return (
    <div style={{ padding: 24 }}><Card style={{ padding: 24, color: COLORS.danger }}>We couldn't load cohort readiness insights at the moment. Please try again.</Card></div>
  );
  if (!dashboard) return (
    <div style={{ padding: 24 }}><Card style={{ padding: 24, textAlign: 'center', color: COLORS.muted }}>No cohorts enrolled yet — once cohorts are added they will appear here.</Card></div>
  );
  return (
    <AppLayout role="trainer" active="/trainer">
      {/* ---------- HEADER ---------- */}
      <div style={header}>
        <div>
          <h2 style={{ margin: 0 }}>🧑‍🏫 Trainer Dashboard</h2>
          <div style={subtle}>Cohort readiness & intervention signals</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: COLORS.muted }}>{formatUpdated(lastUpdated)}</div>
          <div style={legend}>
            <span>🟢 Job Ready</span>
            <span>🟠 Near Ready</span>
            <span>🔴 At Risk</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          <Card style={{ padding: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Total Cohorts</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{dashboard.total_cohorts}</div>
          </Card>

          <Card style={{ padding: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Avg Readiness</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{Math.round(((dashboard?.cohorts || []).reduce((s, c) => s + (c.ready_pct || 0), 0) / ((dashboard?.cohorts || []).length || 1)) * 100) / 100}%</div>
          </Card>

          <Card style={{ padding: 14, textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#6b7280' }}>At Risk Cohorts</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{(dashboard?.cohorts || []).filter(c => c.readiness_flag === 'red').length ?? 0}</div>
          </Card>

        </div>
      </div>

      {/* ================= COHORT CARDS ================= */}
      {(dashboard?.cohorts || []).map(c => {
        const badge = flagToBadge(c.readiness_flag);

        return (
          <Card key={c.cohort_id} style={{ marginBottom: 16 }}>
            <div style={row}>
              <div>
                <div style={label}>Cohort #{c.cohort_id}</div>
                <div style={value}>{c.duration}</div>
                <div style={subtle}>
                  Enrolled {c.enrolled}/{c.seats}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                {decisionPill(c.decision_intelligence)}
                <div style={{ marginTop: 6, color: badge.color, fontWeight: 700 }}>
                  {badge.emoji} {badge.label}
                </div>
              </div>
            </div>

            {/* Ready % */}
            <div style={{ marginTop: 14 }}>
              <div style={label}>Readiness</div>
              <div style={progressBg}>
                <div
                  style={{
                    ...progressFill,
                    width: `${c.ready_pct}%`,
                    background:
                      c.ready_pct >= 70
                        ? COLORS.success
                        : c.ready_pct >= 50
                        ? COLORS.warn
                        : COLORS.danger
                  }}
                />
              </div>
              <div style={subtle}>{c.ready_pct}% learners ready</div>
            </div>

            {/* Risk info */}
            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>
                Risk: <span style={{ color: c.risk_level === "High" ? COLORS.danger : c.risk_level === "Medium" ? COLORS.warn : COLORS.success }}>{c.risk_level}</span>
              </div>
              {c.risk_explainers && c.risk_explainers.length > 0 && (
                <div style={subtle}>{c.risk_explainers.join(" · ")}</div>
              )}
            </div>

            {/* Intervention */}
            {c.intervention?.intervention_required && (
              <div style={interventionBox}>
                <div style={{ fontWeight: 700 }}>
                  {c.intervention.intervention_type.replace("_", " ")}
                </div>
                <div style={subtle}>
                  Priority {c.intervention.priority} · SLA {c.intervention.sla_days} days
                </div>
                <div style={subtle}>
                  ⏳ Pending {c.intervention.accountability.pending_days} days
                  {c.intervention.accountability.breached && (
                    <span style={{ color: COLORS.danger, fontWeight: 700 }}>
                      {" "}· SLA BREACHED
                    </span>
                  )}
                </div>
              </div>
            )}
          </Card>
        );
      })}

      {/* ================= EARLY WARNING SYSTEM ================= */}
      <div style={{ marginTop: 40 }}>
        <h3>🚨 Early Warning Alerts</h3>

        {!alerts && <p style={subtle}>Loading risk analysis…</p>}

        {/* DEBUG: alerts */}
        {console.log && console.log('Trainer alerts:', alerts)}

        {alerts && (          <div style={card}>
            <div style={subtle}>
              Total Learners: <b>{alerts.total_learners}</b> · At Risk:{" "}
              <b>{alerts.at_risk.length}</b>
            </div>

            {alerts.at_risk.length === 0 ? (
              <p style={{ color: COLORS.success, fontWeight: 600, marginTop: 10 }}>
                ✅ No at-risk learners detected
              </p>
            ) : (
              <table width="100%" cellPadding="8" style={{ marginTop: 10, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f5f7fa' }}>
                    <th align="left" style={{ padding: 10 }}>Name</th>
                    <th align="left" style={{ padding: 10 }}>Email</th>
                    <th align="left" style={{ padding: 10 }}>Avg Score</th>
                    <th align="left" style={{ padding: 10 }}>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {(alerts?.at_risk || []).map((a, idx) => (
                    <tr key={a.candidate_id} style={{ background: idx % 2 === 0 ? '#ffffff' : '#fbfdff' }}>
                      <td style={{ padding: 10 }}>{a.name}</td>
                      <td style={{ padding: 10 }}>{a.email}</td>
                      <td style={{ padding: 10 }}>{a.avg_score}</td>
                      <td style={{ padding: 10, fontWeight: 700, color: a.risk_level === "HIGH" ? COLORS.danger : COLORS.warn }}>
                        {a.risk_level}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

/* ---------------- STYLES ---------------- */

const page = { padding: 28, background: "#f9fafb", minHeight: "100vh" };
const header = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 };
const legend = { display: "flex", gap: 12, fontSize: 13 };
const card = { background: "#fff", padding: 20, borderRadius: 14, border: "1px solid #e5e7eb", marginBottom: 16 };
const row = { display: "flex", justifyContent: "space-between", alignItems: "flex-start" };
const label = { fontSize: 12, color: "#6b7280" };
const value = { fontSize: 18, fontWeight: 600 };
const subtle = { fontSize: 12, color: "#6b7280" };
const progressBg = { height: 10, background: "#e5e7eb", borderRadius: 6, marginTop: 6 };
const progressFill = { height: "100%", borderRadius: 6 };
const interventionBox = { marginTop: 14, padding: 12, background: "#fff7ed", borderRadius: 10, border: "1px solid #fed7aa" };
const pill = (bg, color, text) => (
  <span style={{ background: bg, color, padding: "6px 14px", borderRadius: 999, fontWeight: 600 }}>
    {text}
  </span>
);
