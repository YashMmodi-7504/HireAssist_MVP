# app/services/realism_engine.py
import math
from datetime import datetime

def stable_noise(seed: int, scale: float = 1.0):
    """
    Deterministic pseudo-random value based on seed.
    """
    return math.sin(seed * 12.9898) * 43758.5453 % 1 * scale


def readiness_from_score(score: float):
    if score >= 75:
        return "green"
    if score >= 50:
        return "amber"
    return "red"


def fluctuate_score(base: float, entity_id: int):
    drift = stable_noise(entity_id, 8) - 4   # range approx -4 to +4
    return max(0, min(100, round(base + drift, 1)))


def trend(current: float, previous: float):
    if current > previous + 1:
        return "up"
    if current < previous - 1:
        return "down"
    return "stable"
