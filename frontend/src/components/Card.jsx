import React, { useState } from "react";

export default function Card({
  title,
  value,
  subtitle,
  icon,
  interactive = true, // 🔥 DEFAULT TRUE
  onClick,
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        background: hovered
          ? "linear-gradient(135deg, #ede9fe, #f5f3ff)"
          : "#ffffff",
        borderRadius: 18,
        padding: 22,
        minWidth: 220,
        cursor: interactive ? "pointer" : "default",
        boxShadow: hovered
          ? "0 25px 50px rgba(124,58,237,0.35)"
          : "0 8px 20px rgba(0,0,0,0.08)",
        transform: hovered ? "translateY(-8px) scale(1.02)" : "none",
        transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
        border: hovered ? "1px solid #7c3aed" : "1px solid #e5e7eb",
        pointerEvents: "auto", // 🔥 ENSURE EVENTS
      }}
    >
      {/* ICON */}
      {icon && (
        <div
          style={{
            fontSize: 26,
            marginBottom: 8,
            transition: "transform 0.25s",
            transform: hovered ? "scale(1.2)" : "scale(1)",
          }}
        >
          {icon}
        </div>
      )}

      <div style={{ fontSize: 12, color: "#6b7280" }}>{title}</div>

      <div style={{ fontSize: 30, fontWeight: 800 }}>{value}</div>

      {subtitle && (
        <div
          style={{
            fontSize: 12,
            marginTop: 6,
            color: hovered ? "#7c3aed" : "#9ca3af",
            fontWeight: hovered ? 600 : 400,
          }}
        >
          {hovered ? "Explore details →" : subtitle}
        </div>
      )}
    </div>
  );
}
