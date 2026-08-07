"""
Partnerships Domain Schemas
Central business domain objects and DTOs.
"""
from pydantic import BaseModel, ConfigDict
from typing import Optional, List
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
    strategic_fit_summary: Optional[str] = None

class PartnershipOpportunityDTO(BaseModel):
    id: str
    primary_company_id: str
    partner_company_id: str
    title: str
    compatibility_score: float = 0.0
    status: str = "discovered"
    strategic_fit_summary: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    primary_company: Optional[PartnerCompanyDTO] = None
    partner_company: Optional[PartnerCompanyDTO] = None

    model_config = ConfigDict(from_attributes=True)

