import React, { useState } from "react";

/* ================= CONSTANTS ================= */

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand",
  "Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal",
  "Delhi","Chandigarh","Puducherry"
];

const YES_NO = ["Yes", "No"];

/* ================= COMPONENT ================= */

export default function PlacementForm() {
  const [form, setForm] = useState({
    interested: "Yes",
    tenth: "",
    twelfth: "",
    graduationUniversity: "",
    graduationPercent: "",
    passoutYear: "",
    location: "",
    jobLocations: [],
    englishRating: "",
    bond: "Yes",
    skills: "",
    languages: "",
    resume: null,
    relocate: "Yes"
  });

  const [submitted, setSubmitted] = useState(false);

  const update = (name, value) =>
    setForm(prev => ({ ...prev, [name]: value }));

  const addState = state => {
    if (!state) return;
    if (form.jobLocations.includes(state)) return;
    if (form.jobLocations.length >= 3) return;
    update("jobLocations", [...form.jobLocations, state]);
  };

  const removeState = state =>
    update("jobLocations", form.jobLocations.filter(s => s !== state));

  const submitForm = e => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={title}>Placement Form</h2>
        <p style={subtitle}>
          Information shared with recruiters for placement opportunities
        </p>

        <form onSubmit={submitForm}>
          <Section title="Interest">
            <FormRow>
              <Select
                label="Interested in placement opportunities"
                required
                value={form.interested}
                options={YES_NO}
                onChange={v => update("interested", v)}
              />
            </FormRow>
          </Section>

          <Section title="Academic Information">
            <FormRow>
              <Input label="10th Percentage" required value={form.tenth} onChange={v => update("tenth", v)} />
              <Input label="12th Percentage" value={form.twelfth} onChange={v => update("twelfth", v)} />
            </FormRow>

            <FormRow>
              <Input label="Graduation University" required value={form.graduationUniversity} onChange={v => update("graduationUniversity", v)} />
              <Input label="Graduation Percentage" required value={form.graduationPercent} onChange={v => update("graduationPercent", v)} />
            </FormRow>

            <FormRow>
              <Input label="Year of Passout" value={form.passoutYear} onChange={v => update("passoutYear", v)} />
              <Input label="Current Location" value={form.location} onChange={v => update("location", v)} />
            </FormRow>
          </Section>

          <Section title="Job Preferences">
            <FormRow>
              <StateSelect
                label="Preferred Job Locations (Max 3)"
                required
                values={form.jobLocations}
                options={STATES}
                onAdd={addState}
                onRemove={removeState}
              />
              <Input
                label="English Communication (1–10)"
                required
                value={form.englishRating}
                onChange={v => update("englishRating", v)}
              />
            </FormRow>

            <FormRow>
              <Select label="Willing to sign bond" required value={form.bond} options={YES_NO} onChange={v => update("bond", v)} />
              <Input label="Technical Skills" required value={form.skills} onChange={v => update("skills", v)} />
            </FormRow>

            <FormRow>
              <Input label="Languages Known" required value={form.languages} onChange={v => update("languages", v)} />
              <FileInput label="Upload CV (PDF only)" required onChange={f => update("resume", f)} />
            </FormRow>

            <FormRow>
              <Select label="Willing to relocate" required value={form.relocate} options={YES_NO} onChange={v => update("relocate", v)} />
            </FormRow>
          </Section>

          <button type="submit" style={submitBtn}>
            Submit Placement Form
          </button>

          {submitted && (
            <div style={success}>
              ✅ Placement form submitted successfully
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

/* ================= REUSABLE ================= */

function Section({ title, children }) {
  return (
    <div style={section}>
      <h3 style={sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

function FormRow({ children }) {
  return <div style={row}>{children}</div>;
}

function Input({ label, value, onChange, required }) {
  return (
    <div style={field}>
      <label style={labelStyle}>
        {label}{required && <span style={req}> *</span>}
      </label>
      <input value={value} onChange={e => onChange(e.target.value)} style={input} />
    </div>
  );
}

function Select({ label, value, options, onChange, required }) {
  return (
    <div style={field}>
      <label style={labelStyle}>
        {label}{required && <span style={req}> *</span>}
      </label>
      <select value={value} onChange={e => onChange(e.target.value)} style={input}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function StateSelect({ label, values, options, onAdd, onRemove, required }) {
  return (
    <div style={field}>
      <label style={labelStyle}>
        {label}{required && <span style={req}> *</span>}
      </label>

      <div style={chipBox}>
        {values.map(v => (
          <span key={v} style={chip} onClick={() => onRemove(v)}>
            {v} ✕
          </span>
        ))}

        <select
          style={chipSelect}
          value=""
          disabled={values.length >= 3}
          onChange={e => onAdd(e.target.value)}
        >
          <option value="">Select state</option>
          {options.map(s => (
            <option key={s} value={s} disabled={values.includes(s)}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div style={hint}>{values.length}/3 selected</div>
    </div>
  );
}

function FileInput({ label, onChange, required }) {
  return (
    <div style={field}>
      <label style={labelStyle}>
        {label}{required && <span style={req}> *</span>}
      </label>
      <input type="file" accept=".pdf" onChange={e => onChange(e.target.files[0])} />
    </div>
  );
}

/* ================= STYLES ================= */

const page = { padding: 24, display: "flex", justifyContent: "center" };

const card = {
  maxWidth: 840,
  width: "100%",
  background: "#fff",
  borderRadius: 10,
  padding: 22,
  border: "1px solid #e5e7eb"
};

const title = { marginBottom: 4 };
const subtitle = { fontSize: 12, color: "#6b7280", marginBottom: 18 };

const section = { marginBottom: 22 };
const sectionTitle = { fontSize: 14, fontWeight: 700, marginBottom: 10 };

const row = {
  display: "grid",
  gridTemplateColumns: "repeat(2,1fr)",
  gap: 12,
  marginBottom: 10
};

const field = { display: "flex", flexDirection: "column", gap: 4 };

const labelStyle = { fontSize: 12, fontWeight: 600 };
const req = { color: "#dc2626" };

const input = {
  height: 28,
  padding: "4px 8px",
  borderRadius: 6,
  border: "1px solid #d1d5db",
  fontSize: 12
};

const chipBox = {
  display: "flex",
  flexWrap: "wrap",
  gap: 6,
  padding: 6,
  borderRadius: 6,
  border: "1px solid #d1d5db"
};

const chip = {
  background: "#ede9fe",
  padding: "3px 8px",
  borderRadius: 999,
  fontSize: 11,
  cursor: "pointer"
};

const chipSelect = {
  border: "none",
  fontSize: 12,
  outline: "none",
  background: "transparent"
};

const hint = { fontSize: 11, color: "#6b7280", marginTop: 4 };

const submitBtn = {
  marginTop: 18,
  width: "100%",
  padding: "9px",
  background: "#4f46e5",
  color: "#fff",
  borderRadius: 8,
  border: "none",
  fontWeight: 700,
  cursor: "pointer"
};

const success = {
  marginTop: 14,
  background: "#ecfdf5",
  padding: 10,
  borderRadius: 8,
  fontWeight: 600,
  color: "#047857"
};
