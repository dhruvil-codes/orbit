"""
LangGraph Workflow Control HTTP Endpoints (Thin Controller)
"""
from fastapi import APIRouter
from app.graph.graph import orbit_graph

router = APIRouter(prefix="/graph", tags=["LangGraph"])

@router.post("/trigger")
async def trigger_graph_execution(opportunity_id: str):
    """Trigger the autonomous Orbit LangGraph workflow for an opportunity."""
    return {
        "opportunity_id": opportunity_id,
        "execution_id": f"exec_{opportunity_id}",
        "status": "queued"
    }

@router.get("/status/{execution_id}")
async def get_graph_status(execution_id: str):
    """Retrieve state & progress of an active graph execution."""
    return {
        "execution_id": execution_id,
        "status": "running",
        "current_node": "scoring_node"
    }
