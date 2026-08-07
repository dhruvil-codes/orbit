"""
Partnership Opportunity HTTP Endpoints (Thin Controller)
"""
from fastapi import APIRouter

router = APIRouter(prefix="/opportunities", tags=["Opportunities"])

@router.get("/")
async def list_opportunities():
    """List discovered partnership opportunities."""
    return {"items": [], "total": 0}

@router.get("/{opportunity_id}")
async def get_opportunity(opportunity_id: str):
    """Retrieve details for a specific opportunity."""
    return {"id": opportunity_id, "status": "discovered"}
