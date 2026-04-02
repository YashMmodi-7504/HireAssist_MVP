import React, { useState } from "react";
import { setSession } from "./utils/session";

const BACKEND = "http://127.0.0.1:8000";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function login(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Invalid email or password");
        setLoading(false);
        return;
      }
      setSession(data);
      if (onLogin) onLogin();
    } catch {
      setError("Server not reachable");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#f8fafc"
    }}>
      <form onSubmit={login} style={{
        background: "#fff",
        padding: 32,
        borderRadius: 12,
        boxShadow: "0 2px 16px rgba(80,60,180,0.08)",
        minWidth: 320
      }}>
        <h2 style={{ marginBottom: 24, color: "#1f6fb2" }}>HireAssist Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 16, padding: 10, borderRadius: 6, border: "1px solid #e5e7eb" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 24, padding: 10, borderRadius: 6, border: "1px solid #e5e7eb" }}
        />
        <button type="submit" disabled={loading} style={{
          width: "100%",
          padding: "10px 0",
          borderRadius: 6,
          background: "#1f6fb2",
          color: "#fff",
          fontWeight: 700,
          border: "none"
        }}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}
      </form>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0b8fd4",
    fontFamily: "Segoe UI, sans-serif"
  },

  header: {
    background: "#fff",
    padding: "12px 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },

  logoBox: {
    display: "flex",
    alignItems: "center"
  },

  logo: {
    background: "#facc15",
    padding: "10px 14px",
    fontWeight: 800,
    borderRadius: 4
  },

  nav: {
    display: "flex",
    gap: 18,
    fontSize: 14,
    alignItems: "center"
  },

  active: {
    color: "#0284c7",
    fontWeight: 700
  },

  main: {
    display: "grid",
    gridTemplateColumns: "420px 1fr",
    gap: 40,
    padding: "60px 80px"
  },

  card: {
    background: "#fff",
    padding: 30,
    borderRadius: 6
  },

  title: {
    marginBottom: 20,
    fontWeight: 700,
    color: "#0284c7"
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: 14,
    border: "1px solid #cbd5e1",
    borderRadius: 4
  },

  remember: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    marginBottom: 16
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    fontWeight: 700,
    cursor: "pointer"
  },

  forgot: {
    marginTop: 16,
    fontSize: 13,
    color: "#2563eb",
    textAlign: "center",
    cursor: "pointer"
  },

  error: {
    color: "#dc2626",
    marginBottom: 12,
    fontSize: 13
  },

  imageWrap: {
    background: "#fff",
    borderRadius: 6,
    overflow: "hidden"
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  }
};
