"""
Partnerships Domain Package Init
"""
from app.partnerships.service import PartnershipService
from app.partnerships.schemas import PartnershipOpportunityDTO

__all__ = ["PartnershipService", "PartnershipOpportunityDTO"]
