import React, { useState } from "react";

export default function PrimaryButton({ children, onClick, style = {}, disabled = false, type = "button" }) {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [active, setActive] = useState(false);

  const base = {
    background: "#0f172a",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 700,
    transition: "all 0.12s ease",
    transform: active ? "translateY(0) scale(0.997)" : hover ? "translateY(-1px)" : "translateY(0)",
    boxShadow: focus ? "0 6px 20px rgba(14,165,164,0.12)" : hover ? "0 8px 20px rgba(0,0,0,0.15)" : "0 6px 18px rgba(2,6,23,0.08)",
    opacity: disabled ? 0.7 : 1,
    outline: "none"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      onFocus={() => setFocus(true)}
      onBlur={() => { setFocus(false); setActive(false); }}
      style={{ ...base, ...style }}
    >
      {children}
    </button>
  );
}
