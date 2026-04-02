// TopBar.jsx - Enterprise LMS header with dynamic user identity

import React from "react";
import { getUserName, clearSession } from "../utils/session";

export default function TopBar({ onLogout }) {
  const name = getUserName();
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  function handleLogout() {
    clearSession();
    if (onLogout) onLogout();
  }

  return (
    <header style={styles.header}>
      <div style={styles.left}>HireAssist</div>
      <div style={styles.right}>
        <div style={styles.userWrap} tabIndex={0} aria-label={`Logged in as ${name}`}>
          <span style={styles.avatar} aria-label={`Avatar for ${name}`}>{initial}</span>
          <span style={styles.name}>{name}</span>
          <div style={styles.dropdownWrap}>
            <button style={styles.dropdownBtn} aria-label="Profile options" tabIndex={0}>
              ▼
            </button>
            <div style={styles.dropdownMenu}>
              <button style={styles.menuItem} onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    width: "100%",
    height: 64,
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    fontFamily: 'Segoe UI, Arial, sans-serif',
    fontWeight: 600,
    fontSize: 17,
    zIndex: 100
  },
  left: {
    fontWeight: 800,
    fontSize: 22,
    color: "#1f6fb2"
  },
  right: {
    display: "flex",
    alignItems: "center"
  },
  userWrap: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    outline: "none",
    position: "relative"
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#1f6fb2",
    color: "#fff",
    fontWeight: 700,
    fontSize: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(31,111,178,0.10)",
    outline: "none"
  },
  name: {
    fontWeight: 600,
    fontSize: 16,
    color: "#0f172a"
  },
  dropdownWrap: {
    position: "relative"
  },
  dropdownBtn: {
    background: "transparent",
    border: "none",
    color: "#1f6fb2",
    fontSize: 16,
    cursor: "pointer",
    outline: "none"
  },
  dropdownMenu: {
    position: "absolute",
    top: 36,
    right: 0,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    boxShadow: "0 2px 8px rgba(31,111,178,0.10)",
    minWidth: 120,
    display: "none"
  },
  menuItem: {
    width: "100%",
    padding: "10px 18px",
    background: "none",
    border: "none",
    color: "#1f6fb2",
    fontWeight: 600,
    fontSize: 15,
    textAlign: "left",
    cursor: "pointer"
  }
};
