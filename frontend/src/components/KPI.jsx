import React from "react";

export default function KPI({ label, value, unit, style = {} }) {
  return (
    <div style={{ padding: 12, minWidth: 160, borderRadius: 10, textAlign: 'center', ...style }}>
      <div style={{ fontSize: 12, color: 'rgba(15,23,42,0.6)', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a' }}>{value}{unit ? ` ${unit}` : ''}</div>
    </div>
  );
}