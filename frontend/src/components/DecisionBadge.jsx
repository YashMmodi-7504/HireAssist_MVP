export default function DecisionBadge({ decision }) {
  if (!decision) return null;

  const styles = {
    monitor: "bg-green-100 text-green-700",
    intervene: "bg-yellow-100 text-yellow-800",
    escalate: "bg-red-100 text-red-700"
  };

  const labels = {
    monitor: "Monitor",
    intervene: "Action Required",
    escalate: "Escalate"
  };

  const cls = styles[decision.decision_state] || styles.monitor;
  const label = labels[decision.decision_state] || "Monitor";

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${cls}`}
      title={`Confidence: ${decision.confidence_level}\nReasons: ${decision.reason_codes.join(", ")}`}
    >
      {label}
    </span>
  );
}
