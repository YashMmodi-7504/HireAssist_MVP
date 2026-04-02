import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log full details for debugging
    console.error('Uncaught React error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      const reload = () => window.location.reload();
      return (
        <div style={{ padding: 24, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: '#fff', padding: 18, borderBottom: '1px solid rgba(15,23,42,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 800 }}>HireAssist</div>
            <div style={{ color: '#6b7280' }}>An error occurred</div>
          </div>

          <div style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
            <div style={{ textAlign: 'center', color: '#6b7280' }}>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Something went wrong</div>
              <div style={{ marginBottom: 12 }}>{this.props.message ?? 'We encountered an unexpected error. You can reload the page to try again.'}</div>
              <div>
                <button onClick={reload} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(15,23,42,0.06)', background: '#fff', cursor: 'pointer' }}>Reload</button>
              </div>
              <div style={{ marginTop: 16, fontSize: 12, color: '#9ca3af' }}>Error: {String(this.state.error?.message ?? this.state.error)}</div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
