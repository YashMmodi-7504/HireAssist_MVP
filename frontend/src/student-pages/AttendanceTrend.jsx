import React from "react";

/* =====================================================
   ATTENDANCE DATA (BACKEND READY)
===================================================== */

const ATTENDANCE = {
  overall: 86,
  minimumRequired: 75,
  eligible: true,
  attended: 41,
  total: 48,
  weekly: [
    { day: "Mon", date: "2026-01-01", percent: 88 },
    { day: "Tue", date: "2026-01-02", percent: 84 },
    { day: "Wed", date: "2026-01-03", percent: 90 },
    { day: "Thu", date: "2026-01-04", percent: 82 },
    { day: "Fri", date: "2026-01-05", percent: 86 }
  ]
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function Attendance() {
  const { overall, minimumRequired, eligible, attended, total, weekly } =
    ATTENDANCE;

  return (
    <div style={page}>
      {/* HEADER */}
      <div style={header}>
        <div>
          <h2 style={{ margin: 0 }}>Attendance Overview</h2>
          <p style={subtle}>
            Track your daily attendance with date-wise clarity
          </p>
        </div>

        <span style={statusBadge(eligible)}>
          {eligible ? "Excellent" : "At Risk"}
        </span>
      </div>

      {/* SUMMARY CARDS */}
      <div style={statsGrid}>
        <StatCard title="Overall Attendance" value={`${overall}%`} />
        <StatCard title="Minimum Required" value={`${minimumRequired}%`} />
        <StatCard
          title="Eligibility"
          value={eligible ? "Eligible" : "Not Eligible"}
        />
        <StatCard title="Classes Attended" value={`${attended}/${total}`} />
      </div>

      {/* WEEKLY TREND */}
      <div style={card}>
        <h3 style={sectionTitle}>Weekly Attendance Trend</h3>
        <p style={subtleSmall}>
          Attendance by day and date (last 5 working days)
        </p>

        <div style={{ marginTop: 18 }}>
          {weekly.map(w => (
            <div key={w.date} style={row}>
              <div style={dayDateCol}>
                <span style={day}>{w.day}</span>
                <span style={dateStrong}>
                  {new Date(w.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}
                </span>
              </div>

              <div style={barBg}>
                <div
                  style={{
                    ...barFill,
                    width: `${w.percent}%`,
                    background:
                      w.percent >= minimumRequired
                        ? "#7c3aed"
                        : "#ef4444"
                  }}
                />
              </div>

              <div style={percent}>{w.percent}%</div>
            </div>
          ))}
        </div>

        <div style={legend}>
          <span>
            <span style={{ ...dot, background: "#7c3aed" }} /> Meets requirement
          </span>
          <span>
            <span style={{ ...dot, background: "#ef4444" }} /> Below requirement
          </span>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   SMALL COMPONENTS
===================================================== */

function StatCard({ title, value }) {
  return (
    <div style={statCard}>
      <div style={statTitle}>{title}</div>
      <div style={statValue}>{value}</div>
    </div>
  );
}

/* =====================================================
   STYLES
===================================================== */

const page = {
  padding: 24,
  maxWidth: 1200
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 26
};

const subtle = {
  fontSize: 13,
  color: "#6b7280",
  marginTop: 6
};

const subtleSmall = {
  fontSize: 12,
  color: "#6b7280"
};

const statusBadge = ok => ({
  padding: "6px 16px",
  borderRadius: 999,
  fontWeight: 700,
  fontSize: 13,
  color: ok ? "#047857" : "#b91c1c",
  border: `1px solid ${ok ? "#10b981" : "#ef4444"}`
});

/* STATS */
const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
  gap: 16,
  marginBottom: 32
};

const statCard = {
  background: "#ffffff",
  borderRadius: 14,
  padding: 18,
  border: "1px solid #e5e7eb"
};

const statTitle = {
  fontSize: 13,
  color: "#6b7280",
  marginBottom: 6
};

const statValue = {
  fontSize: 24,
  fontWeight: 800
};

/* WEEKLY TREND */
const card = {
  background: "#ffffff",
  borderRadius: 16,
  padding: 22,
  border: "1px solid #e5e7eb"
};

const sectionTitle = {
  fontSize: 16,
  fontWeight: 800,
  marginBottom: 4
};

const row = {
  display: "grid",
  gridTemplateColumns: "200px 1fr 50px", // wider for day/date
  alignItems: "center",
  gap: 18,
  marginBottom: 16,
  minWidth: 0
};

const dayDateCol = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
  minWidth: 160
};

const day = {
  fontSize: 15,
  fontWeight: 700,
  marginRight: 8,
  color: "#1f2937"
};

const dateStrong = {
  fontSize: 13,
  color: "#374151",
  fontWeight: 600,
  background: "#f3f4f6",
  borderRadius: 6,
  padding: "2px 8px",
  marginLeft: 0,
  letterSpacing: 0.2
};

const barBg = {
  height: 10,
  background: "#e5e7eb",
  borderRadius: 999,
  overflow: "hidden"
};

const barFill = {
  height: "100%",
  borderRadius: 999,
  transition: "width .4s ease"
};

const percent = {
  fontSize: 13,
  fontWeight: 700,
  textAlign: "right"
};

const legend = {
  display: "flex",
  gap: 20,
  marginTop: 18,
  fontSize: 12,
  color: "#6b7280"
};

const dot = {
  display: "inline-block",
  width: 10,
  height: 10,
  borderRadius: "50%",
  marginRight: 6
};
