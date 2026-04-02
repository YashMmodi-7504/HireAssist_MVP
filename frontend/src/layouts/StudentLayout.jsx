// src/layouts/StudentLayout.jsx
import React from "react";
import Header from "../components/Header";
import StudentDashboard from "../student-pages/Student_Dashboard";
import { getSession } from "../utils/session";

export default function StudentLayout() {
  const session = getSession();

  // Safety guard (should never happen if App.jsx is correct)
  if (!session || session.role !== "student") {
    return null;
  }

  return (
    <div style={styles.page}>
      <Header />
      <main style={styles.content}>
        <StudentDashboard />
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc"
  },
  content: {
    padding: 24
  }
};
