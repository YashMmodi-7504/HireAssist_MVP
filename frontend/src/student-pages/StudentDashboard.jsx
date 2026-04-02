import React from "react";

/* =====================================================
   ===================== STYLES =========================
   ===================================================== */

/* --- Academic Overview Strip --- */
const overviewStrip = {
  display: "flex",
  gap: 32,
  background: "#f8f6ff",
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: "12px 28px",
  marginBottom: 32,
  marginTop: -8,
  fontSize: 15,
  fontWeight: 500,
  boxShadow: "0 1px 4px rgba(80,60,180,0.03)",
  alignItems: "center"
};
const overviewItem = { minWidth: 120, whiteSpace: "nowrap" };
const overviewLabel = { color: "#7c3aed", fontWeight: 700, marginRight: 6, fontSize: 14 };
const checkIcon = { color: "#047857", fontWeight: 700, marginRight: 6, fontSize: 16, verticalAlign: "middle" };
const warnIcon = { color: "#b45309", fontWeight: 700, marginRight: 6, fontSize: 16, verticalAlign: "middle" };

/* --- Placement Placeholder Modal --- */
const placementPlaceholderCard = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: 16,
  padding: 32,
  maxWidth: 440,
  margin: "60px auto 0 auto",
  boxShadow: "0 12px 30px rgba(80,60,180,0.10)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};
const closeBtn = {
  marginTop: 24,
  background: "#ede9fe",
  color: "#5b21b6",
  border: "none",
  borderRadius: 8,
  padding: "8px 22px",
  fontWeight: 700,
  fontSize: 15,
  cursor: "pointer"
};
const placeholderMetric = {
  fontWeight: 700,
  fontSize: 16,
  color: "#5b21b6",
  margin: "10px 0 2px 0"
};
const placeholderValue = {
  fontWeight: 600,
  fontSize: 15,
  color: "#334155",
  marginBottom: 8
};
const placeholderNote = {
  color: "#6b7280",
  fontSize: 13,
  marginTop: 18,
  textAlign: "center"
};

/* --- AI Chatbot Styles --- */

/* --- Dashboard Layout --- */
const page = { padding: 32, maxWidth: 1200, margin: "0 auto" };
const heroCard = {
  background: "#fff",
  borderRadius: 16,
  padding: "28px 32px 24px 32px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  border: "1px solid #e5e7eb",
  marginBottom: 32,
  boxShadow: "0 2px 8px rgba(80,60,180,0.03)"
};
const heroText = { display: "flex", flexDirection: "column" };
const heroTitle = { fontSize: 26, fontWeight: 800, color: "#1e293b", margin: 0, letterSpacing: -0.5 };
const heroSub = { fontSize: 15, color: "#475569", marginTop: 10, fontWeight: 500, maxWidth: 420 };
const heroBadge = {
  background: "#f3f4f6",
  color: "#334155",
  fontWeight: 700,
  padding: "10px 20px",
  borderRadius: 999,
  border: "1px solid #e5e7eb",
  fontSize: 15,
  display: "flex",
  alignItems: "center",
  gap: 8
};
const badgeIcon = { fontSize: 18, marginRight: 6 };

/* --- KPI Grid --- */
const kpiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 18,
  marginBottom: 32
};
const kpiCard = {
  background: "#fff",
  borderRadius: 14,
  padding: 20,
  border: "1px solid #e5e7eb",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  minHeight: 110,
  boxShadow: "0 1px 4px rgba(80,60,180,0.02)"
};
const kpiGood = { background: "#f0fdf4", border: "1px solid #a7f3d0" };
const kpiTitle = { fontSize: 13, color: "#6b7280", fontWeight: 700, marginBottom: 2 };
const kpiValue = { fontSize: 28, fontWeight: 800, color: "#1e293b", marginBottom: 2 };
const kpiHint = { fontSize: 12, color: "#64748b", fontWeight: 500 };
const kpiIconAcademic = { fontSize: 22, color: "#6366f1", marginBottom: 6 };
const kpiIconPlacement = { fontSize: 22, color: "#0ea5e9", marginBottom: 6 };

/* --- Main Grid --- */
const mainGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
  gap: 24,
  marginBottom: 32
};
const card = {
  background: "#fff",
  borderRadius: 16,
  padding: 22,
  border: "1px solid #e5e7eb",
  boxShadow: "0 1px 4px rgba(80,60,180,0.02)"
};
const cardHeader = { display: "flex", gap: 10, alignItems: "center", fontWeight: 700, fontSize: 16, marginBottom: 10 };
const progressBg = {
  height: 8,
  background: "#e5e7eb",
  borderRadius: 6,
  marginTop: 8
};
const progressFill = {
  height: "100%",
  background: "#7c3aed",
  borderRadius: 6,
  transition: "width .4s cubic-bezier(.4,0,.2,1)"
};
const progressText = { fontSize: 12, color: "#6b7280", marginTop: 6 };
const checklist = { paddingLeft: 16, fontSize: 14, marginTop: 10 };
const checklistItem = { display: "flex", alignItems: "center", marginBottom: 4 };
const checklistText = { fontSize: 14, color: "#334155" };
const checklistIcon = { marginRight: 8 };
const checklistWarn = { color: "#b45309", fontWeight: 700, marginRight: 8 };

/* --- Info Banner (Motivation) --- */
const infoBanner = {
  background: "#f0fdf4",
  color: "#047857",
  borderLeft: "6px solid #10b981",
  padding: "18px 28px",
  borderRadius: 14,
  fontWeight: 600,
  fontSize: 15,
  margin: "32px 0 0 0"
};

/* --- Skeleton Loader Styles --- */
const skeleton = {
  background: "linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%)",
  backgroundSize: "200% 100%",
  animation: "skeleton 1.2s ease-in-out infinite",
  borderRadius: 8,
  minHeight: 22,
  width: "100%"
};
const avatar = {
  width: 54,
  height: 54,
  borderRadius: "50%",
  background: "#ede9fe",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  fontSize: 24,
  color: "#5b21b6",
  border: "2px solid #e5e7eb"
};
const lastUpdatedStyle = {
  color: "#64748b",
  fontSize: 12,
  marginLeft: 18,
  fontWeight: 500
};
const focusVisible = {
  outline: "2px solid #7c3aed",
  outlineOffset: 2
};

/* --- Add keyframes for skeleton animation --- */
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `@keyframes skeleton { 0% {background-position: 200% 0;} 100% {background-position: -200% 0;} }`;
document.head.appendChild(styleSheet);

/* --- Simulate loading state for demo --- */
function useLoadingDemo(delay = 1200) {
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return loading;
}

/* --- Add formatUpdated util --- */
function formatUpdated(ts) {
  if (!ts) return "";
  const delta = Math.round((Date.now() - ts) / 1000);
  if (delta < 60) return "Last updated just now";
  return `Last updated ${new Date(ts).toLocaleString()}`;
}

/* =====================================================
   ===================== DATA ===========================
   ===================================================== */

const placementReadinessState = {
  readinessScore: 71,
  skillGaps: ["Advanced SQL", "Data Structures & Algorithms"],
  resumeStrength: 68,
  interviewPreparedness: {
    attempts: 2,
    weakAreas: ["SQL Joins", "Behavioral Questions"]
  }
};

const studentStats = {
  name: "Yash Modi",
  attendance: 86,
  courseProgress: 62,
  placementReadiness: 71,
  assessmentsCompleted: 5,
  totalAssessments: 8,
  nextTask: "Complete Data Visualization Module",
  percentile: 68,
  academicOverview: {
    semester: "Semester 5",
    track: "Data Science",
    mentor: "Dr. Priya Nair",
    capstone: "In Progress"
  }
};

/* =====================================================
   ===================== HOOKS ==========================
   ===================================================== */

function useStudyAssistantChat() {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const sendMessage = text => {
    setLoading(true);
    setMessages(m => [...m, { role: "user", content: text }]);
    setInput("");
    setTimeout(() => {
      setMessages(m => [
        ...m,
        { role: "bot", content: "Structured mentor response." }
      ]);
      setLoading(false);
    }, 1200);
  };
  return { messages, input, setInput, loading, sendMessage };
}

/* --- Hoverable Styles --- */
function useHover() {
  const [hovered, setHovered] = React.useState(false);
  const onMouseEnter = () => setHovered(true);
  const onMouseLeave = () => setHovered(false);
  return { hovered, onMouseEnter, onMouseLeave };
}

/* =====================================================
   ===================== COMPONENTS =====================
   ===================================================== */

function KPI({ icon, title, value, hint, good, placement, loading }) {
  const { hovered, onMouseEnter, onMouseLeave } = useHover();
  return (
    <div
      style={{
        ...kpiCard,
        ...(good ? kpiGood : {}),
        ...(placement ? { borderLeft: "4px solid #0ea5e9" } : { borderLeft: "4px solid #6366f1" }),
        ...(hovered ? { boxShadow: "0 4px 16px rgba(80,60,180,0.08)", transform: "translateY(-2px) scale(1.02)", borderColor: "#a5b4fc" } : {}),
        transition: "box-shadow .18s, transform .18s, border-color .18s"
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      tabIndex={0}
      aria-label={title}
    >
      <div style={placement ? kpiIconPlacement : kpiIconAcademic}>{icon}</div>
      <div style={kpiTitle}>{title}</div>
      <div style={kpiValue}>{loading ? <div style={skeleton} /> : value}</div>
      {hint && <div style={kpiHint}>{hint}</div>}
    </div>
  );
}

function ProgressBar({ percent }) {
  const [width, setWidth] = React.useState(0);
  React.useEffect(() => {
    setTimeout(() => setWidth(percent), 80);
  }, [percent]);
  return (
    <>
      <div style={progressBg}>
        <div style={{ ...progressFill, width: `${width}%`, transition: "width .7s cubic-bezier(.4,0,.2,1)" }} />
      </div>
      <div style={progressText}>{percent}% completed</div>
    </>
  );
}

function Card({ title, icon, children, loading }) {
  const { hovered, onMouseEnter, onMouseLeave } = useHover();
  return (
    <div
      style={{
        ...card,
        ...(hovered ? { boxShadow: "0 4px 16px rgba(80,60,180,0.08)", transform: "translateY(-2px) scale(1.01)", borderColor: "#a5b4fc" } : {}),
        transition: "box-shadow .18s, transform .18s, border-color .18s"
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      tabIndex={0}
      aria-label={title}
    >
      <div style={cardHeader}>
        <span>{icon}</span>
        <span>{title}</span>
      </div>
      {loading ? <div style={skeleton} /> : children}
    </div>
  );
}

/* =====================================================
   ===================== MAIN ===========================
   ===================================================== */

export default function StudentDashboard() {
  const [showPlacement, setShowPlacement] = React.useState(false);
  const [closeHover, setCloseHover] = React.useState(false);
  const [lastUpdated, setLastUpdated] = React.useState(Date.now());
  const DATA = studentStats;
  const loading = useLoadingDemo();

  // Keyboard accessibility for modal close
  function handleModalKey(e) {
    if (e.key === "Escape") setShowPlacement(false);
  }

  // Avatar initials
  const initials = DATA.name.split(" ").map(w => w[0]).join("").toUpperCase();

  return (
    <div style={page}>
      {/* Hero Card */}
      <div style={heroCard}>
        <div style={heroText}>
          <h2 style={heroTitle}>Welcome, {DATA.name}</h2>
          <p style={heroSub}>Your academic and placement journey is on track. Review your progress and next steps below.</p>
          <span style={lastUpdatedStyle}>{formatUpdated(lastUpdated)}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={avatar} aria-label="User avatar">{initials}</div>
          <div style={heroBadge}><span style={badgeIcon}>🎯</span>Top {DATA.percentile}%</div>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={kpiGrid}>
        <KPI icon="🕒" title="Attendance" value={`${DATA.attendance}%`} hint="Placement eligible" good loading={loading} />
        <KPI icon="📘" title="Course Progress" value={`${DATA.courseProgress}%`} hint="Learning completion" loading={loading} />
        <KPI icon="🚀" title="Placement Readiness" value={`${DATA.placementReadiness}%`} hint="Readiness index" placement loading={loading} />
        <KPI icon="📝" title="Assessments" value={`${DATA.assessmentsCompleted}/${DATA.totalAssessments}`} hint="Completed" loading={loading} />
      </div>

      {/* Academic Overview Strip */}
      <div style={overviewStrip}>
        <div style={overviewItem}><span style={overviewLabel}>Semester:</span>{DATA.academicOverview.semester}</div>
        <div style={overviewItem}><span style={overviewLabel}>Track:</span>{DATA.academicOverview.track}</div>
        <div style={overviewItem}><span style={overviewLabel}>Mentor:</span>{DATA.academicOverview.mentor}</div>
        <div style={overviewItem}><span style={overviewLabel}>Capstone:</span>{DATA.academicOverview.capstone}</div>
      </div>

      {/* Main Grid */}
      <div style={mainGrid}>
        <Card title="Learning Progress" icon="📚" loading={loading}>
          <ProgressBar percent={DATA.courseProgress} />
          <div style={progressText}>Complete remaining modules to unlock advanced assessments.</div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 8 }}>Next step: <b>{DATA.nextTask}</b></div>
        </Card>
        <Card title="Placement Readiness" icon="💼" loading={loading}>
          <ProgressBar percent={DATA.placementReadiness} />
          <ul style={checklist}>
            <li style={checklistItem}><span aria-label="Resume uploaded" role="img" style={{ ...checkIcon, color: '#22c55e' }}>✔</span><span style={checklistText}>Resume uploaded</span></li>
            <li style={checklistItem}><span aria-label="Mock interview pending" role="img" style={{ ...warnIcon, color: '#f59e42' }}>⚠</span><span style={checklistText}>Mock interview pending</span></li>
          </ul>
        </Card>
      </div>

      {/* Motivation Banner */}
      <div style={infoBanner}>
        <span role="img" aria-label="bulb" style={{ marginRight: 8 }}>💡</span>
        Students who complete mock interviews get placed 32% faster. You’re very close — don’t stop now.
      </div>

      {/* Placement Readiness Placeholder Modal */}
      {showPlacement && (
        <div
          style={placementPlaceholderCard}
          tabIndex={-1}
          aria-modal="true"
          role="dialog"
          onKeyDown={handleModalKey}
        >
          <h3 style={{ fontWeight: 800, color: "#5b21b6", marginBottom: 10 }}>Placement Readiness Dashboard (Coming Soon)</h3>
          <div style={placeholderMetric}>Readiness Score</div>
          <div style={placeholderValue}>{placementReadinessState.readinessScore}%</div>
          <div style={placeholderMetric}>Skill Gaps</div>
          <div style={placeholderValue}>{placementReadinessState.skillGaps.join(", ")}</div>
          <div style={placeholderMetric}>Resume Strength</div>
          <div style={placeholderValue}>{placementReadinessState.resumeStrength}%</div>
          <div style={placeholderMetric}>Interview Preparedness</div>
          <div style={placeholderValue}>{placementReadinessState.interviewPreparedness.attempts} mock attempts, Weak areas: {placementReadinessState.interviewPreparedness.weakAreas.join(", ")}</div>
          <div style={placeholderNote}>A full analytics dashboard for placement readiness will be available soon. These metrics will help you and your mentors track your placement journey with confidence.</div>
          <button
            style={{ ...closeBtn, ...(closeHover ? { background: "#7c3aed", color: "#fff" } : {}), ...focusVisible }}
            onMouseEnter={() => setCloseHover(true)}
            onMouseLeave={() => setCloseHover(false)}
            onClick={() => setShowPlacement(false)}
            tabIndex={0}
            aria-label="Close placement readiness modal"
            onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setShowPlacement(false); }}
          >Close</button>
        </div>
      )}
    </div>
  );
}
