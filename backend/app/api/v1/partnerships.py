"""
Partnerships Domain HTTP Controller
Central business domain controller for Partnership Opportunities.
"""
from fastapi import APIRouter
from app.partnerships.service import PartnershipService

router = APIRouter(prefix="/partnerships", tags=["Partnerships Domain"])
service = PartnershipService()

@router.get("/opportunities")
async def list_opportunities():
    """List active partnership opportunities."""
    items = await service.list_active_opportunities()
    return {"items": items}

@router.get("/opportunities/{opportunity_id}")
async def get_opportunity(opportunity_id: str):
    """Retrieve details for a specific partnership opportunity."""
    item = await service.get_opportunity(opportunity_id)
    return item
