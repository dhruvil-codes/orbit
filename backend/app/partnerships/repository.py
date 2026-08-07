"""
Partnerships Domain Repository
Database operations for PartnerCompany and PartnershipOpportunity models.
"""
from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.shared.models import PartnerCompany, PartnershipOpportunity
from app.partnerships.schemas import (
    PartnerCompanyCreate,
    PartnerCompanyDTO,
    PartnershipOpportunityCreate,
    PartnershipOpportunityDTO,
)

class PartnershipRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    # --- PartnerCompany CRUD ---
    async def create_company(self, company_in: PartnerCompanyCreate) -> PartnerCompanyDTO:
        company = PartnerCompany(
            name=company_in.name,
            domain=company_in.domain,
            description=company_in.description,
            industry=company_in.industry,
        )
        self.session.add(company)
        await self.session.commit()
        await self.session.refresh(company)
        return PartnerCompanyDTO.model_validate(company)

    async def get_company_by_id(self, company_id: str) -> Optional[PartnerCompanyDTO]:
        result = await self.session.execute(
            select(PartnerCompany).where(PartnerCompany.id == company_id)
        )
        company = result.scalar_one_or_none()
        return PartnerCompanyDTO.model_validate(company) if company else None

    async def get_company_by_domain(self, domain: str) -> Optional[PartnerCompanyDTO]:
        result = await self.session.execute(
            select(PartnerCompany).where(PartnerCompany.domain == domain)
        )
        company = result.scalar_one_or_none()
        return PartnerCompanyDTO.model_validate(company) if company else None

    async def get_or_create_company(self, company_in: PartnerCompanyCreate) -> PartnerCompanyDTO:
        existing = await self.get_company_by_domain(company_in.domain)
        if existing:
            return existing
        return await self.create_company(company_in)

    # --- PartnershipOpportunity CRUD ---
    async def create_opportunity(self, opp_in: PartnershipOpportunityCreate) -> PartnershipOpportunityDTO:
        opp = PartnershipOpportunity(
            primary_company_id=opp_in.primary_company_id,
            partner_company_id=opp_in.partner_company_id,
            title=opp_in.title,
            compatibility_score=opp_in.compatibility_score,
            status=opp_in.status,
            strategic_fit_summary=opp_in.strategic_fit_summary,
        )
        self.session.add(opp)
        await self.session.commit()
        await self.session.refresh(opp)
        
        # Load relationships for DTO response
        result = await self.session.execute(
            select(PartnershipOpportunity)
            .options(
                selectinload(PartnershipOpportunity.primary_company),
                selectinload(PartnershipOpportunity.partner_company),
            )
            .where(PartnershipOpportunity.id == opp.id)
        )
        full_opp = result.scalar_one()
        return PartnershipOpportunityDTO.model_validate(full_opp)

    async def get_opportunity_by_id(self, opportunity_id: str) -> Optional[PartnershipOpportunityDTO]:
        result = await self.session.execute(
            select(PartnershipOpportunity)
            .options(
                selectinload(PartnershipOpportunity.primary_company),
                selectinload(PartnershipOpportunity.partner_company),
            )
            .where(PartnershipOpportunity.id == opportunity_id)
        )
        opp = result.scalar_one_or_none()
        return PartnershipOpportunityDTO.model_validate(opp) if opp else None

    async def list_opportunities(self, limit: int = 50) -> List[PartnershipOpportunityDTO]:
        result = await self.session.execute(
            select(PartnershipOpportunity)
            .options(
                selectinload(PartnershipOpportunity.primary_company),
                selectinload(PartnershipOpportunity.partner_company),
            )
            .limit(limit)
        )
        opps = result.scalars().all()
        return [PartnershipOpportunityDTO.model_validate(o) for o in opps]

    async def update_opportunity_status(
        self, opportunity_id: str, new_status: str
    ) -> Optional[PartnershipOpportunityDTO]:
        result = await self.session.execute(
            select(PartnershipOpportunity).where(PartnershipOpportunity.id == opportunity_id)
        )
        opp = result.scalar_one_or_none()
        if not opp:
            return None
        opp.status = new_status
        await self.session.commit()
        await self.session.refresh(opp)
        return await self.get_opportunity_by_id(opportunity_id)

