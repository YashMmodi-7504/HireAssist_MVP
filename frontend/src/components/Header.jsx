
import React from "react";
import { getUserName } from "../utils/session";

export default function Header() {
  const fullName = getUserName();
  const initial = fullName?.charAt(0).toUpperCase() || "?";
  return (
    <header style={{
      display: "flex",
      alignItems: "center",
      padding: "16px 32px",
      background: "#ede9fe",
      borderBottom: "1px solid #e5e7eb"
    }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "#7c3aed",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: 20,
        marginRight: 16
      }}>
        {initial}
      </div>
      <span style={{ fontWeight: 700, fontSize: 18 }}>{fullName}</span>
    </header>
  );
}

const styles = {
  header: {
    height: 64,
    background: "#6f6bd1",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    color: "#fff"
  },
  logo: {
    fontSize: 20,
    fontWeight: 800
  },
  userBox: {
    display: "flex",
    alignItems: "center",
    gap: 12
  },
  userText: {
    textAlign: "right"
  },
  userName: {
    fontWeight: 700
  },
  userRole: {
    fontSize: 12,
    opacity: 0.9
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#ede9fe",
    color: "#4f46e5",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
};
