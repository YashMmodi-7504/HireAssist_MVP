import React from "react";
import { getSession } from "./utils/session";

/* ---------------- MOCK REAL-WORLD DATA ---------------- */
/* Metrics-only mock data (safe to replace with API later) */
const studentMetrics = {
  enrolledCourses: [
    {
      id: 1,
      title: "AI & Data Foundations",
      progress: 42,
      status: "In Progress",
      modules: [
        { name: "Introduction to AI", status: "completed" },
        { name: "Python for AI", status: "completed" },
        { name: "Data Handling", status: "in_progress" },
        { name: "Mini Project", status: "pending" }
      ]
    }
  ],
  attendance: 86,
  learningStatus: "On Track"
};

export default function StudentDashboard() {
  const session = getSession();
  const course = studentMetrics.enrolledCourses[0];

  const completed = course.modules.filter(
    m => m.status === "completed"
  ).length;

  const total = course.modules.length;

  const firstName = session?.full_name?.split(" ")[0] || "Student";

  return (
    <div style={page}>
      {/* ---------- HEADER ---------- */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>
          Welcome back, {firstName} 👋
        </h2>
        <p style={subtle}>
          You are making steady progress. Keep going!
        </p>
      </div>

      {/* ---------- KPI CARDS ---------- */}
      <div style={grid}>
        <StatCard title="Enrolled Courses" value="1 Active" />
        <StatCard title="Overall Progress" value={`${course.progress}%`} />
        <StatCard title="Attendance" value={`${studentMetrics.attendance}%`} />
        <StatCard title="Learning Status" value={studentMetrics.learningStatus} />
      </div>

      {/* ---------- COURSE PROGRESS ---------- */}
      <div style={section}>
        <h3>📘 Current Course</h3>

        <div style={courseCard}>
          <div>
            <div style={{ fontWeight: 700 }}>{course.title}</div>
            <div style={subtle}>{course.status}</div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={progressBg}>
              <div
                style={{
                  ...progressFill,
                  width: `${course.progress}%`
                }}
              />
            </div>
            <div style={subtle}>
              {course.progress}% completed
            </div>
          </div>
        </div>
      </div>

      {/* ---------- LEARNING PATH ---------- */}
      <div style={section}>
        <h3>🧭 Learning Path</h3>

        <div style={pathCard}>
          {course.modules.map((m, idx) => (
            <div key={idx} style={pathRow}>
              <span style={statusIcon(m.status)} />
              <span>{m.name}</span>
              <span style={pathStatus(m.status)}>
                {label(m.status)}
              </span>
            </div>
          ))}
        </div>

        <div style={subtle}>
          Completed {completed} of {total} modules
        </div>
      </div>
    </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function StatCard({ title, value }) {
  return (
    <div style={statCard}>
      <div style={statLabel}>{title}</div>
      <div style={statValue}>{value}</div>
    </div>
  );
}

/* ---------------- HELPERS ---------------- */

const label = s =>
  s === "completed" ? "Completed" :
  s === "in_progress" ? "In Progress" :
  "Pending";

const statusIcon = s => ({
  width: 10,
  height: 10,
  borderRadius: "50%",
  background:
    s === "completed" ? "#16a34a" :
    s === "in_progress" ? "#f59e0b" :
    "#d1d5db"
});

const pathStatus = s => ({
  fontSize: 12,
  color:
    s === "completed" ? "#16a34a" :
    s === "in_progress" ? "#f59e0b" :
    "#6b7280"
});

/* ---------------- STYLES ---------------- */

const page = {
  padding: 24
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: 16,
  marginBottom: 28
};

const statCard = {
  background: "#fff",
  borderRadius: 14,
  padding: 18,
  border: "1px solid #e5e7eb"
};

const statLabel = {
  fontSize: 12,
  color: "#6b7280"
};

const statValue = {
  fontSize: 24,
  fontWeight: 700
};

const section = {
  marginBottom: 32
};

const courseCard = {
  background: "#fff",
  borderRadius: 14,
  padding: 18,
  border: "1px solid #e5e7eb",
  maxWidth: 520
};

const progressBg = {
  height: 10,
  background: "#e5e7eb",
  borderRadius: 6,
  marginTop: 6
};

const progressFill = {
  height: "100%",
  borderRadius: 6,
  background: "#7c3aed"
};

const pathCard = {
  background: "#fff",
  borderRadius: 14,
  padding: 18,
  border: "1px solid #e5e7eb",
  maxWidth: 520
};

const pathRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "10px 0",
  borderBottom: "1px solid #f3f4f6"
};

const subtle = {
  fontSize: 13,
  color: "#6b7280"
};
