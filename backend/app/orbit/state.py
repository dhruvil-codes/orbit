"""
Orbit Core Application State Schema
Central state contract linking business domains across the Orbit pipeline.
"""
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from app.compatibility.reasoning import AIReasoningCard
from app.insights.schemas import StrategicInsightDTO

class OrbitCoreState(BaseModel):
    opportunity_id: str
    partner_company: Dict[str, Any]
    research_summary: Optional[Dict[str, Any]] = None
    compatibility_score: float = 0.0
    reasoning_card: Optional[AIReasoningCard] = None
    insights: List[StrategicInsightDTO] = []
    selected_channel: str = "caspian"
    outreach_drafts: Dict[str, str] = {}
    review_required: bool = True
    meeting_details: Optional[Dict[str, Any]] = None
    pipeline_stage: str = "discovered"
