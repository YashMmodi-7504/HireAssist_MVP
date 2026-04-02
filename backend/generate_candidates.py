import sqlite3, random

db = r"D:\Downloads\hireassist-mvp\backend\app\hireassist.db"
conn = sqlite3.connect(db)
c = conn.cursor()

TITLES = [
    "Data Analyst","Data Engineer","ML Engineer",
    "AI Engineer","Business Analyst","Python Developer"
]

LOCATIONS = [
    "Bangalore","Pune","Hyderabad","Chennai",
    "Mumbai","Delhi","Remote"
]

SKILLS = [
    "python","sql","excel","power bi","tableau",
    "etl","dbt","airflow","snowflake",
    "machine learning","statistics",
    "aws","azure","cloud","communication"
]

def summary():
    return "Experienced professional with skills in " + ", ".join(
        random.sample(SKILLS, random.randint(4,8))
    )

for i in range(10000):
    c.execute("""
        INSERT INTO candidates 
        (full_name, title, location, experience_years, summary)
        VALUES (?, ?, ?, ?, ?)
    """, (
        f"Candidate_{i+1}",
        random.choice(TITLES),
        random.choice(LOCATIONS),
        random.randint(0,12),
        summary()
    ))

conn.commit()
conn.close()
print("✅ Inserted 10,000 candidates")
