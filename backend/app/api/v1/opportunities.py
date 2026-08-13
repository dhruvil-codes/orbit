"""
Partnership Opportunity HTTP Endpoints Controller
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.shared.db import get_async_session
from app.partnerships.service import PartnershipService

router = APIRouter(prefix="/opportunities", tags=["Opportunities"])


def get_service(session: AsyncSession = Depends(get_async_session)) -> PartnershipService:
    return PartnershipService(session)


@router.get("/")
async def list_opportunities(service: PartnershipService = Depends(get_service)):
    """List all saved partnership opportunities with scores, stages, and timeline events."""
    items = await service.list_opportunities()
    return {"items": items, "total": len(items)}


@router.get("/{opportunity_id}")
async def get_opportunity(
    opportunity_id: str,
    service: PartnershipService = Depends(get_service)
):
    """Retrieve details for a specific opportunity."""
    item = await service.get_opportunity(opportunity_id)
    if not item:
        raise HTTPException(status_code=404, detail="Partnership Opportunity not found")
    return item


@router.post("/{opportunity_id}/stage")
async def update_opportunity_stage(
    opportunity_id: str,
    stage: str,
    event_note: Optional[str] = None,
    service: PartnershipService = Depends(get_service)
):
    """
    Advance the partnership opportunity stage (e.g. APPROVED, OUTREACH_SENT, PARTNER_REPLIED, MEETING_BOOKED).
    """
    updated = await service.update_opportunity_stage(
        opportunity_id=opportunity_id,
        new_stage=stage,
        event_note=event_note or f"Stage updated to {stage}"
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Partnership Opportunity not found")
    return updated
