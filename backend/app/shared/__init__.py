"""
Shared Domain Package Init
"""
from app.shared.config import settings
from app.shared.db import Base
from app.shared.models import PartnerCompany, PartnershipOpportunity

__all__ = ["settings", "Base", "PartnerCompany", "PartnershipOpportunity"]

