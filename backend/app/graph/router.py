"""
Orbit LangGraph Business Edge Router
"""
from app.graph.state import OrbitGraphState

def route_after_evaluation(state: OrbitGraphState) -> str:
    """Routes based on compatibility evaluation score."""
    if state.get("compatibility_score", 0.0) >= 70.0:
        return "communicate_node"
    return "end"

def route_after_negotiation(state: OrbitGraphState) -> str:
    """Routes based on conversation intent."""
    intent = state.get("latest_intent")
    if intent == "interested":
        return "schedule_node"
    elif intent == "question":
        return "communicate_node"
    return "end"
