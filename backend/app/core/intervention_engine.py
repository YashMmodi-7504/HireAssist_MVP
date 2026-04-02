# app/core/intervention_engine.py

from typing import Dict, List

DEFAULT_PENDING_DAYS = 0  # backend-safe default


def compute_intervention(decision_intelligence: Dict) -> Dict:
    decision_state = decision_intelligence.get("decision_state")
    confidence = decision_intelligence.get("confidence_level")
    reasons: List[str] = decision_intelligence.get("reason_codes", [])

    intervention = {
        "intervention_required": False,
        "intervention_type": None,
        "priority": None,
        "assigned_role": None,
        "sla_days": None,
        "reason_codes": reasons,
        "accountability": {
            "acknowledgement_required": False,
            "acknowledged": False,
            "pending_days": DEFAULT_PENDING_DAYS,
            "breached": False
        }
    }

    # ----------------------------
    # INTERVENE
    # ----------------------------
    if decision_state == "intervene":
        sla = 7 if confidence != "high" else 5

        intervention.update({
            "intervention_required": True,
            "intervention_type": "trainer_coaching",
            "priority": "P2" if confidence == "medium" else "P1",
            "assigned_role": "trainer",
            "sla_days": sla
        })

        intervention["accountability"].update({
            "acknowledgement_required": True,
            "pending_days": DEFAULT_PENDING_DAYS,
            "breached": False
        })

    # ----------------------------
    # ESCALATE
    # ----------------------------
    elif decision_state == "escalate":
        intervention.update({
            "intervention_required": True,
            "intervention_type": "strategic_review",
            "priority": "P1",
            "assigned_role": "director",
            "sla_days": 3
        })

        intervention["accountability"].update({
            "acknowledgement_required": True,
            "pending_days": DEFAULT_PENDING_DAYS,
            "breached": False
        })

    return intervention
