import React from "react";
import { COLORS, FONTS } from "../theme";

/* =====================================================
   FIXED SIDEBAR – STUDENT / MULTI ROLE
===================================================== */

export default function Sidebar({ role = "default", active = "/" }) {
  const menu = [
    { key: "dashboard", label: "Dashboard", path: "/", icon: DashboardIcon },
    { key: "analytics", label: "Analytics", path: "/analytics", icon: ChartIcon },
    { key: "assessments", label: "Assessments", path: "/assessments", icon: ClipboardIcon },
    // Place AI Chatbot below 'Raise the Query' (assessments)
    { key: "ai-chatbot", label: "AI Chatbot", path: "/student/ai-chatbot", icon: AIChatIcon },
    { key: "study", label: "Study Material", path: "/study", icon: BookIcon },
    { key: "capstone", label: "Capstone Project", path: "/capstone", icon: CapstoneIcon },
    { key: "reports", label: "Reports", path: "/reports", icon: ReportIcon },
    { key: "settings", label: "Settings", path: "/settings", icon: GearIcon }
  ];
// AI Chatbot Icon
const AIChatIcon = () => (
  <IconBase>
    <circle cx="12" cy="12" r="8" stroke="#7c3aed" strokeWidth="2" fill="#ede9fe" />
    <ellipse cx="12" cy="12" rx="4" ry="2.5" fill="#7c3aed" />
    <circle cx="9.5" cy="11.5" r="1" fill="#fff" />
    <circle cx="14.5" cy="11.5" r="1" fill="#fff" />
  </IconBase>
);

  return (
    <aside style={styles.sidebar} aria-label="Main navigation">
      <div style={styles.brand}>
        <div style={styles.brandTitle}>HireAssist</div>
      </div>

      <nav style={styles.nav}>
        {menu.map(item => {
          const isActive = active === item.path;
          return (
            <a
              key={item.key}
              href={item.path}
              style={{ ...styles.link, ...(isActive ? styles.linkActive : {}) }}
            >
              <span style={styles.icon}><item.icon /></span>
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      <div style={styles.footer}>
        <a href="/logout" style={styles.logout}>Sign out</a>
      </div>
    </aside>
  );
}

/* ================= ICON SYSTEM ================= */

function IconBase({ children }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      {children}
    </svg>
  );
}

const DashboardIcon = () => (
  <IconBase>
    <rect x="3" y="3" width="8" height="8" stroke="currentColor" />
    <rect x="13" y="3" width="8" height="8" stroke="currentColor" />
    <rect x="3" y="13" width="8" height="8" stroke="currentColor" />
    <rect x="13" y="13" width="8" height="8" stroke="currentColor" />
  </IconBase>
);

const ChartIcon = () => (
  <IconBase>
    <path d="M4 17V9l4 4 4-6 4 8 4-10" stroke="currentColor" strokeWidth="1.5" />
  </IconBase>
);

const ClipboardIcon = () => (
  <IconBase>
    <rect x="6" y="4" width="12" height="16" stroke="currentColor" />
  </IconBase>
);

const BookIcon = () => (
  <IconBase>
    <path d="M4 4h12a2 2 0 0 1 2 2v14H6a2 2 0 0 0-2 2V4z" stroke="currentColor" />
  </IconBase>
);

/* 🎓 CAPSTONE ICON */
const CapstoneIcon = () => (
  <IconBase>
    <path d="M3 9l9-5 9 5-9 5-9-5z" stroke="currentColor" strokeWidth="1.3" />
    <path d="M12 14v7" stroke="currentColor" strokeWidth="1.3" />
  </IconBase>
);

const ReportIcon = () => (
  <IconBase>
    <rect x="4" y="3" width="16" height="18" stroke="currentColor" />
    <path d="M8 7h8M8 11h8M8 15h6" stroke="currentColor" />
  </IconBase>
);

const GearIcon = () => (
  <IconBase>
    <circle cx="12" cy="12" r="3" stroke="currentColor" />
  </IconBase>
);

/* ================= STYLES ================= */

const styles = {
  sidebar: {
    position: "fixed",          // 🔒 FIXED
    top: 0,
    left: 0,
    width: 240,
    height: "100vh",
    background: COLORS.sidebar || "#155a8a",
    color: "#fff",
    padding: "20px 18px",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    zIndex: 100
  },
  brand: { marginBottom: 20 },
  brandTitle: {
    fontFamily: FONTS.ui,
    fontSize: 18,
    fontWeight: 800
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    flex: 1
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 12px",
    borderRadius: 8,
    textDecoration: "none",
    color: "#fff",
    fontSize: 14
  },
  linkActive: {
    background: "#ffffff",
    color: COLORS.sidebar,
    fontWeight: 700
  },
  icon: { display: "inline-flex" },
  footer: { marginTop: 12 },
  logout: {
    color: "#fff",
    fontSize: 13,
    textDecoration: "none",
    opacity: 0.9
  }
};
