export default function InterventionCard({ intervention }) {
  if (!intervention || !intervention.intervention_required) return null;

  const acc = intervention.accountability || {};

  return (
    <div className="mt-3 p-3 border rounded-lg bg-gray-50">
      <div className="flex justify-between items-center">
        <div className="font-semibold text-sm">
          {intervention.intervention_type.replace("_", " ").toUpperCase()}
        </div>
        <span className="text-xs text-gray-600">
          Priority {intervention.priority}
        </span>
      </div>

      <div className="text-xs text-gray-700 mt-1">
        Assigned to <b>{intervention.assigned_role}</b> · SLA {intervention.sla_days} days
      </div>

      {acc.acknowledgement_required && (
        <div className="mt-2 text-xs">
          ⏳ Pending <b>{acc.pending_days}</b> days
          {acc.breached && (
            <span className="ml-2 text-red-600 font-semibold">
              SLA Breached
            </span>
          )}
        </div>
      )}
    </div>
  );
}
