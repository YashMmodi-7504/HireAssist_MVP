import sqlite3

db = r"D:\Downloads\hireassist-mvp\backend\app\hireassist.db"
conn = sqlite3.connect(db)
c = conn.cursor()

data = [
    ("Aman Patel", "aman@edunet.org", "Ahmedabad", "Python SQL ETL Snowflake dbt Airflow"),
    ("Riya Shah", "riya@edunet.org", "Surat", "Excel SQL Power BI Data Analysis"),
    ("Karan Mehta", "karan@edunet.org", "Vadodara", "Python Machine Learning Statistics AWS"),
    ("Neha Verma", "neha@edunet.org", "Remote", "Python NLP Deep Learning Communication"),
    ("Rahul Joshi", "rahul@edunet.org", "Mumbai", "SQL Tableau Excel Reporting")
]

c.executemany(
    "INSERT INTO candidates (full_name,email,location,resume_text) VALUES (?,?,?,?)",
    data
)

conn.commit()
conn.close()

print("Candidates seeded successfully")
