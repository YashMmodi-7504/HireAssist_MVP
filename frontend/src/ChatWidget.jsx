import React, { useState } from "react";

const BACKEND_URL = "http://127.0.0.1:8000";

export default function ChatWidget() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "👋 Hi! I am HireAssist AI. How can I help you?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function sendMessage() {
  if (!input.trim()) return;

  const userMessage = { role: "user", text: input };
  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setLoading(true);
  setError(null);

  try {
    const response = await fetch(`${BACKEND_URL}/api/chat/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        employer_id: "emp-1",
        message: input
      })
    });

    const data = await response.json();

    if (!data.assistant_text) {
      throw new Error("Invalid response");
    }

    const botMessage = {
      role: "bot",
      text: data.assistant_text
    };

    setMessages((prev) => [...prev, botMessage]);
  } catch {
    setError("⚠️ Chat service is unavailable.");
  }

  setLoading(false);
}

  return (
    <div style={styles.container}>
      <h3>💬 HireAssist Chat</h3>

      {/* CHAT WINDOW */}
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              backgroundColor:
                msg.role === "user" ? "#2563eb" : "#f3f4f6",
              color: msg.role === "user" ? "#fff" : "#000"
            }}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div style={{ ...styles.message, fontStyle: "italic" }}>
            AI is typing...
          </div>
        )}
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {/* INPUT */}
      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about jobs, candidates, training..."
        />
        <button style={styles.button} onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: 16,
    maxWidth: 600,
    margin: "0 auto"
  },
  chatBox: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    height: 380,
    overflowY: "auto",
    border: "1px solid #e5e7eb",
    padding: 10,
    borderRadius: 8,
    background: "#ffffff"
  },
  message: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 8,
    fontSize: 14,
    whiteSpace: "pre-line"
  },
  inputRow: {
    display: "flex",
    gap: 8,
    marginTop: 10
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px 14px",
    borderRadius: 6,
    border: "none",
    backgroundColor: "#2563eb",
    color: "#fff",
    cursor: "pointer"
  },
  error: {
    color: "red",
    marginTop: 6
  }
};
