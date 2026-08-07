"""
Discovery Domain HTTP Controller
"""
from fastapi import APIRouter
from app.discovery.service import DiscoveryService

router = APIRouter(prefix="/discovery", tags=["Discovery Engine"])
discovery_service = DiscoveryService()

@router.get("/opportunities")
async def list_discovered_opportunities():
    """Lists discovered partnership opportunities."""
    items = await discovery_service.discover_opportunities()
    return {"items": items}
