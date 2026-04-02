import React from "react";

/* ================= UTILITIES ================= */

// Custom hover hook for interactive elements
function useHover() {
  const [hovered, setHovered] = React.useState(false);
  return {
    hovered,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false)
  };
}

// Animated progress hook
function useAnimatedProgress(target) {
  const [current, setCurrent] = React.useState(0);
  React.useEffect(() => {
    const timer = setTimeout(() => setCurrent(target), 100);
    return () => clearTimeout(timer);
  }, [target]);
  return current;
}

/* ================= MOCK ASSESSMENT DATA ================= */

const ASSESSMENTS = [
  {
    id: 1,
    title: "Python Fundamentals",
    difficulty: "Beginner",
    duration: "30 mins",
    score: 78,
    status: "completed",
    lockedReason: null
  },
  {
    id: 2,
    title: "Data Handling & Pandas",
    difficulty: "Intermediate",
    duration: "45 mins",
    score: 64,
    status: "completed",
    lockedReason: null
  },
  {
    id: 3,
    title: "SQL for Analytics",
    difficulty: "Intermediate",
    duration: "40 mins",
    score: null,
    status: "pending",
    lockedReason: null
  },
  {
    id: 4,
    title: "Data Visualization",
    difficulty: "Advanced",
    duration: "50 mins",
    score: null,
    status: "locked",
    lockedReason: "Complete previous assessments first"
  }
];

/* ================= MAIN COMPONENT ================= */

export default function Assessment() {
  const completed = ASSESSMENTS.filter(a => a.status === "completed").length;
  const total = ASSESSMENTS.length;
  const progress = Math.round((completed / total) * 100);
  const animatedProgress = useAnimatedProgress(progress);

  return (
    <div style={page}>
      {/* Header */}
      <div style={header}>
        <div>
          <h2 style={headerTitle}>Assessments</h2>
          <p style={headerSub}>
            Your assessment progress directly impacts your placement readiness.
            Complete pending assessments to unlock new opportunities.
          </p>
        </div>

        <div style={progressBadge}>
          {completed}/{total} Completed
        </div>
      </div>

      {/* Overall Progress */}
      <div style={progressCard}>
        <div style={progressTitle}>Assessment Completion</div>
        <div style={progressBg}>
          <div style={{ ...progressFill, width: `${animatedProgress}%` }} />
        </div>
        <div style={progressText}>
          {progress}% of assessments completed
        </div>
        <div style={progressHint}>
          This reflects your progress across all required assessments for your
          program.
        </div>
      </div>

      {/* Assessment List */}
      <div style={list}>
        {ASSESSMENTS.map(a => (
          <AssessmentCard key={a.id} data={a} />
        ))}
      </div>

      {/* Insight Banner */}
      <div style={insight}>
        <span role="img" aria-label="bulb" style={{ marginRight: 8 }}>💡</span>
        Students who attempt assessments within 48 hours of module completion
        score 24% higher on average. Timely action improves placement outcomes.
      </div>
    </div>
  );
}

/* ================= CARD ================= */

function AssessmentCard({ data }) {
  const isCompleted = data.status === "completed";
  const isPending = data.status === "pending";
  const isLocked = data.status === "locked";
  const cardHover = useHover();
  const primaryBtnHover = useHover();
  const secondaryBtnHover = useHover();

  return (
    <div 
      style={{
        ...card,
        ...(isCompleted ? completedCard : {}),
        ...(cardHover.hovered && !isLocked ? {
          boxShadow: "0 4px 16px rgba(80,60,180,0.08)",
          transform: "translateY(-2px)",
          borderColor: "#a5b4fc"
        } : {})
      }}
      {...cardHover}
    >
      <div style={cardTop}>
        <div style={{ flex: 1 }}>
          <h4 style={cardTitle}>{data.title}</h4>
          <div style={meta}>
            <span style={metaItem}>⏱ {data.duration}</span>
            <span style={metaSeparator}>·</span>
            <span style={metaItem}>🎯 {data.difficulty}</span>
          </div>
        </div>

        <StatusBadge status={data.status} />
      </div>

      {/* Score Display */}
      {isCompleted && (
        <div style={scoreRow}>
          <span style={scoreLabel}>Your Score</span>
          <div style={scoreDisplay}>
            <span style={scoreValue}>{data.score}</span>
            <span style={scoreUnit}>%</span>
          </div>
        </div>
      )}

      {/* Locked Reason */}
      {isLocked && data.lockedReason && (
        <div style={lockedInfo}>
          <span style={{ marginRight: 6 }}>🔒</span>
          {data.lockedReason}
        </div>
      )}

      {/* Actions */}
      <div style={actions}>
        {isCompleted && (
          <button 
            style={{
              ...secondaryBtn,
              ...(secondaryBtnHover.hovered ? {
                background: "#f5f3ff",
                borderColor: "#a5b4fc"
              } : {})
            }}
            {...secondaryBtnHover}
            tabIndex={0} 
            aria-label="View detailed analysis for this assessment"
          >
            View Analysis
          </button>
        )}
        {isPending && (
          <button 
            style={{
              ...primaryBtn,
              ...(primaryBtnHover.hovered ? {
                background: "#6d28d9",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(124,58,237,0.3)"
              } : {})
            }}
            {...primaryBtnHover}
            tabIndex={0} 
            aria-label="Start this assessment now"
          >
            Start Assessment
          </button>
        )}
        {isLocked && (
          <button 
            style={disabledBtn} 
            tabIndex={0} 
            aria-label="Assessment locked. Complete prerequisites first." 
            disabled
          >
            🔒 Locked
          </button>
        )}
      </div>
    </div>
  );
}

/* ================= STATUS ================= */

function StatusBadge({ status }) {
  const map = {
    completed: { text: "Completed", bg: "#ecfdf5", color: "#047857" },
    pending: { text: "Pending", bg: "#fffbeb", color: "#92400e" },
    locked: { text: "Locked", bg: "#f3f4f6", color: "#6b7280" }
  };

  const s = map[status];

  return (
    <span style={{
      padding: "6px 14px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 700,
      background: s.bg,
      color: s.color,
      minWidth: 80,
      textAlign: "center"
    }}>
      {s.text}
    </span>
  );
}

/* ================= STYLES ================= */

const page = {
  padding: 32,
  maxWidth: 1100,
  margin: "0 auto"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 32
};

const headerTitle = {
  fontSize: 26,
  fontWeight: 800,
  color: "#1e293b",
  margin: 0,
  letterSpacing: -0.5
};

const headerSub = {
  fontSize: 15,
  color: "#475569",
  marginTop: 10,
  fontWeight: 500,
  maxWidth: 420
};

const progressBadge = {
  background: "#f3f4f6",
  color: "#334155",
  padding: "10px 20px",
  borderRadius: 999,
  fontWeight: 700,
  border: "1px solid #e5e7eb",
  fontSize: 15
};

/* Progress */
const progressCard = {
  background: "#fff",
  borderRadius: 14,
  padding: 22,
  border: "1px solid #e5e7eb",
  marginBottom: 32,
  boxShadow: "0 1px 4px rgba(80,60,180,0.02)"
};

const progressTitle = {
  fontSize: 15,
  fontWeight: 700,
  marginBottom: 8,
  color: "#334155"
};

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

const progressText = {
  fontSize: 13,
  color: "#6b7280",
  marginTop: 6,
  fontWeight: 500
};

const progressHint = {
  fontSize: 13,
  color: "#64748b",
  marginTop: 8,
  lineHeight: 1.5
};

/* List */
const list = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
  gap: 22
};

/* Card */
const card = {
  background: "#fff",
  borderRadius: 16,
  padding: 20,
  border: "1px solid #e5e7eb",
  boxShadow: "0 1px 4px rgba(80,60,180,0.02)",
  display: "flex",
  flexDirection: "column",
  minHeight: 170,
  justifyContent: "space-between",
  transition: "box-shadow .18s, transform .18s, border-color .18s",
  cursor: "pointer"
};

const completedCard = {
  background: "#f0fdf4",
  border: "1px solid #bbf7d0"
};

const cardTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 12,
  marginBottom: 14
};

const cardTitle = {
  margin: 0,
  fontWeight: 700,
  fontSize: 17,
  color: "#1e293b",
  letterSpacing: -0.3
};

const meta = {
  fontSize: 12,
  color: "#6b7280",
  marginTop: 6,
  display: "flex",
  alignItems: "center",
  gap: 4
};

const metaItem = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4
};

const metaSeparator = {
  margin: "0 4px",
  color: "#d1d5db"
};

const scoreRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 14,
  padding: "12px 16px",
  background: "rgba(14,165,233,0.04)",
  borderRadius: 10,
  border: "1px solid rgba(14,165,233,0.1)"
};

const scoreLabel = {
  fontSize: 13,
  color: "#64748b",
  fontWeight: 600
};

const scoreDisplay = {
  display: "flex",
  alignItems: "baseline",
  gap: 2
};

const scoreValue = {
  fontWeight: 800,
  fontSize: 28,
  color: "#0ea5e9",
  lineHeight: 1
};

const scoreUnit = {
  fontWeight: 700,
  fontSize: 16,
  color: "#0ea5e9",
  opacity: 0.7
};

const lockedInfo = {
  fontSize: 13,
  color: "#64748b",
  background: "#f8fafc",
  padding: "10px 14px",
  borderRadius: 8,
  marginBottom: 12,
  border: "1px solid #e5e7eb",
  display: "flex",
  alignItems: "center"
};

const actions = {
  display: "flex",
  gap: 10,
  marginTop: 8
};

/* Buttons */
const primaryBtn = {
  background: "#7c3aed",
  color: "#fff",
  padding: "10px 20px",
  borderRadius: 8,
  border: "none",
  fontWeight: 700,
  cursor: "pointer",
  fontSize: 15,
  transition: "all .15s cubic-bezier(.4,0,.2,1)",
  flex: 1
};

const secondaryBtn = {
  background: "#fff",
  color: "#7c3aed",
  padding: "10px 20px",
  borderRadius: 8,
  border: "1px solid #ddd6fe",
  fontWeight: 700,
  cursor: "pointer",
  fontSize: 15,
  transition: "all .15s cubic-bezier(.4,0,.2,1)",
  flex: 1
};

const disabledBtn = {
  background: "#f3f4f6",
  color: "#9ca3af",
  padding: "10px 20px",
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  fontWeight: 700,
  cursor: "not-allowed",
  fontSize: 15,
  opacity: 0.7,
  flex: 1
};

/* Insight */
const insight = {
  marginTop: 36,
  background: "#f0fdf4",
  padding: 20,
  borderRadius: 14,
  fontWeight: 600,
  color: "#047857",
  borderLeft: "6px solid #10b981",
  fontSize: 15,
  lineHeight: 1.6
};

