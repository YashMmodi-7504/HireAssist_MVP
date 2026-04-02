import React from "react";
import { STUDENT_COLORS } from "../studentTheme";

/* ================= ICONS ================= */

const Icon = ({ children }) => (
  <span style={{ fontSize: 16, width: 22, display: "inline-block" }}>
    {children}
  </span>
);

/* ================= SIDEBAR ================= */

export default function StudentSidebar({ active, onSelect }) {
  const menu = [
    { key: "dashboard", label: "Dashboard", icon: "🏠" },
    { key: "assessment", label: "Assessments", icon: "📝" },
    { key: "attendance", label: "Attendance", icon: "📊" },
    { key: "study", label: "Study Material", icon: "📘" },
    { key: "capstone", label: "Capstone Project", icon: "🧠" },
    { key: "readiness", label: "Placement Readiness", icon: "🚀" },
    { key: "placement_form", label: "Placement Form", icon: "📄" },
    { key: "apply_jobs", label: "Apply Jobs", icon: "💼" },
    { key: "certificate", label: "Certificates", icon: "🎓" },
    { key: "alumni", label: "Alumni Network", icon: "🤝" },
    { key: "raise_ticket", label: "Raise a Query", icon: "🎧" },
    // AI Chatbot below Raise a Query
    { key: "ai_chatbot", label: "AI Chatbot", icon: "🤖" }
  ];

  return (
    <div style={styles.sidebar}>
      {menu.map(item => {
        const isActive = active === item.key;

        return (
          <div
            key={item.key}
            onClick={() => onSelect(item.key)}
            style={{
              ...styles.item,
              ...(isActive ? styles.activeItem : {})
            }}
          >
            <Icon>{item.icon}</Icon>
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  sidebar: {
    height: "100%",
    padding: "16px 10px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    color: "#fff"
  },

  item: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 14px",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    transition: "background 0.2s"
  },

  activeItem: {
    background: "#ffffff",
    color: STUDENT_COLORS.sidebar
  }
};
