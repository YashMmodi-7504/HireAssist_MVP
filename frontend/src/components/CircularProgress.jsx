import React from "react";

export default function CircularProgress({ value, size = 120 }) {
  const radius = 52;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (value / 100) * circumference;

  return (
    <svg height={size} width={size}>
      <circle
        stroke="#e5e7eb"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke="#7c3aed"
        fill="transparent"
        strokeWidth={stroke}
        strokeLinecap="round"
        style={{
          transition: "stroke-dashoffset 0.6s ease"
        }}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        r={normalizedRadius}
        cx={size / 2}
        cy={size / 2}
      />
      <text
        x="50%"
        y="50%"
        dy="6px"
        textAnchor="middle"
        fontSize="22"
        fontWeight="800"
        fill="#111827"
      >
        {value}%
      </text>
    </svg>
  );
}
