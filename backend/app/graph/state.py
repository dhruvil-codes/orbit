"""
Orbit LangGraph State Definition
Defines workflow execution state across Discover -> Understand -> Evaluate steps.
"""
from typing import TypedDict, Optional, Dict, Any

class OrbitGraphState(TypedDict, total=False):
    opportunity_id: Optional[str]
    company_a: Dict[str, Any]
    company_b: Dict[str, Any]
    research_summary: Optional[Dict[str, Any]]
    compatibility_score: Optional[float]
    confidence_score: Optional[float]
    compatibility_result: Optional[Dict[str, Any]]
    reasoning_card: Optional[Dict[str, Any]]
    next_step: Optional[str]
    status: Optional[str]
    error: Optional[str]

