// src/utils/session.js

export const setSession = (user) => {
  const session = {
    logged_in: true,
    id: user.id,
    email: user.email,

    // ✅ single source of truth
    full_name: user.full_name,

    // ✅ alias for legacy UI usage
    user_name: user.full_name,

    role: user.role,
  };

  localStorage.setItem("session", JSON.stringify(session));
};

export const getSession = () => {
  const raw = localStorage.getItem("session");
  return raw ? JSON.parse(raw) : null;
};

export const clearSession = () => {
  localStorage.removeItem("session");
};
