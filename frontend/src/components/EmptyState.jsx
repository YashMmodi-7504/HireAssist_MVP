import React from 'react';

export default function EmptyState({ title = 'No items found', description = '', icon = null, actionLabel = null, onAction = null }) {
  return (
    <div style={{ padding: 20, textAlign: 'center', color: '#6b7280' }}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>{icon ?? '📭'}</div>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{title}</div>
      {description && <div style={{ fontSize: 13 }}>{description}</div>}
      {actionLabel && (
        <div style={{ marginTop: 12 }}>
          <button onClick={onAction} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(15,23,42,0.06)', background: '#fff', cursor: 'pointer' }}>{actionLabel}</button>
        </div>
      )}
    </div>
  );
}
