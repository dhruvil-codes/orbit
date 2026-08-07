"""
Insights Domain Schemas
"""
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class StrategicInsightDTO(BaseModel):
    id: str
    opportunity_id: str
    partner_company_name: str
    category: str # integration, co_marketing, gtm, strategy
    title: str
    description: str
    confidence_score: float
    created_at: datetime = datetime.utcnow()
