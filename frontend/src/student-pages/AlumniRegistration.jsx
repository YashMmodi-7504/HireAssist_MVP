
import React, { useState, useRef } from "react";

/* =====================================================
   DESIGN TOKENS
===================================================== */

const COLORS = {
  primary: "#7c3aed",
  error: "#dc2626",
  success: "#047857",
  bg: "#f9fafb",
  card: "#ffffff",
  border: "#e5e7eb",
  text: "#334155",
  heading: "#312e81",
  muted: "#6b7280",
  accent: "#16a34a"
};

/* =====================================================
   REUSABLE COMPONENTS
===================================================== */

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={sectionTitle}>{title}</div>
      {children}
    </div>
  );
}

function Grid({ children }) {
  return <div style={grid}>{children}</div>;
}

function Field({ label, value, onChange, error, required, placeholder }) {
  return (
    <div style={fieldWrap}>
      <label style={labelStyle}>
        {label} {required && <span style={req}>*</span>}
      </label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        style={input(error)}
      />
      {error && <div style={errorText}>Required field</div>}
    </div>
  );
}

function Select({ label, value, onChange, options, error, required }) {
  return (
    <div style={fieldWrap}>
      <label style={labelStyle}>
        {label} {required && <span style={req}>*</span>}
      </label>
      <select value={value} onChange={onChange} style={input(error)}>
        <option value="">Select</option>
        {options.map(o => (
          <option key={o}>{o}</option>
        ))}
      </select>
      {error && <div style={errorText}>Required field</div>}
    </div>
  );
}

function Checkbox({ label, checked, onChange, helper }) {
  return (
    <label style={checkboxLabel}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={checkboxInput}
      />
      <div>
        {label}
        {helper && <div style={helperText}>{helper}</div>}
      </div>
    </label>
  );
}

/* =====================================================
   MAIN COMPONENT
===================================================== */

export default function AlumniRegistration() {
  const [form, setForm] = useState({
    alumni_profile: {
      fullName: "",
      graduationYear: "",
      degree: "",
      customDegree: ""
    },
    career_status: {
      currentStatus: "",
      organization: "",
      role: "",
      location: ""
    },
    networking: {
      email: "",
      linkedin: ""
    },
    contribution: {
      mentorship: false,
      mockInterview: false,
      referrals: false,
      guestLecture: false
    }
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [hoveredBtn, setHoveredBtn] = useState(false);
  const [hoveredPreviewBtn, setHoveredPreviewBtn] = useState(false);
  const formRef = useRef(null);

  /* ================= HANDLERS ================= */

  function update(section, field, value) {
    setForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setErrors(prev => ({ ...prev, [field]: false }));
  }

  function validate() {
    const err = {};
    if (!form.alumni_profile.fullName) err.fullName = true;
    if (!form.alumni_profile.graduationYear) err.graduationYear = true;
    if (!form.alumni_profile.degree) err.degree = true;
    if (form.alumni_profile.degree === "Others" && !form.alumni_profile.customDegree) err.customDegree = true;
    if (!form.career_status.currentStatus) err.currentStatus = true;
    if (!form.networking.email) err.email = true;
    if (!form.networking.linkedin) err.linkedin = true;

    setErrors(err);

    if (Object.keys(err).length) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
      return false;
    }
    return true;
  }

  function submit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  }

  /* ================= UI ================= */

  return (
    <div style={page}>
      {/* INTRO */}
      <div style={introBox}>
        <h2 style={introTitle}>Alumni Network & Career Contribution</h2>
        <p style={introText}>
          Alumni play a vital role in mentorship, placements, and institutional
          growth. This network enables structured collaboration.
        </p>
      </div>

      {/* FORM */}
      <div ref={formRef} style={card}>
        <h2 style={title}>Alumni Registration</h2>
        <p style={subtitle}>
          Share your professional journey and support current students.
        </p>

        <form onSubmit={submit}>
          <Section title="Education Details">
            <Grid>
              <Field
                label="Full Name"
                required
                value={form.alumni_profile.fullName}
                onChange={e =>
                  update("alumni_profile", "fullName", e.target.value)
                }
                error={errors.fullName}
              />
              <Field
                label="Graduation Year"
                required
                placeholder="e.g. 2021"
                value={form.alumni_profile.graduationYear}
                onChange={e =>
                  update("alumni_profile", "graduationYear", e.target.value)
                }
                error={errors.graduationYear}
              />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Select
                  label="Degree"
                  required
                  value={form.alumni_profile.degree}
                  onChange={e =>
                    update("alumni_profile", "degree", e.target.value)
                  }
                  options={["B.Tech", "B.E", "B.Sc", "BCA", "M.Tech", "MCA", "MBA", "Others"]}
                  error={errors.degree}
                />
                {form.alumni_profile.degree === "Others" && (
                  <Field
                    label="Specify Degree"
                    required
                    value={form.alumni_profile.customDegree}
                    onChange={e =>
                      update("alumni_profile", "customDegree", e.target.value)
                    }
                    error={errors.customDegree}
                    placeholder="Your degree"
                  />
                )}
              </div>
            </Grid>
          </Section>

          <Section title="Current Career Status">
            <Grid>
              <Select
                label="Current Status"
                required
                value={form.career_status.currentStatus}
                onChange={e =>
                  update("career_status", "currentStatus", e.target.value)
                }
                options={[
                  "Employed",
                  "Self-Employed",
                  "Higher Studies",
                  "Job Seeking",
                  "Entrepreneur"
                ]}
                error={errors.currentStatus}
              />
              <Field
                label="Organization"
                value={form.career_status.organization}
                onChange={e =>
                  update("career_status", "organization", e.target.value)
                }
              />
              <Field
                label="Role"
                value={form.career_status.role}
                onChange={e =>
                  update("career_status", "role", e.target.value)
                }
              />
              <Field
                label="Location"
                value={form.career_status.location}
                onChange={e =>
                  update("career_status", "location", e.target.value)
                }
              />
            </Grid>
          </Section>

          <Section title="Contact & Networking">
            <Grid>
              <Field
                label="Email"
                required
                value={form.networking.email}
                onChange={e =>
                  update("networking", "email", e.target.value)
                }
                error={errors.email}
              />
              <Field
                label="LinkedIn Profile"
                required
                placeholder="https://linkedin.com/in/username"
                value={form.networking.linkedin}
                onChange={e =>
                  update("networking", "linkedin", e.target.value)
                }
                error={errors.linkedin}
              />
            </Grid>
          </Section>

          <Section title="Contribution Capabilities">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Checkbox
                label="Open to mentorship"
                checked={form.contribution.mentorship}
                onChange={e =>
                  update("contribution", "mentorship", e.target.checked)
                }
                helper="Guide students in career planning."
              />
              <Checkbox
                label="Mock interviews"
                checked={form.contribution.mockInterview}
                onChange={e =>
                  update("contribution", "mockInterview", e.target.checked)
                }
                helper="Conduct practice interviews."
              />
              <Checkbox
                label="Job referrals"
                checked={form.contribution.referrals}
                onChange={e =>
                  update("contribution", "referrals", e.target.checked)
                }
                helper="Refer students for opportunities."
              />
              <Checkbox
                label="Guest lectures"
                checked={form.contribution.guestLecture}
                onChange={e =>
                  update("contribution", "guestLecture", e.target.checked)
                }
                helper="Participate in alumni talks."
              />
            </div>
          </Section>

          <button
            type="submit"
            style={{
              ...submitBtn,
              boxShadow: hoveredBtn ? "0 8px 24px rgba(124,58,237,0.18)" : "none",
              transform: hoveredBtn ? "scale(1.04)" : "none",
              background: hoveredBtn ? "linear-gradient(90deg,#7c3aed,#ede9fe)" : submitBtn.background,
              transition: "all 0.18s cubic-bezier(.4,0,.2,1)"
            }}
            onMouseEnter={() => setHoveredBtn(true)}
            onMouseLeave={() => setHoveredBtn(false)}
          >
            Register as Alumni
          </button>
        </form>

        {submitted && (
          <div style={success}>
            ✔ Alumni profile submitted successfully.
          </div>
        )}
      </div>

      {/* PREVIEW */}
      {submitted && showPreview && (
        <div style={previewPanel}>
          <h3 style={previewTitle}>Profile Preview</h3>
          <div style={previewGrid}>
            <div><b>Name:</b> {form.alumni_profile.fullName}</div>
            <div><b>Degree:</b> {form.alumni_profile.degree}</div>
            <div><b>Role:</b> {form.career_status.role || "—"}</div>
            <div><b>Organization:</b> {form.career_status.organization || "—"}</div>
          </div>
          <button
            style={{
              ...submitBtn,
              boxShadow: hoveredPreviewBtn ? "0 8px 24px rgba(124,58,237,0.18)" : "none",
              transform: hoveredPreviewBtn ? "scale(1.04)" : "none",
              background: hoveredPreviewBtn ? "linear-gradient(90deg,#7c3aed,#ede9fe)" : submitBtn.background,
              transition: "all 0.18s cubic-bezier(.4,0,.2,1)"
            }}
            onMouseEnter={() => setHoveredPreviewBtn(true)}
            onMouseLeave={() => setHoveredPreviewBtn(false)}
            onClick={() => setShowPreview(false)}
          >
            Hide Preview
          </button>
        </div>
      )}
    </div>
  );
}

/* =====================================================
   STYLES
===================================================== */

const page = {
  minHeight: "100vh",
  background: COLORS.bg,
  padding: 16
};

const introBox = {
  maxWidth: 820,
  margin: "0 auto 32px",
  padding: 28,
  background: COLORS.bg,
  borderRadius: 16
};

const introTitle = {
  textAlign: "center",
  fontSize: 26,
  fontWeight: 900,
  color: COLORS.heading
};

const introText = {
  textAlign: "center",
  color: COLORS.text,
  marginTop: 8
};

const card = {
  maxWidth: 820,
  margin: "0 auto",
  background: COLORS.card,
  borderRadius: 16,
  padding: 32,
  border: `1px solid ${COLORS.border}`
};

const title = { fontSize: 24, fontWeight: 800, color: COLORS.heading };
const subtitle = { color: COLORS.muted, marginBottom: 24 };

const sectionTitle = {
  fontSize: 16,
  fontWeight: 700,
  marginBottom: 12,
  color: COLORS.heading
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(2,1fr)",
  gap: 16
};

const fieldWrap = { display: "flex", flexDirection: "column" };

const labelStyle = { fontSize: 14, fontWeight: 600, marginBottom: 4 };
const req = { color: COLORS.error };

const input = error => ({
  height: 38,
  padding: "8px 10px",
  borderRadius: 8,
  border: error ? `1px solid ${COLORS.error}` : `1px solid ${COLORS.border}`
});

const errorText = { fontSize: 12, color: COLORS.error };
const helperText = { fontSize: 12, color: COLORS.muted };

const checkboxLabel = {
  display: "flex",
  gap: 10,
  fontSize: 14,
  fontWeight: 600
};

const checkboxInput = { accentColor: COLORS.primary };

const submitBtn = {
  marginTop: 24,
  padding: "12px 24px",
  background: COLORS.primary,
  color: "#fff",
  borderRadius: 12,
  border: "none",
  fontWeight: 700,
  cursor: "pointer"
};

const success = {
  marginTop: 20,
  background: "#ecfdf5",
  padding: 14,
  borderRadius: 10,
  color: COLORS.success,
  fontWeight: 700
};

const previewPanel = {
  maxWidth: 540,
  margin: "32px auto",
  background: COLORS.card,
  borderRadius: 16,
  padding: 24,
  border: `1px solid ${COLORS.border}`
};

const previewTitle = {
  fontWeight: 800,
  textAlign: "center",
  marginBottom: 16
};

const previewGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2,1fr)",
  gap: 12
};

