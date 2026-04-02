import React, { useState, useRef, useEffect } from "react";

export default function ProfileMenu({ name, role, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Avatar */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "#ede9fe",
          color: "#5b21b6",
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          userSelect: "none"
        }}
      >
        {name[0]?.toUpperCase()}
      </div>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 48,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
            width: 200,
            padding: 12,
            zIndex: 50,
            animation: "fadeIn 0.2s ease"
          }}
        >
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontWeight: 700 }}>{name}</div>
            <div style={{ fontSize: 12, color: "#6b7280" }}>{role}</div>
          </div>

          <MenuItem label="⚙️ Settings" />
          <MenuItem label="📄 Profile" />
          <MenuItem label="🚪 Logout" danger onClick={onLogout} />
        </div>
      )}
    </div>
  );
}

function MenuItem({ label, danger, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      tabIndex={0}
      role="menuitem"
      style={{
        padding: "10px 12px",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 14,
        fontWeight: 600,
        color: danger ? "#b91c1c" : hovered ? "#7c3aed" : "#111827",
        background: hovered ? "linear-gradient(90deg,#ede9fe,#f5f3ff)" : "transparent",
        boxShadow: hovered ? "0 8px 24px rgba(124,58,237,0.10)" : "none",
        transform: hovered ? "scale(1.04)" : "none",
        transition: "all 0.18s cubic-bezier(.4,0,.2,1)",
        outline: hovered ? "2px solid #c4b5fd" : "none"
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </div>
  );
}
