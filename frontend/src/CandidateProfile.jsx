import React, { useEffect, useState } from "react";
import { getCandidateId } from "./utils/session";
import StudentProgress from "./StudentProgress";
import CandidateAI from "./CandidateAI";
import Card from "./components/Card";
import Spinner from "./components/Spinner";
import { COLORS } from "./theme";

const BACKEND = "http://127.0.0.1:8000";

export default function CandidateProfile() {
  const candidateId = getCandidateId();

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  // -----------------------------
  // GUARD: No Candidate Assigned
  // -----------------------------
  if (!candidateId) {
    return (
      <div style={{ padding: 20 }}>
        <Card style={{ padding: 20, textAlign: "center" }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Profile unavailable</div>
          <div style={{ color: COLORS.muted }}>No candidate assigned to your account yet. Please contact your administrator.</div>
        </Card>
      </div>
    );
  }

  // -----------------------------
  // LOAD PROFILE
  // -----------------------------
  function loadProfile() {
    setLoading(true);
    setError(null);

    fetch(`${BACKEND}/api/candidate/${candidateId}`)
      .then(res => {
        if (!res.ok) throw new Error("Candidate not found");
        return res.json();
      })
      .then(data => {
        setProfile(data);
        setLastUpdated(Date.now());
        setLoading(false);
      })
      .catch(err => {
        setError("We couldn't load the candidate profile at the moment. Please try again.");
        setLoading(false);
      });
  }

  useEffect(() => {
    loadProfile();
  }, [candidateId]);

  // -----------------------------
  // STATES
  // -----------------------------
  if (loading) return (
    <div style={{ padding: 20 }}>
      <Card style={{ padding: 24, textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><span style={{ marginRight: 12 }}><Spinner /></span><div>Loading candidate profile…</div></div>
      </Card>
    </div>
  );

  if (error) return (
    <div style={{ padding: 20 }}>
      <Card style={{ padding: 20, color: COLORS.danger }}>{error}</Card>
    </div>
  );

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <h2 style={{ margin: 0 }}>{profile.name}</h2>
          <div style={{ color: COLORS.muted, fontSize: 13 }}>{lastUpdated ? `Last updated ${new Date(lastUpdated).toLocaleString()}` : ''}</div>
        </div>
      </div>

      <Card style={{ marginTop: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><div style={{ fontSize: 12, color: COLORS.muted }}>Email</div><div style={{ fontWeight: 700 }}>{profile.email}</div></div>
          <div><div style={{ fontSize: 12, color: COLORS.muted }}>Location</div><div style={{ fontWeight: 700 }}>{profile.location}</div></div>
          <div style={{ gridColumn: '1 / -1' }}><div style={{ fontSize: 12, color: COLORS.muted }}>Skills</div><div style={{ fontWeight: 700 }}>{profile.skills?.join(", ") || '—'}</div></div>
          <div><div style={{ fontSize: 12, color: COLORS.muted }}>Status</div><div style={{ fontWeight: 700 }}>{profile.status}</div></div>
          <div><div style={{ fontSize: 12, color: COLORS.muted }}>Score</div><div style={{ fontWeight: 700 }}>{profile.score}</div></div>
        </div>
      </Card>

      {/* 🔥 PHASE 3: PROGRESS TRACKER */}
      <div style={{ marginTop: 18 }}>
        <StudentProgress />
      </div>

      {/* ---------------- AI PANEL ---------------- */}
      <div style={{ marginTop: 18 }}>
        <CandidateAI candidateId={candidateId} />
      </div>
    </div>
  );
}
