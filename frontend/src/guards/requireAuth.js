import { getSession } from "../utils/session";

export function requireAuth(role = null) {
  const session = getSession();

  if (!session || !session.logged_in) {
    return { ok: false, reason: "not_logged_in" };
  }

  if (role && session.role !== role) {
    return { ok: false, reason: "forbidden" };
  }

  return { ok: true, session };
}
