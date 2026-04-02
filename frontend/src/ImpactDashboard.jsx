import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import AppLayout from "./layouts/AppLayout";
import KPI from "./components/KPI";

const BACKEND = "http://127.0.0.1:8000";

export default function ImpactDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${BACKEND}/api/admin/metrics`)
      .then(res => res.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  if (!data) {
    return <p>Loading impact metrics...</p>;
  }

  const programData = (data?.program_popularity || []).map(p => ({
    name: p.program,
    value: p.cohorts
  }));

  const skillGapData = (data?.skill_gap_demand || []).map(([skill, count]) => ({
    name: skill.toUpperCase(),
    value: count
  }));

  // DEBUG
  console.log && console.log('ImpactDashboard data:', data);

  return (
    <AppLayout role="director" active="/director">
      <div style={{ padding: 30 }}>
        <h2>📊 Director Impact Dashboard</h2>
        <p>Strategic overview of training & placement outcomes</p>

        {/* KPI CARDS */}
        <div style={styles.kpiGrid}>
          <KPI label="Learners Trained" value={data.learners_trained} />
          <KPI label="Placements" value={data.placements} />
          <KPI label="Avg Assessment Score" value={data.avg_assessment_score} />
        </div>

      {/* PROGRAM POPULARITY */}
      <section style={styles.section}>
        <h3>Program Popularity</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={programData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* SKILL GAP DEMAND */}
      <section style={styles.section}>
        <h3>Top Skill Gaps (Market Demand)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={skillGapData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
    </AppLayout>
  );
}

/* ================= COMPONENTS ================= */



/* ================= STYLES ================= */

const styles = {
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 20,
    marginTop: 20,
    marginBottom: 40
  },
  kpiCard: {
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    padding: 24,
    background: "#ffffff"
  },
  kpiTitle: {
    fontSize: 14,
    color: "#6b7280"
  },
  kpiValue: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 10
  },
  section: {
    marginBottom: 50
  }
};
