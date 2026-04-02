import sqlite3

conn = sqlite3.connect("app/hireassist.db")
c = conn.cursor()

c.execute(
    "UPDATE users SET candidate_id = ? WHERE email = ?",
    (6, "student@hireassist.ai")
)

conn.commit()
conn.close()

print("student linked to candidate 6")
