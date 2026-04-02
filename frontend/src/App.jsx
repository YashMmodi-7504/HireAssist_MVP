import React, { useState } from "react";
import Login from "./Login";
import StudentDashboard from "./Student_Dashboard";
import AdminLayout from "./layouts/AdminLayout";
import PlacementLayout from "./layouts/PlacementLayout";
import FacultyLayout from "./layouts/FacultyLayout";
import { getSession } from "./utils/session";

export default function App() {
  const [, setRerender] = useState(0);
  const session = getSession();

  function handleLogin() {
    setRerender(x => x + 1);
  }

  if (!session?.logged_in) {
    return <Login onLogin={handleLogin} />;
  }

  switch (session.role) {
    case "student":
      return <StudentDashboard />;
    case "admin":
      return <AdminLayout />;
    case "faculty":
      return <FacultyLayout />;
    case "placement":
      return <PlacementLayout />;
    default:
      return <Login onLogin={handleLogin} />;
  }
}
