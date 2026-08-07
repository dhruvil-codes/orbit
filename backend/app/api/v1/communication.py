"""
Communication Domain HTTP Controller (Caspian & Conversations)
"""
from fastapi import APIRouter, Request
from app.communication.caspian import CaspianGateway

router = APIRouter(prefix="/communication", tags=["Communication"])
gateway = CaspianGateway()

@router.post("/caspian/webhook")
async def caspian_webhook(request: Request):
    """Receives inbound multi-channel events from Caspian."""
    payload = await request.json()
    return {"status": "received", "event_id": payload.get("id")}
