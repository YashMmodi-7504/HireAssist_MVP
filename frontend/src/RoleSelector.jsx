import React from "react";

export default function RoleSelector({ onSelect }) {
  const roles = [
    { key: "director", label: "🎯 Director", page: "dashboard" },
    { key: "admin", label: "🛠️ Admin", page: "admin" },
    { key: "trainer", label: "🧑‍🏫 Trainer", page: "training" },
    { key: "student", label: "🎓 Student", page: "candidate" },
  ];

  function selectRole(role) {
    localStorage.setItem("role", role.key);
    onSelect(role.page);
  }

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>HireAssist</h1>
      <p>Select your role to continue</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 20,
          maxWidth: 500,
          margin: "40px auto",
        }}
      >
        {roles.map((r) => (
          <div
            key={r.key}
            onClick={() => selectRole(r)}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              padding: 30,
              cursor: "pointer",
              background: "#f9fafb",
              fontSize: 18,
              fontWeight: 500,
            }}
          >
            {r.label}
          </div>
        ))}
      </div>
    </div>
  );
}
