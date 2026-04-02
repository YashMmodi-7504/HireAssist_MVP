import sqlite3
from app.db import DB_PATH

conn = sqlite3.connect(DB_PATH)
c = conn.cursor()

c.executemany(
    """
    INSERT INTO candidates (full_name, email, location, resume_text)
    VALUES (?, ?, ?, ?)
    """,
    [
        ("Aman Patel", "aman@edunet.org", "Ahmedabad",
         "Python SQL ETL Snowflake dbt Airflow"),
        ("Riya Shah", "riya@edunet.org", "Surat",
         "Excel SQL Power BI Data Analysis"),
        ("Karan Mehta", "karan@edunet.org", "Vadodara",
         "Python Machine Learning Statistics AWS"),
        ("Neha Verma", "neha@edunet.org", "Remote",
         "Python NLP Deep Learning Communication"),
        ("Rahul Joshi", "rahul@edunet.org", "Mumbai",
         "SQL Tableau Excel Reporting")
    ]
)

conn.commit()
conn.close()

print("✅ 5 candidates inserted successfully")
