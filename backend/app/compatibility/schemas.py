"""
Compatibility Domain Data Schemas
Defines core analysis result structure returned by CompatibilityMatcher.
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from app.compatibility.reasoning import AIReasoningCard

class CompatibilityAnalysisResult(BaseModel):
    compatibility_score: float = Field(..., ge=0.0, le=100.0, description="Compatibility Score (0–100)")
    confidence_score: float = Field(..., ge=0.0, le=100.0, description="Confidence Score (0–100)")
    strategic_fit_summary: str = Field(..., description="High-level strategic fit summary")
    partnership_ideas: List[str] = Field(default_factory=list, description="High-impact partnership ideas")
    integration_opportunities: List[str] = Field(default_factory=list, description="Technical integration points")
    co_marketing_opportunities: List[str] = Field(default_factory=list, description="Joint marketing strategies")
    recommended_outreach_angle: str = Field(..., description="Recommended initial outreach angle")
    reasoning_card: Optional[AIReasoningCard] = Field(default=None, description="Structured AI Reasoning Card")


