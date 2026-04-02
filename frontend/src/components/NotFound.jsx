import React from 'react';
import EmptyState from './EmptyState';

export default function NotFound() {
  return (
    <div style={{ padding: 24 }}>
      <EmptyState title="Page not found" description="The page you requested doesn't exist. Use the navigation to go back." />
    </div>
  );
}
