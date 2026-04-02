import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from .db import get_conn

VECTORIZER = None
CAND_IDS = []
CAND_TEXTS = []

def build_index():
    global VECTORIZER, CAND_IDS, CAND_TEXTS
    conn = get_conn()
    c = conn.cursor()
    rows = c.execute('SELECT id, resume_text FROM candidates').fetchall()
    CAND_IDS = [r[0] for r in rows]
    CAND_TEXTS = [r[1] for r in rows]
    if CAND_TEXTS:
        VECTORIZER = TfidfVectorizer().fit(CAND_TEXTS)
    conn.close()

def search(query, top_k=5):
    if VECTORIZER is None:
        build_index()
    if not CAND_TEXTS:
        return []
    qv = VECTORIZER.transform([query])
    X = VECTORIZER.transform(CAND_TEXTS)
    sims = (X @ qv.T).toarray().ravel()
    idx = np.argsort(-sims)[:top_k]
    results = []
    conn = get_conn()
    c = conn.cursor()
    for i in idx:
        score = float(sims[i])
        if score <= 0:
            continue
        cid = CAND_IDS[i]
        r = c.execute('SELECT id,full_name,location,resume_text FROM candidates WHERE id=?', (cid,)).fetchone()
        results.append({
            'id': r[0],
            'full_name': r[1],
            'location': r[2],
            'summary': (r[3][:240] + '...') if len(r[3])>240 else r[3],
            'score': round(score, 4)
        })
    conn.close()
    return results
