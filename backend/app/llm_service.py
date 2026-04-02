import os
import openai
import asyncio
import logging


OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    logging.error("OPENAI_API_KEY environment variable is missing. Please set it before starting the app.")
    raise RuntimeError("OPENAI_API_KEY environment variable is missing.")
openai.api_key = OPENAI_API_KEY


class LLMService:
    def __init__(self):
        self.model = "gpt-4"
        self.max_tokens = 1024
        self.temperature = 0.2
        self.timeout = 30
        self.retries = 2

    async def ask_general(self, question: str) -> str:
        system_prompt = (
            "You are a senior computer science mentor and interview coach. STRICTLY follow this format for every answer:\n"
            "Title\n"
            "Short definition paragraph\n\n"
            "Real-world examples:\n"
            "- Example 1\n"
            "- Example 2\n\n"
            "Industry usage:\n"
            "- Use case 1\n"
            "- Use case 2\n\n"
            "Interview tip:\n"
            "One concise interview-ready explanation\n\n"
            "Do NOT use markdown symbols like *, **, or bullet asterisks. Use only plain text headings, line breaks, and clear spacing. Tone must be clear, confident, and professional."
        )
        return await self._generate(system_prompt, question)

    async def ask_with_context(self, question: str, context: str) -> str:
        system_prompt = (
            "You are a senior computer science mentor and interview coach. STRICTLY follow this format for every answer:\n"
            "Title\n"
            "Short definition paragraph\n\n"
            "Real-world examples:\n"
            "- Example 1\n"
            "- Example 2\n\n"
            "Industry usage:\n"
            "- Use case 1\n"
            "- Use case 2\n\n"
            "Interview tip:\n"
            "One concise interview-ready explanation\n\n"
            "Do NOT use markdown symbols like *, **, or bullet asterisks. Use only plain text headings, line breaks, and clear spacing. Tone must be clear, confident, and professional."
        )
        user_prompt = f"Context (optional):\n{context}\n\nQuestion: {question}" if context else question
        return await self._generate(system_prompt, user_prompt)

    async def _generate(self, system_prompt, user_prompt):
        logger = logging.getLogger("llm.service")
        import re
        for attempt in range(self.retries + 1):
            try:
                response = await asyncio.wait_for(
                    openai.ChatCompletion.acreate(
                        model=self.model,
                        messages=[
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt},
                        ],
                        max_tokens=self.max_tokens,
                        temperature=self.temperature,
                    ),
                    timeout=self.timeout,
                )
                answer = response.choices[0].message.content.strip()
                answer = re.sub(r"([*•\-`#]+|\s*\n\s*)", lambda m: "\n" if "\n" in m.group(0) else "", answer)
                answer = re.sub(r"\n{3,}", "\n\n", answer)
                answer = answer.strip()
                return answer
            except asyncio.TimeoutError:
                logger.error("LLMService: OpenAI request timed out (attempt %d).", attempt + 1)
            except Exception as e:
                logger.error(f"LLMService: OpenAI error (attempt {attempt + 1}): {e}", exc_info=True)
        return "Sorry, there was an error generating the answer. Please try again."
