import { useState } from "react";

export default function DirectorWhatIf({ currentRisk }) {
  const [trainerBoost, setTrainerBoost] = useState(0);
  const [skillBoost, setSkillBoost] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const simulate = async () => {
    setLoading(true);
    const res = await fetch("/api/director/what-if", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        current_at_risk_pct: currentRisk,
        trainer_readiness_improvement_pct: trainerBoost,
        skill_gap_reduction_pct: skillBoost
      })
    });

    setResult(await res.json());
    setLoading(false);
  };

  return (
    <div className="mt-6 p-4 border rounded-lg bg-white">
      <h3 className="font-semibold mb-3">What-If Simulator</h3>

      <div className="mb-3">
        <label className="text-xs block">
          Trainer Readiness Improvement ({trainerBoost}%)
        </label>
        <input
          type="range"
          min="0"
          max="30"
          value={trainerBoost}
          onChange={e => setTrainerBoost(+e.target.value)}
          className="w-full"
        />
      </div>

      <div className="mb-3">
        <label className="text-xs block">
          Skill Gap Reduction ({skillBoost}%)
        </label>
        <input
          type="range"
          min="0"
          max="30"
          value={skillBoost}
          onChange={e => setSkillBoost(+e.target.value)}
          className="w-full"
        />
      </div>

      <button
        onClick={simulate}
        disabled={loading}
        className="px-4 py-1 bg-black text-white rounded text-sm"
      >
        {loading ? "Simulating..." : "Simulate"}
      </button>

      {result && (
        <div className="mt-4 text-sm">
          <div>Projected Risk: <b>{result.projected.projected_at_risk_pct}%</b></div>
          <div>Risk Delta: {result.projected.risk_delta}%</div>
          <div>Status: {result.projected.projected_readiness_flag}</div>
        </div>
      )}
    </div>
  );
}
