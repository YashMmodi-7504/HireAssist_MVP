import sqlite3

db = r"D:\Downloads\hireassist-mvp\backend\app\hireassist.db"
conn = sqlite3.connect(db)
c = conn.cursor()

c.execute("DELETE FROM cohorts")

c.execute("INSERT INTO cohorts (program_id,start_date,end_date,enrolled_count,status,seats) VALUES (1,'2025-01-10','2025-03-10',0,'planned',30)")
c.execute("INSERT INTO cohorts (program_id,start_date,end_date,enrolled_count,status,seats) VALUES (2,'2025-02-01','2025-04-15',0,'planned',25)")
c.execute("INSERT INTO cohorts (program_id,start_date,end_date,enrolled_count,status,seats) VALUES (3,'2025-03-01','2025-05-30',0,'planned',20)")

conn.commit()
conn.close()
print("Cohorts seeded")
