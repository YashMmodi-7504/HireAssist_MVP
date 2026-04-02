import React, { useState } from "react";

/* =====================================================
   CERTIFICATE OPPORTUNITIES (PLACEMENT-STYLE)
===================================================== */

const CERTIFICATE_OPPORTUNITIES = [
  {
    id: 1,
    title: "AI & Data Foundations",
    issuer: "Edunet Foundation",
    status: "Issued",
    credentialId: "EDU-AI-2024-0912",
    message: "Credential issued and eligible for placement verification."
  },
  {
    id: 2,
    title: "Python for Data Analysis",
    issuer: "Edunet Foundation",
    status: "In Progress",
    credentialId: null,
    message: "Complete remaining modules to unlock this credential."
  },
  {
    id: 3,
    title: "Placement Readiness Program",
    issuer: "Edunet Foundation",
    status: "Not Eligible",
    credentialId: null,
    message: "Eligibility criteria not met yet. Continue coursework."
  }
];

/* =====================================================
   STATUS CONFIG (PLACEMENT LANGUAGE)
===================================================== */

const STATUS_CONFIG = {
  "Issued": {
    chip: { color: "#16a34a", bg: "#ecfdf5" },
    eligibility: "Placement Eligible",
    primaryCta: "Download Credential",
    secondaryCta: "Verify Credential",
    locked: false
  },
  "In Progress": {
    chip: { color: "#b45309", bg: "#fffbeb" },
    eligibility: "Eligibility In Progress",
    primaryCta: "Continue Program",
    secondaryCta: null,
    locked: false
  },
  "Not Eligible": {
    chip: { color: "#6b7280", bg: "#f3f4f6" },
    eligibility: "Not Eligible Yet",
    primaryCta: "View Eligibility Criteria",
    secondaryCta: null,
    locked: true
  }
};

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function CertificateOpportunities() {
  const [activeCard, setActiveCard] = useState(null);

  return (
    <div style={page}>
      <h2 style={pageTitle}>Credential Opportunities</h2>
      <p style={pageSub}>
        Institution-verified credentials aligned with placement eligibility and recruiter validation.
      </p>

      <div style={list}>
        {CERTIFICATE_OPPORTUNITIES.map(cert => (
          <CertificateCard
            key={cert.id}
            cert={cert}
            active={activeCard === cert.id}
            onHover={() => setActiveCard(cert.id)}
          />
        ))}
      </div>
    </div>
  );
}

/* =====================================================
   CARD COMPONENT
===================================================== */

function CertificateCard({ cert, active, onHover }) {
  const config = STATUS_CONFIG[cert.status];
  const isLocked = config.locked;

  return (
    <div
      style={{
        ...card,
        ...(active ? cardActive : {}),
        ...(isLocked ? cardLocked : {})
      }}
      onMouseEnter={!isLocked ? onHover : undefined}
    >
      {/* LEFT */}
      <div style={left}>
        <div style={title}>{cert.title}</div>
        <div style={issuer}>{cert.issuer}</div>
      </div>

      {/* CENTER */}
      <div style={center}>
        <span style={statusChip(config.chip.color, config.chip.bg)}>
          {cert.status}
        </span>

        <div style={message}>{cert.message}</div>

        <div style={eligibility}>{config.eligibility}</div>

        {cert.credentialId && (
          <div style={credential}>
            Credential ID: <span style={{ color: "#0e7490" }}>{cert.credentialId}</span>
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div style={actions}>
        <button
          style={primaryBtn(isLocked)}
          disabled={isLocked}
        >
          {config.primaryCta}
        </button>

        {config.secondaryCta && (
          <button style={secondaryBtn}>
            {config.secondaryCta}
          </button>
        )}
      </div>
    </div>
  );
}

/* =====================================================
   STYLES (PLACEMENT-ALIGNED)
===================================================== */

const page = {
  maxWidth: 1040,
  margin: "0 auto",
  padding: "40px",
  background: "#f3f4f6",
  minHeight: "100vh"
};

const pageTitle = {
  fontSize: 28,
  fontWeight: 900,
  color: "#1e293b",
  marginBottom: 6
};

const pageSub = {
  fontSize: 16,
  color: "#475569",
  marginBottom: 32,
  fontWeight: 600
};

const list = {
  display: "flex",
  flexDirection: "column",
  gap: 24
};

const card = {
  display: "flex",
  alignItems: "center",
  background: "#ffffff",
  borderRadius: 16,
  border: "1.5px solid #e5e7eb",
  padding: "28px 32px",
  transition: "border-color .18s, box-shadow .18s, transform .18s"
};

const cardActive = {
  borderColor: "#6366f1",
  boxShadow: "0 8px 28px rgba(99,102,241,0.12)",
  transform: "translateY(-2px)"
};

const cardLocked = {
  background: "#f3f4f6",
  opacity: 0.65,
  cursor: "not-allowed"
};

const left = {
  flex: 2
};

const title = {
  fontSize: 22,
  fontWeight: 900,
  color: "#1e293b"
};

const issuer = {
  fontSize: 15,
  fontWeight: 700,
  color: "#64748b",
  marginTop: 4
};

const center = {
  flex: 2.2,
  paddingLeft: 32,
  display: "flex",
  flexDirection: "column",
  gap: 6
};

const statusChip = (color, bg) => ({
  padding: "6px 18px",
  borderRadius: 999,
  fontWeight: 900,
  fontSize: 14,
  color,
  background: bg,
  border: `2px solid ${color}`,
  width: "fit-content"
});

const message = {
  fontSize: 15,
  fontWeight: 600,
  color: "#334155"
};

const eligibility = {
  fontSize: 14,
  fontWeight: 800,
  color: "#0e7490"
};

const credential = {
  fontSize: 13,
  fontWeight: 700,
  color: "#64748b"
};

const actions = {
  flex: 1.2,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
  gap: 12
};

const primaryBtn = locked => ({
  padding: "10px 26px",
  borderRadius: 8,
  border: "none",
  fontSize: 16,
  fontWeight: 900,
  cursor: locked ? "not-allowed" : "pointer",
  background: locked ? "#e5e7eb" : "#2563eb",
  color: locked ? "#6b7280" : "#ffffff"
});

const secondaryBtn = {
  padding: "8px 22px",
  borderRadius: 8,
  border: "2px solid #2563eb",
  background: "#ffffff",
  color: "#2563eb",
  fontWeight: 900,
  fontSize: 15,
  cursor: "pointer"
};
