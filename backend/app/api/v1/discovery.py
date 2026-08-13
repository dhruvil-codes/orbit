"""
Discovery Domain HTTP Controller
Exposes auto-discovery endpoint that identifies top 3 strategic partner opportunities for any SaaS domain.
"""
from fastapi import APIRouter
from pydantic import BaseModel, Field
from app.discovery.service import DiscoveryService

router = APIRouter(prefix="/discovery", tags=["Discovery Engine"])
discovery_service = DiscoveryService()

class DiscoverPartnersRequest(BaseModel):
    domain: str = Field(..., description="User's SaaS website domain (e.g. notion.so)")

@router.post("/discover-partners")
async def discover_top_partners(req: DiscoverPartnersRequest):
    """
    Given a single SaaS website URL, automatically discovers top 3 strategic partner companies.
    """
    partners = await discovery_service.discover_top_partners(req.domain)
    return {"domain": req.domain, "top_partners": partners}
