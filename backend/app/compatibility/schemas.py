"""
Compatibility Domain Data Schemas
Defines core analysis result structure returned by CompatibilityMatcher.
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from app.compatibility.reasoning import AIReasoningCard

class CompanyInput(BaseModel):
    name: str = Field(..., description="Company name (e.g. Notion)")
    domain: str = Field(..., description="Company domain (e.g. notion.so)")
    industry: Optional[str] = Field(default="SaaS", description="Industry segment")
    description: Optional[str] = Field(default="", description="Company description")

class EvaluatePartnershipRequest(BaseModel):
    company_a: CompanyInput
    company_b: CompanyInput
    dispatch_outreach: bool = Field(default=False, description="Whether to dispatch Caspian outreach if score > 80")
    sender_name: Optional[str] = Field(default="Partnership Manager", description="User's explicit sender name")
    sender_email: Optional[str] = Field(default="partnerships@useorbit.ai", description="User's explicit sender email")
    sender_company: Optional[str] = Field(default="Orbit AI", description="User's explicit company name")

class OutreachDrafts(BaseModel):
    email_subject: str = Field(..., description="Email proposal subject line")
    email_body: str = Field(..., description="Formatted email outreach proposal")
    telegram_alert: str = Field(..., description="Interactive Telegram manager approval alert")
    slack_announcement: str = Field(..., description="Slack channel team message preview")

class FounderIntel(BaseModel):
    executive_name: str
    executive_role: str
    email: str
    email_verified: bool
    platforms: Dict[str, Any]

class CompatibilityAnalysisResult(BaseModel):
    compatibility_score: float = Field(..., ge=0.0, le=100.0, description="Compatibility Score (0–100)")
    confidence_score: float = Field(..., ge=0.0, le=100.0, description="Confidence Score (0–100)")
    strategic_fit_summary: str = Field(..., description="High-level strategic fit summary")
    partnership_ideas: List[str] = Field(default_factory=list, description="High-impact partnership ideas")
    integration_opportunities: List[str] = Field(default_factory=list, description="Technical integration points")
    co_marketing_opportunities: List[str] = Field(default_factory=list, description="Joint marketing strategies")
    recommended_outreach_angle: str = Field(..., description="Recommended initial outreach angle")
    reasoning_card: Optional[AIReasoningCard] = Field(default=None, description="Structured AI Reasoning Card")
    outreach_drafts: Optional[OutreachDrafts] = Field(default=None, description="Multi-channel outreach message previews")
    founder_intel: Optional[FounderIntel] = Field(default=None, description="Decision maker and founder intelligence")
