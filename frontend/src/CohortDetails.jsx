import React, { useEffect, useState } from "react";
import Loading from "./components/Loading";
import EmptyState from "./components/EmptyState";
import { fetchJSON } from "./utils/api";

export default function CohortDetails({ cohortId }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetchJSON(`/api/training/cohorts/${cohortId}`);
      console.debug('GET /api/training/cohorts/:id', res);
      setDetails(res.error ? null : res.data);
    } catch (e) {
      setDetails(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [cohortId]);

  if (loading) return <div style={{ padding: 12 }}><Loading message="Loading cohort…"/></div>;
  if (!details) return <div style={{ padding: 12 }}><EmptyState title="Cohort not found" description="This cohort may not exist or details are not available."/></div>;

  const learners = details.learners || [];

  return (
    <div style={{ padding: 12 }}>
      <h2>Cohort #{cohortId}</h2>

      <p><b>Program:</b> {details.program_id}</p>
      <p><b>Dates:</b> {details.start_date} → {details.end_date}</p>
      <p><b>Status:</b> {details.status}</p>
      <p><b>Seats:</b> {details.seats}</p>
      <p><b>Enrolled:</b> {details.enrolled_count}</p>

      <h3>Learners</h3>

      {learners.length === 0 ? (
        <div>No learners enrolled yet.</div>
      ) : (
        <ul>
          {learners.map((l) => (
            <li key={l.id}>
              Candidate {l.candidate_id} — Score: {l.assessment_score}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
