import sqlite3

db = r"D:\Downloads\hireassist-mvp\backend\app\hireassist.db"
conn = sqlite3.connect(db)
c = conn.cursor()

try:
    c.execute("ALTER TABLE cohorts ADD COLUMN seats INTEGER DEFAULT 20")
    print("✅ seats column added to cohorts")
except Exception as e:
    print("ℹ️ seats column already exists or error:", e)

conn.commit()
conn.close()
