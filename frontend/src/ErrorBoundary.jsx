import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Intentionally minimal — no PII, no payloads
    console.error("UI Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={container}>
          <h2 style={{ marginBottom: 8 }}>Something went wrong</h2>
          <p style={subtle}>
            A UI error occurred. Please refresh the page.
          </p>
          <details style={details}>
            <summary>Technical details</summary>
            <pre>{String(this.state.error)}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

/* ---------------- STYLES ---------------- */

const container = {
  padding: 32,
  background: "#fff",
  border: "1px solid #fee2e2",
  borderRadius: 12,
  maxWidth: 600,
  margin: "40px auto"
};

const subtle = {
  fontSize: 13,
  color: "#6b7280"
};

const details = {
  marginTop: 12,
  fontSize: 12,
  color: "#374151"
};
