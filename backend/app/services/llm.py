import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """
You are a senior-level AI tutor and career advisor.
Explain concepts clearly with examples.
If the question is academic, give structured explanations.
If it is resume-related, act like a senior recruiter.
"""

def ask_llm(user_message: str, context: str | None = None) -> str:
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT}
    ]

    if context:
        messages.append({
            "role": "system",
            "content": f"Context information:\n{context}"
        })

    messages.append({"role": "user", "content": user_message})

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=0.4,
        max_tokens=700
    )

    return response.choices[0].message.content.strip()
