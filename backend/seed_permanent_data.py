import sqlite3
import random

DB = r"D:\Downloads\hireassist-mvp\backend\app\hireassist.db"

SKILLS = [
    "python", "sql", "excel", "power bi", "tableau",
    "aws", "azure", "machine learning",
    "statistics", "communication",
    "etl", "airflow", "dbt", "snowflake"
]

COLLEGES = [
    "IIT Bombay",
    "NIT Surat",
    "GTU College",
    "LD Engineering",
    "Tier-3 College"
]

LOCATIONS = ["Ahmedabad", "Surat", "Mumbai", "Pune", "Bangalore"]

NAMES = ["Aman", "Rohit", "Neha", "Priya", "Kunal", "Anjali", "Rahul", "Sneha"]


def get_columns(cursor):
    cols = cursor.execute("PRAGMA table_info(candidates)").fetchall()
    return {c[1] for c in cols}


def already_seeded(cursor):
    count = cursor.execute("SELECT COUNT(*) FROM candidates").fetchone()[0]
    return count >= 10000


def run():
    conn = sqlite3.connect(DB)
    c = conn.cursor()

    columns = get_columns(c)

    if already_seeded(c):
        print("✅ Permanent dataset already exists. Skipping seeding.")
        conn.close()
        return

    print("🚀 Seeding 10,000 permanent candidates (schema-aware)...")

    for i in range(10000):
        name = random.choice(NAMES) + " " + chr(65 + i % 26) + " Patel"
        skills = random.sample(SKILLS, random.randint(3, 6))
        text_blob = f"Experienced in {', '.join(skills)}."

        data = {
            "full_name": name,
            "location": random.choice(LOCATIONS),
            "college_name": random.choice(COLLEGES),
            "assessment_score": random.randint(50, 95),
            "placement_status": "placed" if random.random() > 0.55 else "not_placed",
            "summary": text_blob,
            "resume_text": text_blob
        }

        insert_cols = [k for k in data if k in columns]
        values = [data[k] for k in insert_cols]

        sql = f"""
            INSERT INTO candidates ({", ".join(insert_cols)})
            VALUES ({", ".join("?" for _ in insert_cols)})
        """

        c.execute(sql, values)

    conn.commit()
    conn.close()
    print("✅ Permanent dataset seeded successfully.")


if __name__ == "__main__":
    run()
