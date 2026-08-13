"""
Partnerships Domain Schemas
Central business domain objects and DTOs.
"""
from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime

class PartnerCompanyCreate(BaseModel):
    name: str
    domain: str
    description: Optional[str] = None
    industry: Optional[str] = None

class PartnerCompanyDTO(BaseModel):
    id: str
    name: str
    domain: str
    description: Optional[str] = None
    industry: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class PartnershipOpportunityCreate(BaseModel):
    primary_company_id: str
    partner_company_id: str
    title: str
    compatibility_score: float = 0.0
    status: str = "discovered"
    stage: str = "EVALUATED"
    strategic_fit_summary: Optional[str] = None
    sender_name: Optional[str] = None
    sender_email: Optional[str] = None
    sender_company: Optional[str] = None
    evidence_signals: Optional[Dict[str, Any]] = None
    founder_intel: Optional[Dict[str, Any]] = None
    reasoning_card: Optional[Dict[str, Any]] = None
    outreach_drafts: Optional[Dict[str, Any]] = None
    timeline_events: Optional[List[Dict[str, Any]]] = None

class PartnershipOpportunityDTO(BaseModel):
    id: str
    primary_company_id: str
    partner_company_id: str
    title: str
    compatibility_score: float = 0.0
    status: str = "discovered"
    stage: str = "EVALUATED"
    strategic_fit_summary: Optional[str] = None
    sender_name: Optional[str] = None
    sender_email: Optional[str] = None
    sender_company: Optional[str] = None
    evidence_signals: Optional[Dict[str, Any]] = None
    founder_intel: Optional[Dict[str, Any]] = None
    reasoning_card: Optional[Dict[str, Any]] = None
    outreach_drafts: Optional[Dict[str, Any]] = None
    timeline_events: Optional[List[Dict[str, Any]]] = None
    created_at: datetime
    updated_at: datetime
    primary_company: Optional[PartnerCompanyDTO] = None
    partner_company: Optional[PartnerCompanyDTO] = None

    model_config = ConfigDict(from_attributes=True)
