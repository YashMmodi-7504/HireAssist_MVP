
import React, { useState, useEffect, useMemo } from "react";

/* ===================== MOCK API (Replace with real API) ===================== */
function fetchAttendanceData() {
  return new Promise(resolve =>
    setTimeout(() => {
      resolve({
        overall: 86,
        minimumRequired: 75,
        attended: 41,
        totalClasses: 48,
        weeklyTrend: [
          { day: "Mon", date: "2026-01-05", percent: 88 },
          { day: "Tue", date: "2026-01-06", percent: 84 },
          { day: "Wed", date: "2026-01-07", percent: 90 },
          { day: "Thu", date: "2026-01-08", percent: 82 },
          { day: "Fri", date: "2026-01-09", percent: 86 }
        ],
        lastUpdated: new Date().toISOString()
      });
    }, 900)
  );
}

export default function ViewAttendance() {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAttendanceData()
      .then(data => {
        setAttendance(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load attendance data.");
        setLoading(false);
      });
  }, []);

  // Derived metrics (do not change business logic)
  const metrics = useMemo(() => {
    if (!attendance) return {};
    const { overall, minimumRequired, attended, totalClasses, weeklyTrend } = attendance;
    const eligible = overall >= minimumRequired;
    const buffer = overall - minimumRequired;
    const missable = eligible ? Math.floor(((overall - minimumRequired) / 100) * totalClasses) : 0;
    const weeklyAvg = weeklyTrend.reduce((sum, d) => sum + d.percent, 0) / weeklyTrend.length;
    const projected = Math.round(
      ((attended + (totalClasses - attended) * (weeklyAvg / 100)) / totalClasses) * 100
    );
    const riskForecast = projected < minimumRequired ? "Critical" : buffer < 5 ? "Watch" : "Safe";
    const volatility = Math.sqrt(
      weeklyTrend.reduce((sum, d) => sum + Math.pow(d.percent - weeklyAvg, 2), 0) / weeklyTrend.length
    ).toFixed(1);
    const lowestDay = weeklyTrend.reduce((a, b) => (a.percent < b.percent ? a : b));
    return {
      eligible,
      buffer,
      missable,
      projected,
      weeklyAvg: Math.round(weeklyAvg),
      volatility,
      riskForecast,
      lowestDay
    };
  }, [attendance]);

  // Executive advisory
  const advisory = useMemo(() => {
    if (!attendance || !metrics) return null;
    if (metrics.riskForecast === "Critical") {
      return {
        zone: "Critical Zone",
        text: "Your projected attendance is below the required threshold. Immediate recovery is required. Please prioritize attendance in upcoming sessions."
      };
    }
    if (metrics.riskForecast === "Watch") {
      return {
        zone: "Watch Zone",
        text: "Your attendance buffer is low. Avoid missing further classes to maintain eligibility."
      };
    }
    return {
      zone: "Safe Zone",
      text: "Attendance is in a safe range. Continue your current participation to remain eligible."
    };
  }, [attendance, metrics]);

  return (
    <main style={page}>
      <Header
        loading={loading}
        error={error}
        lastUpdated={attendance?.lastUpdated}
        status={metrics?.riskForecast}
      />

      <KPICards attendance={attendance} metrics={metrics} loading={loading} />

      <WeeklyTrend
        weeklyTrend={attendance?.weeklyTrend || []}
        minimumRequired={attendance?.minimumRequired}
        metrics={metrics}
        loading={loading}
      />

      <Summary attendance={attendance} loading={loading} />

      <AdvisorySection advisory={advisory} loading={loading} />
    </main>
  );
}

function Header({ loading, error, lastUpdated, status }) {
  return (
    <header style={header}>
      <div>
        <h1 style={pageTitle}>Attendance Dashboard</h1>
        <p style={subtle}>Daily attendance with eligibility and risk analysis</p>
        {lastUpdated && (
          <span style={lastUpdatedStyle}>
            Last updated: {new Date(lastUpdated).toLocaleString()}
          </span>
        )}
      </div>
      <div style={headerStatusRow}>
        {status && <span style={statusBadge(status)}>{status}</span>}
        {loading && <span style={loadingText}>Loading…</span>}
        {error && <span style={errorText}>{error}</span>}
      </div>
    </header>
  );
}

function KPICards({ attendance, metrics, loading }) {
  if (loading || !attendance) return null;
  const items = [
    {
      label: "Overall Attendance",
      value: `${attendance.overall}%`,
      color: metrics.buffer > 10 ? "#10b981" : metrics.buffer > 0 ? "#f59e0b" : "#ef4444"
    },
    {
      label: "Eligibility",
      value: metrics.eligible ? "Eligible" : "Not Eligible",
      color: metrics.eligible ? "#10b981" : "#ef4444"
    },
    {
      label: "Buffer %",
      value: `${metrics.buffer}%`,
      color: metrics.buffer > 10 ? "#10b981" : metrics.buffer > 0 ? "#f59e0b" : "#ef4444"
    },
    {
      label: "Missable Classes",
      value: metrics.missable,
      color: metrics.missable > 2 ? "#10b981" : metrics.missable > 0 ? "#f59e0b" : "#ef4444"
    },
    {
      label: "Projected Attendance",
      value: `${metrics.projected}%`,
      color: metrics.projected >= attendance.minimumRequired ? "#10b981" : "#ef4444"
    },
    {
      label: "Volatility Index",
      value: metrics.volatility,
      color: metrics.volatility < 3 ? "#10b981" : metrics.volatility < 6 ? "#f59e0b" : "#ef4444"
    }
  ];
  return (
    <section style={kpiGrid}>
      {items.map(({ label, value, color }) => (
        <div
          key={label}
          style={kpiCard}
          tabIndex={0}
          aria-label={label}
          onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 24px #a5b4fc44, 0 1.5px 0 #e0e7ff inset"}
          onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 8px #e5e7eb22"}
          onFocus={e => e.currentTarget.style.boxShadow = "0 6px 24px #a5b4fc44, 0 1.5px 0 #e0e7ff inset"}
          onBlur={e => e.currentTarget.style.boxShadow = "0 2px 8px #e5e7eb22"}
        >
          <div style={kpiLabel}>{label}</div>
          <div style={{ ...kpiValue, color }}>{value}</div>
        </div>
      ))}
    </section>
  );
}

function WeeklyTrend({ weeklyTrend, minimumRequired, metrics, loading }) {
  if (loading || !weeklyTrend.length) return null;
  return (
    <section style={section}>
      <h2 style={sectionTitle}>Weekly Attendance Trend</h2>
      <p style={subtleSmall}>Day-wise attendance (last 5 working days)</p>
      <div style={trendCard}>
        {weeklyTrend.map(d => (
          <div
            key={d.date}
            style={trendRow}
            tabIndex={0}
            aria-label={`Attendance for ${d.day}`}
            onMouseEnter={e => e.currentTarget.style.background = "#f3f4f6"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            onFocus={e => e.currentTarget.style.background = "#f3f4f6"}
            onBlur={e => e.currentTarget.style.background = "transparent"}
          >
            {/* Day + Date stacked */}
            <div style={trendDayCol}>
              <span style={trendDay}>{d.day}</span>
              <span style={trendDate}>
                {new Date(d.date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                })}
              </span>
            </div>
            {/* Bar */}
            <div style={trendBarBg}>
              <div
                style={{
                  ...trendBarFill,
                  width: `${d.percent}%`,
                  background:
                    d.day === metrics.lowestDay.day
                      ? "#fca5a5"
                      : d.percent >= minimumRequired
                      ? "#7c3aed"
                      : "#f59e0b",
                  boxShadow:
                    d.day === metrics.lowestDay.day
                      ? "0 0 0 2px #fca5a5"
                      : undefined
                }}
                aria-label={`Attendance bar for ${d.day}`}
              />
              {/* Average indicator line */}
              <div
                style={{
                  position: "absolute",
                  left: `${metrics.weeklyAvg}%`,
                  top: 0,
                  height: "100%",
                  width: 2,
                  background: "#10b981",
                  opacity: 0.4,
                  pointerEvents: "none"
                }}
                aria-hidden="true"
              />
            </div>
            {/* Percent */}
            <div style={trendPercent}>{d.percent}%</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Summary({ attendance, loading }) {
  if (loading || !attendance) return null;
  return (
    <section style={section}>
      <h2 style={sectionTitle}>Monthly Summary</h2>
      <div style={summaryGrid}>
        <SummaryItem label="Total Classes" value={attendance.totalClasses} />
        <SummaryItem label="Attended" value={attendance.attended} />
        <SummaryItem
          label="Attendance %"
          value={`${Math.round(
            (attendance.attended / attendance.totalClasses) * 100
          )}%`}
        />
      </div>
    </section>
  );
}
function SummaryItem({ label, value }) {
  // Add hover/focus for summary cards
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      style={{
        ...summaryItem,
        boxShadow: hovered ? "0 4px 16px #a5b4fc33" : summaryItem.boxShadow,
        borderColor: hovered ? "#6366f1" : summaryItem.borderColor
      }}
      tabIndex={0}
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div style={kpiLabel}>{label}</div>
      <div style={kpiValue}>{value}</div>
    </div>
  );
}

function AdvisorySection({ advisory, loading }) {
  if (loading || !advisory) return null;
  return (
    <section style={advisorySection}>
      <div style={advisoryBox(advisory.zone)}>
        <strong style={advisoryZone}>{advisory.zone}:</strong> {advisory.text}
      </div>
    </section>
  );
}

const page = {
  padding: 32,
  maxWidth: 1200,
  margin: "0 auto",
  fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
  background: "linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)",
  minHeight: "100vh"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  flexWrap: "wrap",
  marginBottom: 40,
  gap: 20,
  borderBottom: "2px solid #e0e7ff",
  paddingBottom: 18
};

const headerStatusRow = {
  display: "flex",
  alignItems: "center",
  gap: 12
};

const pageTitle = {
  fontSize: 34,
  fontWeight: 900,
  margin: 0,
  color: "#312e81",
  letterSpacing: 0.5,
  textShadow: "0 2px 8px #e0e7ff55"
};

const subtle = { fontSize: 15, color: "#64748b", marginTop: 6 };
const subtleSmall = { fontSize: 13, color: "#64748b", marginBottom: 8, fontStyle: "italic" };

const lastUpdatedStyle = { fontSize: 12, color: "#6b7280", marginTop: 4 };
const loadingText = { color: "#7c3aed", fontWeight: 500, marginLeft: 12 };
const errorText = { color: "#dc2626", fontWeight: 500, marginLeft: 12 };

const statusBadge = status => ({
  padding: "7px 18px",
  borderRadius: 999,
  fontWeight: 700,
  fontSize: 14,
  border:
    status === "Safe"
      ? "1.5px solid #10b981"
      : status === "Watch"
      ? "1.5px solid #f59e0b"
      : "1.5px solid #ef4444",
  color:
    status === "Safe"
      ? "#047857"
      : status === "Watch"
      ? "#92400e"
      : "#b91c1c",
  background:
    status === "Safe"
      ? "#ecfdf5"
      : status === "Watch"
      ? "#fef9c3"
      : "#fef2f2"
});

const kpiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 32,
  marginBottom: 44
};

const kpiCard = {
  background: "linear-gradient(120deg, #f1f5f9 80%, #e0e7ff 100%)",
  padding: 28,
  borderRadius: 18,
  border: "1.5px solid #c7d2fe",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  minHeight: 120,
  boxShadow: "0 4px 24px #c7d2fe33, 0 1.5px 0 #e0e7ff inset",
  transition: "box-shadow 0.2s, border 0.2s"
};

const kpiLabel = { fontSize: 14, color: "#64748b", marginBottom: 6 };
const kpiValue = { fontSize: 38, fontWeight: 900, letterSpacing: 0.5, color: "#312e81", marginTop: 2 };

const section = { marginBottom: 36, width: "100%" };
const sectionTitle = { fontSize: 22, fontWeight: 800, margin: 0, color: "#3730a3", marginBottom: 6, letterSpacing: 0.2 };

const trendCard = {
  background: "linear-gradient(120deg, #f1f5f9 80%, #e0e7ff 100%)",
  padding: 28,
  borderRadius: 18,
  border: "1.5px solid #c7d2fe",
  marginTop: 12,
  boxShadow: "0 4px 24px #c7d2fe22"
};

const trendRow = {
  display: "grid",
  gridTemplateColumns: "120px 1fr 60px",
  gap: 22,
  alignItems: "center",
  marginBottom: 22
};

const trendDayCol = { display: "flex", flexDirection: "column", alignItems: "flex-start" };
const trendDay = { fontWeight: 800, fontSize: 17, color: "#3730a3", letterSpacing: 0.2 };
const trendDate = { fontSize: 13, color: "#64748b", marginTop: 2, fontStyle: "italic" };

const trendBarBg = {
  height: 14,
  background: "#e0e7ff",
  borderRadius: 999,
  overflow: "hidden",
  position: "relative",
  boxShadow: "0 1.5px 0 #c7d2fe inset"
};

const trendBarFill = {
  height: "100%",
  borderRadius: 999,
  transition: "width .4s cubic-bezier(.4,0,.2,1)",
  boxShadow: "0 2px 8px #a5b4fc33"
};

// Removed duplicate: use the visually improved version below
// Add a little more visual weight
const trendPercent = { fontWeight: 800, fontSize: 16, color: "#3730a3", textAlign: "right", letterSpacing: 0.2 };

const summaryGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
  gap: 28,
  marginTop: 16
};

// Removed duplicate: use the visually improved version below
const summaryItem = {
  textAlign: "center",
  background: "linear-gradient(120deg, #f1f5f9 80%, #e0e7ff 100%)",
  borderRadius: 14,
  padding: 22,
  border: "1.5px solid #c7d2fe",
  boxShadow: "0 2px 12px #c7d2fe22"
};

const advisorySection = { marginTop: 24, marginBottom: 12 };
const advisoryBox = zone => ({
  padding: 26,
  borderRadius: 18,
  background:
    zone === "Safe Zone"
      ? "linear-gradient(90deg, #ecfdf5 80%, #e0e7ff 100%)"
      : zone === "Watch Zone"
      ? "linear-gradient(90deg, #fef9c3 80%, #e0e7ff 100%)"
      : "linear-gradient(90deg, #fef2f2 80%, #e0e7ff 100%)",
  borderLeft:
    zone === "Safe Zone"
      ? "6px solid #10b981"
      : zone === "Watch Zone"
      ? "6px solid #f59e0b"
      : "6px solid #ef4444",
  fontWeight: 700,
  color:
    zone === "Safe Zone"
      ? "#047857"
      : zone === "Watch Zone"
      ? "#92400e"
      : "#b91c1c",
  fontSize: 17,
  boxShadow: "0 2px 12px #c7d2fe22"
});
const advisoryZone = { fontWeight: 800, marginRight: 8 };
