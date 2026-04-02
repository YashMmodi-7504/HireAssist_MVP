import React, { useEffect, useState } from "react";

import Card from "./components/Card";
import Spinner from "./components/Spinner";
import { COLORS, FONTS } from "./theme";
import AppLayout from "./layouts/AppLayout";

const BACKEND = "http://127.0.0.1:8000";
import { fetchJSON } from "./utils/api";

export default function AdminDashboard() {
  // Safe initial state per guidelines
  const [skills, setSkills] = useState(null); // null -> not loaded yet
  const [metrics, setMetrics] = useState({ total_candidates: 0, learners_trained: 0, placements: 0, avg_score: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetchJSON(`${BACKEND}/api/skills/heatmap`);
        if (!mounted) return;

        if (res.error) {
          setError(res.error);
          setSkills([]);
        } else {
          const data = res.data;

          // normalize skills list
          let s = [];
          if (Array.isArray(data)) s = data;
          else if (Array.isArray(data.skills)) s = data.skills;
          else s = [];

          setSkills(s);

          // attempt to extract optional metrics if backend provided them
          setMetrics({
            total_candidates: Number(data.total_candidates ?? data.totalCandidates ?? metrics.total_candidates ?? 0) || 0,
            learners_trained: Number(data.learners_trained ?? data.learnersTrained ?? metrics.learners_trained ?? 0) || 0,
            placements: Number(data.placements ?? metrics.placements ?? 0) || 0,
            avg_score: Number(data.avg_score ?? data.avgScore ?? metrics.avg_score ?? 0) || 0
          });

          setLastUpdated(Date.now());
        }
      } catch (err) {
        setError(err?.message || "We couldn't load skill gap insights at the moment. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  function formatUpdated(ts) {
    if (!ts) return "";
    const delta = Math.round((Date.now() - ts) / 1000);
    if (delta < 60) return "Last updated just now";
    return `Last updated ${new Date(ts).toLocaleString()}`;
  }

  function DecisionPill({ decision }) {
    if (!decision) {
      return (
        <span style={pillStyle("#f3f4f6", "#6b7280")}>—</span>
      );
    }

    if (decision.decision_state === "monitor") return <span style={pillStyle("#ecfdf5", "#047857")}>Monitor</span>;
    if (decision.decision_state === "intervene") return <span style={pillStyle("#fffbeb", "#92400e")}>Action Required</span>;
    return <span style={pillStyle("#fef2f2", "#991b1b")}>Escalate</span>;
  }

  function demandColor(d, max) {
    if (!max) return "#16a34a";
    if (d >= max * 0.7) return "#ef4444";
    if (d >= max * 0.4) return "#f59e0b";
    return "#16a34a";
  }

  // Derived safe values
  const safeSkills = Array.isArray(skills) ? skills : [];
  const maxDemand = safeSkills.length ? Math.max(...safeSkills.map(s => Number(s?.demand ?? 0))) : 0;

  return (
    <AppLayout role="admin" active="/admin">
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ marginBottom: 4 }}>🧑‍💼 Admin Skill Intelligence</h2>
          <div style={subtle}>Skill gaps, demand pressure & intervention signals</div>
        </div>
        <div style={{ color: '#6b7280', fontSize: 12 }}>{formatUpdated(lastUpdated)}</div>
      </div>

      {/* Top KPIs */}
      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
        <Card style={{ padding: 14, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Total Candidates</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{metrics.total_candidates ?? "—"}</div>
          </div>
        </Card>

        <Card style={{ padding: 14, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Learners Trained</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{metrics.learners_trained ?? "—"}</div>
          </div>
        </Card>

        <Card style={{ padding: 14, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Placements (≥70)</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{metrics.placements ?? "—"}</div>
          </div>
        </Card>

        <Card style={{ padding: 14, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Avg Assessment</div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>{Number(metrics.avg_score ?? 0).toFixed(1)}</div>
          </div>
        </Card>
      </div>

      {/* Main content: loading / error / empty / list */}
      <div style={{ marginTop: 12 }}>
        {loading && (
          <Card style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}><span style={{ marginRight: 12 }}><Spinner /></span><div>Analyzing skill demand and intervention signals…</div></div>
          </Card>
        )}

        {!loading && error && (
          <Card style={{ padding: 24, color: COLORS.danger }}>{error}</Card>
        )}

        {!loading && !error && safeSkills.length === 0 && (
          <Card style={{ padding: 24, textAlign: 'center', color: COLORS.muted }}>No skill gaps detected — everything looks stable right now.</Card>
        )}

        {!loading && !error && safeSkills.length > 0 && (
          safeSkills.map((skill, idx) => {
            const demand = Number(skill?.demand ?? 0);
            const pct = maxDemand > 0 ? Math.round((demand / maxDemand) * 100) : 0;
            const key = skill?.skill ?? skill?.name ?? `skill-${idx}`;

            return (
              <Card key={key} style={{ marginBottom: 16 }}>
                <div style={row}>
                  <div>
                    <div style={label}>{skill?.skill ?? skill?.name ?? "—"}</div>
                    <div style={subtle}>Demand score</div>
                  </div>

                  <DecisionPill decision={skill?.decision_intelligence} />
                </div>

                {/* Demand Bar */}
                <div style={{ marginTop: 12 }}>
                  <div style={progressBg}>
                    <div
                      style={{
                        ...progressFill,
                        width: `${pct}%`,
                        background: demandColor(demand, maxDemand)
                      }}
                    />
                  </div>
                  <div style={subtle}>{demand} demand units</div>
                </div>

                {/* Intervention */}
                {skill?.intervention?.intervention_required ? (
                  <div style={interventionBox}>
                    <div style={{ fontWeight: 700 }}>
                      {skill?.intervention?.intervention_type?.replace("_", " ") ?? "—"}
                    </div>
                    <div style={subtle}>
                      Priority {skill?.intervention?.priority ?? "—"} · SLA {skill?.intervention?.sla_days ?? "—"} days
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop: 10, color: COLORS.success, fontWeight: 600 }}>
                    No Action Required
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </AppLayout>
  );
}

/* ---------------- STYLES ---------------- */

const page = {
  padding: 28,
  background: "#f8fafc",
  minHeight: "100vh",
  fontFamily: FONTS.ui
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const label = {
  fontSize: 16,
  fontWeight: 700,
  color: '#0f172a'
};

const subtle = {
  fontSize: 12,
  color: COLORS.muted
};

const progressBg = {
  height: 10,
  background: "#eaeef2",
  borderRadius: 6,
  marginTop: 6
};

const progressFill = {
  height: "100%",
  borderRadius: 6
};

const interventionBox = {
  marginTop: 14,
  padding: 12,
  background: "#fff7ed",
  borderRadius: 10,
  border: "1px solid #fed7aa"
};

function pillStyle(bg, color) {
  return {
    background: bg,
    color,
    padding: "6px 14px",
    borderRadius: 999,
    fontWeight: 600,
    fontSize: 13
  };
}

