import os
from app.services.pdf_loader import PDFLoader

class StudyLoader:
    @staticmethod
    def load_folder(folder_path: str):
        texts = []
        for file in os.listdir(folder_path):
            path = os.path.join(folder_path, file)
            if file.endswith(".pdf"):
                texts.append(PDFLoader.load(path))
            elif file.endswith(".txt"):
                with open(path, "r", encoding="utf-8") as f:
                    texts.append(f.read())
        return texts
