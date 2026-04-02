import pdfplumber
from typing import List

class PDFLoader:
    """
    Loads and extracts text from PDF files using pdfplumber.
    """
    @staticmethod
    def load(pdf_path: str) -> str:
        with pdfplumber.open(pdf_path) as pdf:
            text = ""
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text.strip()
