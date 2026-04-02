import React from "react";

export default function AuthLayout({ children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
      {children}
    </div>
  );
}
