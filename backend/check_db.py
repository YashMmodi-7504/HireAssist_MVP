import sqlite3

conn = sqlite3.connect("app/hireassist.db")
c = conn.cursor()
print(c.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall())
conn.close()
