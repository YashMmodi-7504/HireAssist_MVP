import React from "react";

// --- Mock eligibility logic (API-ready) ---
function getEligibility(job) {
  // Example logic: eligible for open internships, conditional for under process, not eligible for closed
  if (job.applicationStatus === "Open" && job.placementStatus === "Open") return { signal: "Eligible", explanation: "You meet the basic criteria for this opportunity." };
  if (job.applicationStatus === "Open" && job.placementStatus === "Under Process") return { signal: "Conditionally Eligible", explanation: "Placement cell is reviewing your profile for this role." };
  return { signal: "Not Eligible", explanation: "This opportunity is not currently available for your profile." };
}

/* =====================================================
   APPLY JOBS / INTERNSHIPS – ENTERPRISE STYLE
   ===================================================== */

const JOBS = [
  {
    id: 1,
    title: "Data Analyst Intern",
    subtitle: "Analytics & Reporting",
    stipend: "₹10,000 / month",
    type: "Internship",
    mode: "Remote",
    placementStatus: "Under Process",
    applicationStatus: "Open",
    location: "Remote",
    skills: ["SQL", "Excel", "Power BI"],
    requirement: "Basic understanding of data analysis and dashboards"
  },
  {
    id: 2,
    title: "Python Developer",
    subtitle: "Backend Engineering",
    stipend: "₹5 – 7 LPA",
    type: "Full Time",
    mode: "Onsite",
    placementStatus: "Open",
    applicationStatus: "Open",
    location: "Bangalore",
    skills: ["Python", "APIs", "OOP"],
    requirement: "Hands-on Python projects required"
  },
  {
    id: 3,
    title: "Business Analyst",
    subtitle: "Consulting Support",
    stipend: "₹6 LPA",
    type: "Full Time",
    mode: "Hybrid",
    placementStatus: "Under Process",
    applicationStatus: "Closed",
    location: "Pune",
    skills: ["Excel", "Communication", "Documentation"],
    requirement: "Strong communication and presentation skills"
  },
  {
    id: 4,
    title: "AI / ML Trainee",
    subtitle: "Model Development",
    stipend: "₹15,000 / month",
    type: "Internship",
    mode: "Remote",
    placementStatus: "Open",
    applicationStatus: "Open",
    location: "Remote",
    skills: ["Python", "ML Basics", "Pandas"],
    requirement: "Completed AI & Data Foundations module"
  },
  {
    id: 5,
    title: "Associate Software Engineer",
    subtitle: "Enterprise Applications",
    stipend: "₹4.5 LPA",
    type: "Full Time",
    mode: "Onsite",
    placementStatus: "Under Process",
    applicationStatus: "Closed",
    location: "Hyderabad",
    skills: ["Java", "SQL", "Problem Solving"],
    requirement: "Strong logical and problem-solving skills"
  },
  {
    id: 6,
    title: "Power BI Developer",
    subtitle: "Business Intelligence",
    stipend: "₹6 – 8 LPA",
    type: "Full Time",
    mode: "Hybrid",
    placementStatus: "Open",
    applicationStatus: "Open",
    location: "Mumbai",
    skills: ["Power BI", "DAX", "SQL"],
    requirement: "Dashboard portfolio is mandatory"
  }
];

/* =====================================================
   COMPONENT
   ===================================================== */

export default function ApplyJobs() {
  return (
    <div style={page}>
      <h2 style={pageTitle}>Placement Opportunities</h2>
      <div style={pageSubtitle}>
        This portal lists placement opportunities mediated by the placement cell.<br />
        <span style={disclaimer}>Applications are reviewed by the placement cell before forwarding to recruiters.</span>
      </div>

      {JOBS.map(job => {
        const eligibility = getEligibility(job);
        const isClosed = job.applicationStatus === "Closed";
        const isUnderProcess = job.placementStatus === "Under Process";
        const isEligible = eligibility.signal === "Eligible";
        const isConditional = eligibility.signal === "Conditionally Eligible";
        return (
          <div key={job.id} style={{ ...jobCard, opacity: isClosed ? 0.7 : 1, background: isClosed ? "#f3f4f6" : "#fff" }}>
            {/* HEADER */}
            <div style={jobHeader}>
              <div>
                <div style={jobTitle}>{job.title}</div>
                <div style={jobSubtitle}>{job.subtitle}</div>
              </div>
              <div style={jobType}>{job.type}</div>
            </div>

            {/* EMPLOYMENT INFO */}
            <div style={metaRow}>
              <span style={metaLabel}>Compensation:</span>
              <span style={metaValue}>{job.stipend}</span>
              <span style={metaLabel}>Mode:</span>
              <span style={metaValue}>{job.mode}</span>
              <span style={metaLabel}>Location:</span>
              <span style={metaValue}>{job.location}</span>
            </div>

            {/* STATUS */}
            <div style={statusRow}>
              <span>
                <span style={statusLabel}>Placement Status:</span>
                <b style={{ color: isUnderProcess ? "#eab308" : "#2563eb" }}>{job.placementStatus}</b>
              </span>
              <span>
                <span style={statusLabel}>Application Status:</span>
                <b style={{ color: isClosed ? "#dc2626" : "#16a34a" }}>{job.applicationStatus}</b>
              </span>
            </div>

            {/* ELIGIBILITY SIGNAL */}
            <div style={eligibilityRow}>
              <span style={{ ...eligibilityBadge, background: isEligible ? "#e0f2fe" : isConditional ? "#fef9c3" : "#f3f4f6", color: isEligible ? "#2563eb" : isConditional ? "#b45309" : "#6b7280" }}>
                {eligibility.signal}
              </span>
              <span style={eligibilityText}>{eligibility.explanation}</span>
            </div>

            {/* SKILLS & REQUIREMENTS */}
            <div style={skillsRow}>
              <span style={skillsLabel}>Expected Proficiency:</span>
              {job.skills.map(skill => (
                <span key={skill} style={skillTag}>{skill}</span>
              ))}
            </div>
            <div style={requirementBox}>
              <div style={requirementTitle}>Screening Criteria</div>
              <div style={requirementText}>{job.requirement}</div>
            </div>

            {/* ACTIONS */}
            <div style={actionRow}>
              <button style={jdButton}>Download JD</button>
              {isClosed ? (
                <div style={closedText}>This role is closed for new applications. Please contact the placement cell for more information.</div>
              ) : (
                <>
                  <button
                    style={{ ...applyButton, opacity: isEligible ? 1 : 0.6, cursor: isEligible ? "pointer" : "not-allowed" }}
                    disabled={!isEligible}
                  >
                    Apply
                  </button>
                  <span style={actionHelper}>Your placement profile will be shared with the placement cell for review.</span>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* =====================================================
   STYLES
   ===================================================== */

const page = {
  padding: 32,
  maxWidth: 760,
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "#f3f4f6",
  minHeight: "100vh"
};

const pageTitle = {
  fontSize: 26,
  fontWeight: 800,
  marginBottom: 6,
  textAlign: "center"
};

const pageSubtitle = {
  fontSize: 15,
  color: "#334155",
  marginBottom: 18,
  textAlign: "center"
};
const disclaimer = {
  fontSize: 13,
  color: "#64748b",
  marginTop: 4,
  display: "block"
};

const jobCard = {
  background: "#fff",
  borderRadius: 16,
  border: "1.5px solid #e5e7eb",
  padding: "28px 32px 24px 32px",
  marginBottom: 32,
  maxWidth: 520,
  width: "100%",
  boxSizing: "border-box",
  boxShadow: "0 4px 24px 0 rgba(30,41,59,0.10)",
  marginLeft: "auto",
  marginRight: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch"
};

const jobHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  marginBottom: 10,
  gap: 16
};

const jobTitle = {
  fontSize: 20,
  fontWeight: 800,
  color: "#1e3a8a",
  marginBottom: 2,
  letterSpacing: -0.5
};

const jobSubtitle = {
  fontSize: 15,
  color: "#475569",
  fontWeight: 500
};

const jobType = {
  fontSize: 13,
  fontWeight: 700,
  padding: "4px 14px",
  borderRadius: 999,
  background: "#eef2ff",
  color: "#3730a3",
  boxShadow: "0 1px 4px rgba(55,48,163,0.08)"
};

const metaRow = {
  display: "flex",
  gap: 14,
  fontSize: 14,
  marginBottom: 8,
  flexWrap: "wrap"
};
const metaLabel = {
  fontWeight: 700,
  color: "#334155",
  marginRight: 2
};
const metaValue = {
  color: "#1e293b",
  marginRight: 16,
  fontWeight: 500
};

const statusRow = {
  display: "flex",
  gap: 18,
  fontSize: 14,
  marginBottom: 12,
  flexWrap: "wrap"
};
const statusLabel = {
  fontWeight: 700,
  color: "#334155",
  marginRight: 2
};
const eligibilityRow = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 12
};
const eligibilityBadge = {
  fontWeight: 800,
  fontSize: 13,
  borderRadius: 8,
  padding: "5px 16px",
  minWidth: 110,
  textAlign: "center",
  boxShadow: "0 1px 4px rgba(37,99,235,0.08)"
};
const eligibilityText = {
  fontSize: 13,
  color: "#64748b",
  fontWeight: 500
};

const skillsRow = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
  marginBottom: 10,
  minHeight: 32
};
const skillsLabel = {
  fontSize: 14,
  fontWeight: 800,
  minWidth: 54,
  color: "#1e293b",
  marginRight: 2
};
const skillTag = {
  background: "#e0e7ff",
  color: "#3730a3",
  padding: "6px 16px",
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 700,
  marginRight: 4,
  marginBottom: 4,
  border: "1px solid #c7d2fe",
  boxShadow: "0 1px 4px rgba(55,48,163,0.06)"
};

const requirementBox = {
  background: "#f9fafb",
  padding: "14px 18px",
  borderRadius: 8,
  marginBottom: 16,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  boxShadow: "0 1px 4px rgba(55,65,81,0.04)"
};
const requirementTitle = {
  fontSize: 14,
  fontWeight: 800,
  marginBottom: 4,
  color: "#1e293b"
};
const requirementText = {
  fontSize: 14,
  color: "#374151",
  fontWeight: 500
};

const actionRow = {
  display: "flex",
  gap: 18,
  alignItems: "center",
  marginTop: 10,
  justifyContent: "flex-end"
};
const jdButton = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "1px solid #2563eb",
  background: "#ffffff",
  color: "#2563eb",
  fontWeight: 700,
  cursor: "pointer",
  transition: "box-shadow .15s",
  boxShadow: "0 1px 4px rgba(37,99,235,0.08)"
};
const applyButton = {
  padding: "8px 22px",
  borderRadius: 8,
  border: "none",
  background: "#2563eb",
  color: "#ffffff",
  fontWeight: 800,
  cursor: "pointer",
  fontSize: 15,
  boxShadow: "0 1px 4px rgba(37,99,235,0.10)",
  transition: "box-shadow .15s"
};
const actionHelper = {
  fontSize: 13,
  color: "#64748b",
  marginLeft: 10,
  fontWeight: 500
};
const closedText = {
  fontSize: 13,
  color: "#dc2626",
  fontWeight: 700,
  marginLeft: 10
};
