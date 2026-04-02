import React from 'react';

export default function Loading({ size = 36, message = 'Loading…' }) {
  const s = size;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}> 
      <svg
        width={s}
        height={s}
        viewBox="0 0 50 50"
        style={{ animation: 'spin 1s linear infinite' }}
      >
        <circle cx="25" cy="25" r="20" stroke="#c7d2fe" strokeWidth="6" fill="none" opacity="0.4" />
        <path d="M45 25a20 20 0 0 0-20-20" stroke="#7c3aed" strokeWidth="6" strokeLinecap="round" fill="none" />
      </svg>
      <div style={{ color: '#6b7280' }}>{message}</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
