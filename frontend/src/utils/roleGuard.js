// src/utils/roleGuard.js
import { getSession } from "./session";

export function canAccess(page) {
  const session = getSession();
  if (!session) return false;

  const role = session.role;

  const access = {
    director: ["dashboard", "training", "cohorts", "chat"],
    admin: ["admin", "jobs", "training", "cohorts", "chat"],
    trainer: ["training", "cohorts", "chat"],
    student: ["candidate", "upload", "chat"]
  };

  return access[role]?.includes(page);
}

export function defaultPageForRole(role) {
  switch (role) {
    case "director":
      return "dashboard";
    case "admin":
      return "admin";
    case "trainer":
      return "training";
    case "student":
      return "candidate";
    default:
      return "login";
  }
}
