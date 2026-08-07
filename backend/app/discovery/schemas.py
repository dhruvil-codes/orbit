"""
Discovery Domain Schemas
"""
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class DiscoveredOpportunityDTO(BaseModel):
    id: str
    title: str
    company_name: str
    company_domain: str
    source: str
    discovered_at: datetime = datetime.utcnow()
