import { getSession } from "../utils/session";

export default function Header() {
  const session = getSession();

  const name = session?.user_name || "User";
  const firstLetter = name.charAt(0).toUpperCase();

  return (
    <header style={styles.header}>
      <div style={styles.brand}>HireAssist</div>
      <div style={styles.user}>
        <span style={styles.name}>{name}</span>
        <div style={styles.avatar}>{firstLetter}</div>
      </div>
    </header>
  );
}
