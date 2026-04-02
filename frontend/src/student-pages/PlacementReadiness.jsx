// Internal box hover for Signal Matrix only
function SignalMatrixItem({ item }) {
  const [hovered, setHovered] = useState(false);
  return (
    <li
      style={{
        ...signalItem(item.status),
        ...(hovered ? {
          boxShadow: "0 4px 16px rgba(80,60,180,0.08)",
          borderColor: "#a5b4fc",
          transform: "translateY(-2px) scale(1.01)",
          transition: "box-shadow .18s, transform .18s, border-color .18s"
        } : {})
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      tabIndex={0}
      aria-label={item.label}
    >
      <span style={signalLabel}>{item.label}</span>
      <span style={signalStatus(item.status)}>{item.status}</span>
      <div style={signalExplain}>{item.explanation}</div>
    </li>
  );
}
import React, { useState } from "react";

// =============== MOCK DATA (API-READY, SIGNAL-BASED) ===============
const readinessSignals = {
  eligibility: {
    status: "Conditionally Eligible",
    explanation: "Based on current academic, skill, and evaluation signals, you are conditionally eligible for placement. Some requirements remain unmet.",
    riskFlags: [
      "Capstone not evaluated",
      "SQL depth below requirement"
    ]
  },
  signals: [
    {
      category: "Academics",
      items: [
        { label: "CGPA meets minimum", status: "Strong", explanation: "Academic record meets eligibility threshold." },
        { label: "No active backlogs", status: "Strong", explanation: "No current academic backlogs." }
      ]
    },
    {
      category: "Technical Skills",
      items: [
        { label: "SQL", status: "Needs Attention", explanation: "Assessment indicates gaps in advanced SQL topics." },
        { label: "Python", status: "Strong", explanation: "Validated via assessments and project work." },
        { label: "Data Structures & Algorithms", status: "Blocker", explanation: "Not yet validated by assessment." }
      ]
    },
    {
      category: "Capstone & Projects",
      items: [
        { label: "Capstone submitted", status: "Strong", explanation: "Submission received." },
        { label: "Capstone evaluated", status: "Needs Attention", explanation: "Awaiting faculty evaluation." },
        { label: "Industry alignment", status: "Strong", explanation: "Project scope matches industry requirements." },
        { label: "Team contribution clarity", status: "Strong", explanation: "Individual roles documented." },
        { label: "Project complexity", status: "Strong", explanation: "Complexity level meets expectations." }
      ]
    },
    {
      category: "Resume Quality",
      items: [
        { label: "Structure", status: "Strong", explanation: "Resume is structurally sound." },
        { label: "Content alignment", status: "Needs Attention", explanation: "Project descriptions need more role clarity." },
        { label: "Role alignment", status: "Needs Attention", explanation: "Resume content partially matches Data Analyst profile." }
      ]
    },
    {
      category: "Interview Preparedness",
      items: [
        { label: "Mock interviews completed", status: "Strong", explanation: "2+ mock interviews attempted." },
        { label: "Technical patterns", status: "Needs Attention", explanation: "SQL joins remain a weak area." },
        { label: "Behavioral patterns", status: "Needs Attention", explanation: "STAR stories need more practice." }
      ]
    },
    {
      category: "Professional Readiness",
      items: [
        { label: "Communication", status: "Strong", explanation: "Assessed via group project and mock interview." },
        { label: "Punctuality", status: "Strong", explanation: "No missed deadlines in last 6 months." }
      ]
    }
  ],
  capstone: {
    submitted: true,
    evaluated: false,
    industryAligned: true,
    teamContribution: "Documented",
    complexity: "Meets expectations"
  },
  skillCoverage: [
    { skill: "Python", evidence: ["Assessment", "Capstone Project"] },
    { skill: "SQL", evidence: ["Assessment"] },
    { skill: "Machine Learning", evidence: ["Capstone Project"] },
    { skill: "Data Visualization", evidence: ["Lab Work"] },
    { skill: "Statistics", evidence: ["Assessment"] },
    { skill: "Data Structures & Algorithms", evidence: [] }
  ],
  resume: {
    validation: "Needs revision",
    feedback: [
      "Project descriptions lack role clarity",
      "Summary section too generic",
      "Skills section missing evidence of use"
    ],
    roleAlignment: "Partially aligned to Data Analyst"
  },
  interview: {
    attempts: 2,
    recurringWeaknesses: [
      { type: "Technical", pattern: "SQL joins" },
      { type: "Behavioral", pattern: "STAR story structure" }
    ],
    nextSteps: [
      "Review SQL join types and practice queries",
      "Prepare concise STAR stories for behavioral questions"
    ]
  },
  nextSteps: [
    { action: "Complete DSA assessment", section: "Technical Skills" },
    { action: "Capstone evaluation by faculty", section: "Capstone & Projects" },
    { action: "Revise resume for role clarity", section: "Resume & Profile Validation" },
    { action: "Practice SQL joins", section: "Interview Readiness Signals" },
    { action: "STAR story behavioral prep", section: "Interview Readiness Signals" }
  ]
};

export default function PlacementReadinessDashboard() {
  const [data] = useState(readinessSignals);

  // Remove section-level hover effect logic
  return (
    <div style={page}>
      <h2 style={header}>Placement Readiness Intelligence Dashboard</h2>

      {/* 1️⃣ PLACEMENT ELIGIBILITY SNAPSHOT */}
      <section
        style={card}
        tabIndex={0}
        role="region"
      >
        <h3 style={sectionTitle}>Placement Eligibility Snapshot</h3>
        <div style={eligibilityRow}>
          <div style={eligibilityStatus(data.eligibility.status)}>{data.eligibility.status}</div>
          <div style={eligibilityExplain}>{data.eligibility.explanation}</div>
        </div>
        {data.eligibility.riskFlags.length > 0 && (
          <ul style={riskFlagList}>
            {data.eligibility.riskFlags.map((flag, i) => (
              <li key={i} style={riskFlagItem}>{flag}</li>
            ))}
          </ul>
        )}
      </section>

      {/* 2️⃣ READINESS SIGNAL MATRIX */}
      <section
        style={card}
        tabIndex={0}
        role="region"
      >
        <h3 style={sectionTitle}>Readiness Signal Matrix</h3>
        <div style={signalMatrix}>
          {data.signals.map((cat, i) => (
            <div key={i} style={signalCol}>
              <div style={signalCat}>{cat.category}</div>
              <ul style={signalList}>
                {cat.items.map((item, j) => (
                  <SignalMatrixItem key={j} item={item} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 3️⃣ CAPSTONE & PROJECT VALIDATION PANEL */}
      <section
        style={card}
        tabIndex={0}
        role="region"
      >
        <h3 style={sectionTitle}>Capstone & Project Validation</h3>
        <div style={capstonePanel}>
          <div style={capstoneRow}><span style={capstoneLabel}>Submitted:</span> <span>{data.capstone.submitted ? "Yes" : "No"}</span></div>
          <div style={capstoneRow}><span style={capstoneLabel}>Evaluated:</span> <span>{data.capstone.evaluated ? "Yes" : "No"}</span></div>
          <div style={capstoneRow}><span style={capstoneLabel}>Industry-aligned:</span> <span>{data.capstone.industryAligned ? "Yes" : "No"}</span></div>
          <div style={capstoneRow}><span style={capstoneLabel}>Team contribution:</span> <span>{data.capstone.teamContribution}</span></div>
          <div style={capstoneRow}><span style={capstoneLabel}>Project complexity:</span> <span>{data.capstone.complexity}</span></div>
        </div>
      </section>

      {/* 4️⃣ SKILL COVERAGE MAP */}
      <section
        style={card}
        tabIndex={0}
        role="region"
      >
        <h3 style={sectionTitle}>Skill Coverage & Validation</h3>
        <div style={skillMapRow}>
          <div style={skillMapCol}>
            <div style={skillsLabel}>Target Role Requirements</div>
            <ul style={skillsList}>
              {data.skillCoverage.map((s, i) => (
                <li key={i} style={skillsItem}>{s.skill}</li>
              ))}
            </ul>
          </div>
          <div style={skillMapCol}>
            <div style={skillsLabel}>Validated by Evidence</div>
            <ul style={skillsList}>
              {data.skillCoverage.filter(s => s.evidence.length > 0).map((s, i) => (
                <li key={i} style={{...skillsItem, ...evidenceItem}}>
                  <span>{s.skill}</span>
                  <span style={evidenceTag} title={s.evidence.join(', ')}>
                    {s.evidence.map((ev, j) => (
                      <span key={j} style={evidencePill}>{ev}</span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div style={skillMapCol}>
            <div style={skillsLabel}>Skills Needing Validation</div>
            <ul style={skillsList}>
              {data.skillCoverage.filter(s => s.evidence.length === 0).length === 0 ? (
                <li style={skillsItem}>All required skills validated</li>
              ) : (
                data.skillCoverage.filter(s => s.evidence.length === 0).map((s, i) => (
                  <li key={i} style={gapItem}>{s.skill} <span style={evidenceTag}><span style={evidencePill}>Not yet validated</span></span></li>
                ))
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* 5️⃣ RESUME & PROFILE VALIDATION */}
      <section
        style={card}
        tabIndex={0}
        role="region"
      >
        <h3 style={sectionTitle}>Resume & Profile Validation</h3>
        <div style={resumePanel}>
          <div style={resumeRow}><span style={resumeLabel}>Validation Status:</span> <span style={resumeStatus(data.resume.validation)}>{data.resume.validation}</span></div>
          <div style={resumeRow}><span style={resumeLabel}>Role Alignment:</span> <span>{data.resume.roleAlignment}</span></div>
          <div style={resumeLabel}>Feedback Themes:</div>
          <ul style={resumeFeedbackList}>
            {data.resume.feedback.map((f, i) => (
              <li key={i} style={resumeFeedbackItem}>{f}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6️⃣ INTERVIEW READINESS SIGNALS */}
      <section
        style={card}
        tabIndex={0}
        role="region"
      >
        <h3 style={sectionTitle}>Interview Readiness Signals</h3>
        <div style={interviewPanel}>
          <div style={interviewRow}><span style={interviewLabel}>Mock Attempts:</span> <span>{data.interview.attempts}</span></div>
          <div style={interviewLabel}>Recurring Weak Patterns:</div>
          <ul style={interviewList}>
            {data.interview.recurringWeaknesses.map((w, i) => (
              <li key={i} style={interviewItem}><span style={interviewType(w.type)}>{w.type}</span> — {w.pattern}</li>
            ))}
          </ul>
          <div style={interviewLabel}>Recommended Next Steps:</div>
          <ul style={interviewList}>
            {data.interview.nextSteps.map((n, i) => (
              <li key={i} style={interviewItem}>{n}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7️⃣ ACTIONABLE NEXT STEPS */}
      <section
        style={card}
        tabIndex={0}
        role="region"
      >
        <h3 style={sectionTitle}>Actionable Next Steps</h3>
        <ol style={nextStepsList}>
          {data.nextSteps.map((step, i) => (
            <li key={i} style={nextStepItem}><span style={nextStepAction}>{step.action}</span> <span style={nextStepSection}>({step.section})</span></li>
          ))}
        </ol>
      </section>
    </div>
  );
}

// =============== STYLES ===============
const page = { maxWidth: 1000, margin: "0 auto", padding: 36, background: "#f8fafc" };
const header = { fontSize: 28, fontWeight: 900, color: "#312e81", marginBottom: 32, letterSpacing: -0.5 };
const card = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 18, padding: 32, marginBottom: 32, boxShadow: "0 2px 8px 0 rgba(30,41,59,0.04)" };
const sectionTitle = { marginBottom: 18, fontWeight: 800, fontSize: 19, color: "#1e293b", letterSpacing: -0.2 };
const eligibilityRow = { display: "flex", alignItems: "center", gap: 28, marginBottom: 10 };
const eligibilityStatus = status => ({ fontWeight: 800, fontSize: 16, borderRadius: 8, padding: "6px 22px", background: status === "Eligible" ? "#e0f2fe" : status === "Conditionally Eligible" ? "#fef9c3" : "#fee2e2", color: status === "Eligible" ? "#0369a1" : status === "Conditionally Eligible" ? "#b45309" : "#b91c1c", border: `1.5px solid ${status === "Eligible" ? "#38bdf8" : status === "Conditionally Eligible" ? "#fde68a" : "#fecaca"}` });
const eligibilityExplain = { color: "#334155", fontSize: 15, fontWeight: 500, maxWidth: 600 };
const riskFlagList = { margin: 0, padding: "0 0 0 18px", marginTop: 8 };
const riskFlagItem = { color: "#b91c1c", fontSize: 15, fontWeight: 700 };
const signalMatrix = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: 28, marginTop: 8 };
const signalCol = { background: "#f9fafb", borderRadius: 12, padding: 18, border: "1px solid #e5e7eb" };
const signalCat = { fontWeight: 700, color: "#312e81", fontSize: 15, marginBottom: 8, letterSpacing: -0.1 };
const signalList = { margin: 0, padding: 0, listStyle: "none" };
const signalItem = status => ({ marginBottom: 12, background: status === "Strong" ? "#e0f2fe" : status === "Needs Attention" ? "#fef9c3" : "#fee2e2", borderRadius: 8, padding: "10px 14px", border: `1.5px solid ${status === "Strong" ? "#38bdf8" : status === "Needs Attention" ? "#fde68a" : "#fecaca"}`, display: "flex", flexDirection: "column", gap: 2 });
const signalLabel = { fontWeight: 700, color: "#1e293b", fontSize: 15 };
const signalStatus = status => ({ fontWeight: 700, color: status === "Strong" ? "#0369a1" : status === "Needs Attention" ? "#b45309" : "#b91c1c", fontSize: 13, marginTop: 2 });
const signalExplain = { color: "#334155", fontSize: 13, marginTop: 2 };
const capstonePanel = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 18, marginTop: 8 };
const capstoneRow = { display: "flex", alignItems: "center", gap: 10, fontSize: 15, marginBottom: 4 };
const capstoneLabel = { fontWeight: 700, color: "#312e81", minWidth: 120 };
const skillMapRow = { display: "flex", gap: 32, marginTop: 8 };
const skillMapCol = { flex: 1 };
const skillsLabel = { fontWeight: 800, color: "#312e81", marginBottom: 8, fontSize: 15, letterSpacing: -0.1 };
const skillsList = { margin: 0, padding: "0 0 0 18px" };
const skillsItem = { color: "#334155", fontSize: 15, display: "flex", alignItems: "center", gap: 6, padding: "2px 0" };
const evidenceItem = { background: "#f1f5f9", borderRadius: 8, padding: "2px 8px", margin: "2px 0" };
const gapItem = { color: "#b91c1c", fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 6 };
const evidenceTag = { display: "flex", gap: 4, marginLeft: 8 };
const evidencePill = { background: "#e0e7ff", color: "#3730a3", borderRadius: 6, padding: "2px 8px", fontSize: 12, fontWeight: 700, marginRight: 2, boxShadow: "0 1px 2px rgba(60,60,120,0.04)" };
const resumePanel = { marginTop: 8 };
const resumeRow = { display: "flex", alignItems: "center", gap: 10, fontSize: 15, marginBottom: 4 };
const resumeLabel = { fontWeight: 700, color: "#312e81", minWidth: 120 };
const resumeStatus = status => ({ fontWeight: 700, color: status === "Structurally sound" ? "#0369a1" : status === "Content aligned" ? "#b45309" : "#b91c1c", fontSize: 15 });
const resumeFeedbackList = { margin: 0, padding: "0 0 0 18px", marginTop: 2 };
const resumeFeedbackItem = { color: "#334155", fontSize: 15 };
const interviewPanel = { marginTop: 8 };
const interviewRow = { display: "flex", alignItems: "center", gap: 10, fontSize: 15, marginBottom: 4 };
const interviewLabel = { fontWeight: 700, color: "#312e81", minWidth: 120 };
const interviewList = { margin: 0, padding: "0 0 0 18px", marginTop: 2 };
const interviewItem = { color: "#334155", fontSize: 15 };
const interviewType = type => ({ fontWeight: 700, color: type === "Technical" ? "#0e7490" : "#a16207", fontSize: 13, marginRight: 6 });
const nextStepsList = { margin: 0, padding: "0 0 0 22px", marginTop: 2 };
const nextStepItem = { color: "#334155", fontSize: 15, marginBottom: 6 };
const nextStepAction = { fontWeight: 700, color: "#1e293b" };
const nextStepSection = { color: "#7c3aed", fontWeight: 700, fontSize: 13, marginLeft: 8 };
