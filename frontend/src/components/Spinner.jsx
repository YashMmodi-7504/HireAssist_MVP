import React from "react";

export default function Spinner({ size = 28 }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 50 50" style={{ display: "block" }}>
      <circle
        cx="25"
        cy="25"
        r="20"
        stroke="rgba(15,23,42,0.12)"
        strokeWidth="6"
        fill="none"
      />
      <path
        d="M45 25a20 20 0 0 1-20 20"
        stroke="#0f172a"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        style={{ transformOrigin: "center", animation: "spin 1s linear infinite" }}
      />
      <style>{`@keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }`}</style>
    </svg>
  );
}
