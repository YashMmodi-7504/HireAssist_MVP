import React, { useState, useRef, useEffect } from "react";

/* =====================================================
   DESIGN TOKENS (EXECUTIVE-GRADE)
===================================================== */

const COLORS = {
  primary: "#7c3aed",
  primaryBg: "#ede9fe",
  heading: "#312e81",
  text: "#374151",
  muted: "#6b7280",
  border: "#e5e7eb",
  bg: "#f9fafb",
  white: "#ffffff",
  danger: "#ef4444"
};

/* =====================================================
   UTILITIES
===================================================== */

// Remove markdown / symbols from LLM output
function sanitizeText(text) {
  if (!text) return "";
  return text
    .replace(/[*`#•]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/* =====================================================
   COMPONENT
===================================================== */

export default function AIChatbot() {
  const BASE_URL = "http://127.0.0.1:8000";

  const [activeTab, setActiveTab] = useState("chat");

  /* ---------------- CHAT ---------------- */
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  /* ---------------- RESUME ---------------- */
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [resumeFeedback, setResumeFeedback] = useState("");
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeError, setResumeError] = useState("");

  const timestamp = () => new Date().toLocaleTimeString();

  /* =====================================================
     NETWORK LAYER
  ===================================================== */

  async function safeFetch(endpoint, options) {
    try {
      const res = await fetch(BASE_URL + endpoint, options);
      const text = await res.text();
      const json = text ? JSON.parse(text) : null;

      if (!res.ok) {
        return { ok: false, error: json?.detail || json?.error || "Request failed" };
      }

      return { ok: true, data: json };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }

  /* =====================================================
     AI CHAT (LLM)
  ===================================================== */

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput("");
    setLoading(true);

    setMessages(prev => [
      ...prev,
      { role: "user", text: question, time: timestamp() }
    ]);

    const res = await safeFetch("/api/ai/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: question })
    });

    const answer =
      res.ok && typeof res.data?.answer === "string"
        ? res.data.answer
        : res.error || "The AI was unable to respond.";

    setMessages(prev => [
      ...prev,
      { role: "assistant", text: answer, time: timestamp() }
    ]);

    setLoading(false);
  }

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, activeTab]);

  /* =====================================================
     RESUME WORKFLOW
  ===================================================== */

  async function uploadResume(e) {
    setResumeError("");
    setResumeFeedback("");
    setResumeUploaded(false);

    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") {
      setResumeError("Please upload a valid PDF resume.");
      return;
    }

    setResumeLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await safeFetch("/api/resume/upload", {
      method: "POST",
      body: formData
    });

    if (!res.ok) {
      setResumeError(res.error);
      setResumeLoading(false);
      return;
    }

    setResumeUploaded(true);
    setResumeLoading(false);
  }

  async function analyzeResume() {
    setResumeLoading(true);
    setResumeError("");
    setResumeFeedback("");

    const res = await safeFetch("/api/resume/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question:
          "Analyze my resume like a senior recruiter. Highlight strengths, gaps, and improvement suggestions."
      })
    });

    if (!res.ok || typeof res.data?.answer !== "string") {
      setResumeError(res.error || "Resume analysis failed.");
    } else {
      setResumeFeedback(res.data.answer);
    }

    setResumeLoading(false);
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div style={{ padding: 28, background: COLORS.bg, minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", color: COLORS.heading }}>
        AI Learning & Career Assistant
      </h1>

      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <button onClick={() => setActiveTab("chat")}>AI Chat</button>{" "}
        <button onClick={() => setActiveTab("resume")}>Resume Assistant</button>
      </div>

      {/* ================= AI CHAT ================= */}
      {activeTab === "chat" && (
        <>
          <div
            ref={chatRef}
            style={{
              background: COLORS.white,
              padding: 16,
              minHeight: 340,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10
            }}
          >
            {messages.length === 0 && (
              <div style={{ color: COLORS.muted }}>
                Ask anything about AI, Data Science, SQL, ML, or interviews.
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: 14
                }}
              >
                <div
                  style={{
                    background:
                      m.role === "user" ? COLORS.primary : COLORS.primaryBg,
                    color:
                      m.role === "user" ? COLORS.white : COLORS.heading,
                    padding: "10px 16px",
                    borderRadius: 14,
                    maxWidth: "70%",
                    fontWeight: 500
                  }}
                >
                  {sanitizeText(m.text)}
                  <div
                    style={{
                      fontSize: 11,
                      color: COLORS.muted,
                      marginTop: 4,
                      textAlign: "right"
                    }}
                  >
                    {m.time}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ color: COLORS.primary, fontWeight: 500 }}>
                Analyzing your question…
              </div>
            )}
          </div>

          <form
            onSubmit={e => {
              e.preventDefault();
              sendMessage();
            }}
            style={{ display: "flex", gap: 10, marginTop: 12 }}
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask anything…"
              disabled={loading}
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 10,
                border: `1px solid ${COLORS.border}`
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                padding: "10px 22px",
                borderRadius: 10,
                background: COLORS.primary,
                color: COLORS.white,
                fontWeight: 600,
                border: "none"
              }}
            >
              Send
            </button>
          </form>
        </>
      )}

      {/* ================= RESUME ================= */}
      {activeTab === "resume" && (
        <>
          <input
            type="file"
            accept="application/pdf"
            onChange={uploadResume}
            disabled={resumeLoading || resumeUploaded}
          />

          {resumeUploaded && (
            <button
              onClick={analyzeResume}
              disabled={resumeLoading}
              style={{
                marginLeft: 12,
                padding: "10px 22px",
                borderRadius: 10,
                background: COLORS.primary,
                color: COLORS.white,
                border: "none",
                fontWeight: 600
              }}
            >
              {resumeLoading ? "Reviewing resume…" : "Analyze Resume"}
            </button>
          )}

          {resumeError && (
            <p style={{ color: COLORS.danger, marginTop: 12 }}>
              {resumeError}
            </p>
          )}

          {resumeFeedback && (
            <div
              style={{
                background: COLORS.primaryBg,
                padding: 18,
                marginTop: 18,
                borderRadius: 12,
                border: `1px solid ${COLORS.primary}`
              }}
            >
              <b style={{ color: COLORS.heading }}>AI Feedback</b>
              <div style={{ marginTop: 10, whiteSpace: "pre-line" }}>
                {sanitizeText(resumeFeedback)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
