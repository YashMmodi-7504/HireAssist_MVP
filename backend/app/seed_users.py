import sqlite3
from passlib.context import CryptContext

DB = r"D:/Downloads/hireassist-mvp/backend/app/hireassist.db"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

users = [
    {
        "name": "Modi Yash Dipeshkumar",
        "email": "student@hireassist.ai",
        "role": "student",
        "password": "student123"
    },
    {
        "name": "Admin User",
        "email": "admin@hireassist.ai",
        "role": "admin",
        "password": "admin123"
    }
]

def run():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    for user in users:
        password_hash = pwd_context.hash(user["password"])
        c.execute("""
            INSERT INTO users (name, email, role, password_hash)
            VALUES (?, ?, ?, ?)
        """, (user["name"], user["email"], user["role"], password_hash))
    conn.commit()
    conn.close()
    print("✅ Users seeded successfully.")

if __name__ == "__main__":
    run()
