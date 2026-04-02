import React, { createContext, useContext, useState } from "react";

const StudentContext = createContext();

export function StudentProvider({ children }) {
  // TEMP: simulate logged-in student
  const [student] = useState({
    user_id: 101,
    role: "student",
    candidate_id: 6, // 🔴 THIS IS THE KEY
    name: "Yash"
  });

  return (
    <StudentContext.Provider value={student}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  return useContext(StudentContext);
}
