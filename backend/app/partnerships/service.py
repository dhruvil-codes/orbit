"""
Partnership Domain Core Service
Central domain manager that orchestrates partnership opportunities.
"""
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from app.partnerships.schemas import (
    PartnerCompanyCreate,
    PartnerCompanyDTO,
    PartnershipOpportunityCreate,
    PartnershipOpportunityDTO,
)
from app.partnerships.repository import PartnershipRepository

class PartnershipService:
    def __init__(self, session: AsyncSession):
        self.repository = PartnershipRepository(session)

    async def get_or_create_company(self, company_in: PartnerCompanyCreate) -> PartnerCompanyDTO:
        return await self.repository.get_or_create_company(company_in)

    async def create_opportunity(self, opp_in: PartnershipOpportunityCreate) -> PartnershipOpportunityDTO:
        return await self.repository.create_opportunity(opp_in)

    async def get_opportunity(self, opportunity_id: str) -> Optional[PartnershipOpportunityDTO]:
        return await self.repository.get_opportunity_by_id(opportunity_id)

    async def list_opportunities(self) -> List[PartnershipOpportunityDTO]:
        return await self.repository.list_opportunities()

    async def update_opportunity_stage(
        self, opportunity_id: str, new_stage: str, event_note: str = ""
    ) -> Optional[PartnershipOpportunityDTO]:
        return await self.repository.update_opportunity_stage(opportunity_id, new_stage, event_note)
