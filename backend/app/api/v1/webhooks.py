"""
External Caspian & Partner Webhook Receivers (Thin Controller)
"""
from fastapi import APIRouter, Request

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])

@router.post("/caspian")
async def caspian_webhook_handler(request: Request):
    """Receive inbound messages / events from Caspian communication channel."""
    payload = await request.json()
    return {"status": "received", "event_id": payload.get("id")}
