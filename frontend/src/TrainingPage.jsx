import React, { useEffect, useState } from "react";
import { getCandidateId } from "./utils/session";

const BACKEND = "http://127.0.0.1:8000";

export default function TrainingPage() {
  const [programs, setPrograms] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [aiResult, setAiResult] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [error, setError] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);

  const candidateId = getCandidateId();

  // -------------------------
  // LOAD PROGRAMS
  // -------------------------
  async function loadPrograms() {
    const res = await fetch(
      `${BACKEND}/api/training/programs?employer_id=emp-1`
    );
    const data = await res.json();
    setPrograms(data.programs || []);
  }

  // -------------------------
  // LOAD COHORTS
  // -------------------------
  async function loadCohorts() {
    const res = await fetch(`${BACKEND}/api/training/cohorts`);
    const data = await res.json();
    setCohorts(data.cohorts || []);
  }

  // -------------------------
  // AI RECOMMENDATION
  // -------------------------
  async function getAIRecommendation() {
    if (!candidateId) {
      setError("⚠️ Candidate session not found. Upload resume first.");
      return;
    }

    setLoadingAI(true);
    setError(null);
    setAiResult(null);

    try {
      const res = await fetch(`${BACKEND}/api/ai/recommend-training`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate_id: candidateId })
      });

      const data = await res.json();

      if (!res.ok || data.detail) {
        setError(data.detail || "AI service failed");
      } else {
        setAiResult(data);
      }
    } catch {
      setError("Failed to fetch AI recommendation");
    }

    setLoadingAI(false);
  }

  // -------------------------
  // ENROLL
  // -------------------------
  async function enroll(cohortId) {
    if (!candidateId) {
      setActionMsg("Candidate session missing");
      return;
    }

    setActionMsg(null);

    try {
      const res = await fetch(
        `${BACKEND}/api/training/cohorts/${cohortId}/enroll`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ candidate_id: candidateId })
        }
      );

      const data = await res.json();

      if (!res.ok || data.detail) {
        setActionMsg(data.detail || "Enrollment failed");
      } else {
        setActionMsg("✅ Candidate enrolled successfully");
        loadCohorts();
      }
    } catch {
      setActionMsg("Enrollment failed");
    }
  }

  useEffect(() => {
    loadPrograms();
    loadCohorts();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>🎓 Training Dashboard</h2>

      <div style={box}>
        <h3>AI Skill Recommendation</h3>

        <button onClick={getAIRecommendation}>
          Get Recommendations
        </button>

        {loadingAI && <p>Loading AI insights...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {aiResult && (
          <div style={{ marginTop: 16 }}>
            <h4>Candidate: {aiResult.student_name}</h4>

            <p><b>Employability:</b> {aiResult.employability_score}/100</p>
            <p><b>Skill Gaps:</b> {(aiResult.skill_gaps || []).join(", ")}</p>

            <h4>Best Cohort</h4>
            {aiResult.recommended_cohort ? (
              <>
                <p>{aiResult.recommended_cohort.program_title}</p>
                <button
                  onClick={() =>
                    enroll(aiResult.recommended_cohort.cohort_id)
                  }
                >
                  Enroll
                </button>
              </>
            ) : (
              <p>No suitable cohort available</p>
            )}

            {actionMsg && <p>{actionMsg}</p>}
          </div>
        )}
      </div>

      <h3 style={{ marginTop: 30 }}>Programs</h3>
      <ul>
        {programs.map(p => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>

      <h3 style={{ marginTop: 30 }}>Cohorts</h3>
      <ul>
        {cohorts.map(c => (
          <li key={c.id}>
            Cohort #{c.id} — {c.enrolled_count}/{c.seats}
          </li>
        ))}
      </ul>
    </div>
  );
}

const box = {
  border: "1px solid #ccc",
  padding: 16,
  marginTop: 20,
  borderRadius: 6
};
