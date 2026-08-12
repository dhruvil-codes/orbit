"""
Partnerships Domain HTTP Controller
Central business domain controller for Partnership Opportunities.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.db import get_async_session
from app.partnerships.service import PartnershipService

router = APIRouter(prefix="/partnerships", tags=["Partnerships Domain"])


def get_service(session: AsyncSession = Depends(get_async_session)) -> PartnershipService:
    return PartnershipService(session)


@router.get("/opportunities")
async def list_opportunities(service: PartnershipService = Depends(get_service)):
    """List active partnership opportunities."""
    items = await service.list_opportunities()
    return {"items": items}


@router.get("/opportunities/{opportunity_id}")
async def get_opportunity(
    opportunity_id: str,
    service: PartnershipService = Depends(get_service),
):
    """Retrieve details for a specific partnership opportunity."""
    item = await service.get_opportunity(opportunity_id)
    return item
