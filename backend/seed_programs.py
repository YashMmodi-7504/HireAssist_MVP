import sqlite3

db = r"D:\Downloads\hireassist-mvp\backend\app\hireassist.db"
conn = sqlite3.connect(db)
c = conn.cursor()

c.execute("DELETE FROM training_programs")

programs = [
    ("emp-1","Data Analytics Bootcamp","Excel to Power BI analytics","online",30,"excel,sql,power bi,data analysis"),
    ("emp-1","Data Engineering Bootcamp","ETL, Snowflake, dbt","online",25,"python,etl,dbt,snowflake,airflow"),
    ("emp-1","AI & ML Foundations","ML + Statistics","online",20,"python,machine learning,statistics"),
]

for p in programs:
    c.execute(
        "INSERT INTO training_programs (employer_id,title,description,mode,seats,skills) VALUES (?,?,?,?,?,?)",
        p
    )

conn.commit()
conn.close()
print("Training programs seeded")
