
import React, { useState, useEffect } from "react";

// ===================== CONSTANTS & MOCK DATA =====================
const INITIAL_TICKETS = [
  {
    id: "TCK-1021",
    subject: "Assessment not visible",
    category: "Assessment",
    priority: "High",
    status: "In Progress",
    created: "12 Aug 2025"
  },
  {
    id: "TCK-1014",
    subject: "Attendance not updated",
    category: "Attendance",
    priority: "Medium",
    status: "Resolved",
    created: "08 Aug 2025"
  }
];

// ===================== STYLES =====================
const page = { padding: 24, maxWidth: 1200, margin: "0 auto" };
const card = {
  background: "#fff",
  borderRadius: 16,
  padding: 28,
  border: "1px solid #e5e7eb",
  boxShadow: "0 2px 8px #e5e7eb55"
};
const title = { marginBottom: 6 };
const subtle = { fontSize: 13, color: "#6b7280" };
const formGrid = {
  marginTop: 20,
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 18
};
const label = { fontSize: 13, fontWeight: 600 };
const req = { color: "#dc2626" };
const input = err => ({
  width: "100%",
  height: 38,
  padding: "8px 10px",
  borderRadius: 8,
  border: err ? "1.5px solid #dc2626" : "1px solid #e5e7eb",
  outline: "none",
  fontSize: 14,
  background: err ? "#fef2f2" : "#fff"
});
const textarea = err => ({
  width: "100%",
  minHeight: 90,
  padding: 10,
  borderRadius: 8,
  border: err ? "1.5px solid #dc2626" : "1px solid #e5e7eb",
  resize: "none",
  fontSize: 14,
  background: err ? "#fef2f2" : "#fff"
});
const charCount = {
  fontSize: 12,
  color: "#6b7280",
  textAlign: "right",
  marginTop: 4
};
const uploadBox = {
  border: "1px dashed #d1d5db",
  borderRadius: 8,
  padding: 12,
  background: "#f9fafb"
};
const submitBtn = {
  gridColumn: "1 / -1",
  marginTop: 10,
  background: "#7c3aed",
  color: "#fff",
  padding: "12px",
  borderRadius: 10,
  border: "none",
  fontWeight: 700,
  fontSize: 16,
  cursor: "pointer",
  transition: "background 0.2s"
};
const successBox = {
  marginTop: 16,
  background: "#ecfdf5",
  padding: 14,
  borderRadius: 10,
  color: "#047857",
  fontWeight: 600,
  fontSize: 15
};
const ticketsSection = { marginTop: 36 };
const sectionTitle = { fontSize: 18, fontWeight: 800, marginBottom: 14 };
const tableWrapper = {
  background: "#fff",
  borderRadius: 14,
  border: "1px solid #e5e7eb",
  overflowX: "auto",
  boxShadow: "0 2px 8px #e5e7eb33"
};
const table = { width: "100%", borderCollapse: "collapse" };
const th = {
  padding: "14px 16px",
  fontSize: 13,
  fontWeight: 700,
  color: "#6b7280",
  borderBottom: "1px solid #e5e7eb",
  background: "#f9fafb",
  textAlign: "left"
};
const td = { padding: "14px 16px", fontSize: 14 };
const tdStrong = { ...td, fontWeight: 600 };
const tdMuted = { ...td, fontSize: 12, color: "#6b7280" };
const statusBadge = s => ({
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  background: s === "Resolved" ? "#ecfdf5" : s === "Open" ? "#f3f4f6" : "#fff7ed",
  color: s === "Resolved" ? "#047857" : s === "Open" ? "#2563eb" : "#b45309"
});
const priorityBadge = p => ({
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  background: p === "High" ? "#fef2f2" : p === "Medium" ? "#fef9c3" : "#f3f4f6",
  color: p === "High" ? "#b91c1c" : p === "Medium" ? "#92400e" : "#2563eb"
});

// ===================== REUSABLE COMPONENTS =====================
function FormField({ label: lbl, name, value, onChange, error, disabled }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <label style={label} htmlFor={name}>
        {lbl} <span style={req}>*</span>
      </label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        style={input(error)}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-helper` : undefined}
        autoComplete="off"
        disabled={disabled}
      />
      {error && (
        <div id={`${name}-helper`} style={{ color: "#dc2626", fontSize: 12, marginTop: 2 }}>{error}</div>
      )}
    </div>
  );
}
function FormSelect({ label: lbl, name, value, onChange, error, options, disabled }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <label style={label} htmlFor={name}>
        {lbl} <span style={req}>*</span>
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        style={input(error)}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-helper` : undefined}
        autoComplete="off"
        disabled={disabled}
      >
        <option value="">Select</option>
        {options.map(o => (
          <option key={o}>{o}</option>
        ))}
      </select>
      {error && (
        <div id={`${name}-helper`} style={{ color: "#dc2626", fontSize: 12, marginTop: 2 }}>{error}</div>
      )}
    </div>
  );
}

// ===================== HELPERS & HOOKS =====================
function validateForm(form) {
  const errors = {};
  if (!form.subject.trim()) errors.subject = "Subject is required.";
  if (!form.category) errors.category = "Category is required.";
  if (!form.priority) errors.priority = "Priority is required.";
  if (!form.description.trim()) errors.description = "Description is required.";
  return errors;
}
function getISOTimestamp() {
  return new Date().toISOString();
}
function createSupportTicket(payload) {
  return new Promise(resolve => setTimeout(() => resolve({ ...payload, status: "Open" }), 1200));
}

// ===================== MAIN COMPONENT =====================
export default function RaiseTicket() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [form, setForm] = useState({
    subject: "",
    category: "",
    priority: "",
    description: "",
    screenshot: null
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  }
  function handleDescription(e) {
    const value = e.target.value.slice(0, 100);
    setForm(prev => ({ ...prev, description: value }));
    setErrors(prev => ({ ...prev, description: undefined }));
  }
  function handleFile(e) {
    setForm(prev => ({ ...prev, screenshot: e.target.files[0] || null }));
  }
  function resetFileInput() {
    setForm(prev => ({ ...prev, screenshot: null }));
    const el = document.getElementById("screenshot-input");
    if (el) el.value = "";
  }
  async function submitTicket(e) {
    e.preventDefault();
    if (loading) return;
    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    setLoading(true);
    const newTicket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: form.subject.trim(),
      category: form.category,
      priority: form.priority,
      description: form.description.trim(),
      status: "Open",
      created: getISOTimestamp(),
      screenshot: form.screenshot ? form.screenshot.name : null
    };
    const created = await createSupportTicket(newTicket);
    setTickets(prev => [created, ...prev]);
    setForm({
      subject: "",
      category: "",
      priority: "",
      description: "",
      screenshot: null
    });
    resetFileInput();
    setSuccess(true);
    setLoading(false);
    setTimeout(() => setSuccess(false), 3000);
  }
  useEffect(() => {
    const firstError = Object.keys(errors)[0];
    if (firstError) {
      const el = document.querySelector(`[name='${firstError}']`);
      if (el) el.focus();
    }
  }, [errors]);

  // Modern hover effect logic for button and table rows
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredBtn, setHoveredBtn] = useState(false);
  return (
    <div style={page}>
      {/* ================= CREATE TICKET ================= */}
      <div style={card}>
        <h2 style={{ ...title, fontSize: 22, fontWeight: 800 }}>Raise a Support Ticket</h2>
        <p style={subtle}>
          Report issues related to assessments, attendance, study material, or placement. Our support team will respond promptly.
        </p>
        <form onSubmit={submitTicket} style={formGrid} autoComplete="off">
          {/* SUBJECT – FULL WIDTH */}
          <div style={{ gridColumn: "1 / -1" }}>
            <FormField
              label="Subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              error={errors.subject}
              disabled={loading}
            />
          </div>
          {/* CATEGORY */}
          <FormSelect
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            error={errors.category}
            options={["Assessment", "Attendance", "Study Material", "Placement", "Other"]}
            disabled={loading}
          />
          {/* PRIORITY */}
          <FormSelect
            label="Priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            error={errors.priority}
            options={["Low", "Medium", "High"]}
            disabled={loading}
          />
          {/* DESCRIPTION – FULL WIDTH */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={label} htmlFor="description">
              Describe your issue (max 100 characters) <span style={req}>*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleDescription}
              style={textarea(errors.description)}
              disabled={loading}
              aria-invalid={!!errors.description}
            />
            <div style={charCount}>
              {form.description.length} / 100
              {errors.description && (
                <span style={{ color: "#dc2626", marginLeft: 12 }}>{errors.description}</span>
              )}
            </div>
          </div>
          {/* SCREENSHOT */}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={label} htmlFor="screenshot-input">Attach Screenshot (optional)</label>
            <div style={uploadBox}>
              <input
                id="screenshot-input"
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFile}
                disabled={loading}
              />
              <div style={subtle}>PNG / JPG recommended. Max 2MB.</div>
              {form.screenshot && (
                <div style={{ fontSize: 12, color: "#374151", marginTop: 4 }}>
                  Selected: {form.screenshot.name}
                  <button type="button" style={{ marginLeft: 10, color: "#dc2626", background: "none", border: "none", cursor: "pointer" }} onClick={resetFileInput} disabled={loading}>Remove</button>
                </div>
              )}
            </div>
          </div>
          <button
            type="submit"
            style={{
              ...submitBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: hoveredBtn ? "0 8px 24px rgba(124,58,237,0.18)" : "none",
              transform: hoveredBtn ? "scale(1.04)" : "none",
              background: hoveredBtn ? "linear-gradient(90deg,#7c3aed,#ede9fe)" : submitBtn.background,
              transition: "all 0.18s cubic-bezier(.4,0,.2,1)"
            }}
            disabled={loading}
            onMouseEnter={() => setHoveredBtn(true)}
            onMouseLeave={() => setHoveredBtn(false)}
          >
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>
        {success && (
          <div style={successBox}>
            ✅ Ticket submitted successfully. Our team will get back to you.
          </div>
        )}
      </div>
      {/* ================= MY TICKETS ================= */}
      <section style={ticketsSection}>
        <h3 style={sectionTitle}>My Support Tickets</h3>
        <div style={tableWrapper}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Ticket ID</th>
                <th style={th}>Subject</th>
                <th style={th}>Category</th>
                <th style={th}>Priority</th>
                <th style={th}>Status</th>
                <th style={th}>Created</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ ...td, textAlign: "center", color: "#6b7280" }}>
                    No support tickets found.
                  </td>
                </tr>
              ) : (
                tickets.map((t, idx) => (
                  <tr
                    key={t.id}
                    style={
                      hoveredRow === idx
                        ? {
                            background: "linear-gradient(90deg,#ede9fe,#f5f3ff)",
                            boxShadow: "0 8px 24px rgba(124,58,237,0.10)",
                            transform: "scale(1.01)",
                            transition: "all 0.18s cubic-bezier(.4,0,.2,1)"
                          }
                        : {}
                    }
                    onMouseEnter={() => setHoveredRow(idx)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td style={tdMuted}>{t.id}</td>
                    <td style={tdStrong}>{t.subject}</td>
                    <td style={td}>{t.category}</td>
                    <td style={td}>
                      <span style={priorityBadge(t.priority)}>{t.priority}</span>
                    </td>
                    <td style={td}>
                      <span style={statusBadge(t.status)}>{t.status}</span>
                    </td>
                    <td style={tdMuted}>{t.created.length > 12 ? new Date(t.created).toLocaleString() : t.created}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
