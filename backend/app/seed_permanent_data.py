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

def already_seeded(conn):
    c = conn.cursor()
    count = c.execute("SELECT COUNT(*) FROM candidates").fetchone()[0]
    return count >= 10000


def run():
    conn = sqlite3.connect(DB)
    c = conn.cursor()

    if already_seeded(conn):
        print("✅ Permanent dataset already exists. Skipping seeding.")
        conn.close()
        return

    print("🚀 Seeding 10,000 permanent candidates...")

    for i in range(10000):
        name = random.choice(NAMES) + " " + chr(65 + i % 26) + " Patel"
        skills = random.sample(SKILLS, random.randint(3, 6))
        summary = f"Skilled in {', '.join(skills)}. Strong analytical background."

        c.execute("""
            INSERT INTO candidates (
                full_name, location, summary, college_name,
                assessment_score, placement_status
            )
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            name,
            random.choice(LOCATIONS),
            summary,
            random.choice(COLLEGES),
            random.randint(50, 95),
            "placed" if random.random() > 0.55 else "not_placed"
        ))

    conn.commit()
    conn.close()
    print("✅ Permanent dataset seeded successfully.")


if __name__ == "__main__":
    run()
