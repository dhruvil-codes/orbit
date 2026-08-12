"""
Communication Domain HTTP Controller (Caspian & Conversations)
"""
from fastapi import APIRouter, Request
from app.communication.dispatcher import OutreachDispatcher

router = APIRouter(prefix="/communication", tags=["Communication"])


@router.post("/caspian/webhook")
async def caspian_webhook(request: Request):
    """Receives inbound multi-channel events from Caspian (legacy — use /webhooks/caspian)."""
    payload = await request.json()
    return {"status": "received", "event_id": payload.get("id")}


@router.post("/outreach/dispatch")
async def dispatch_outreach(
    recipient: str,
    channel: str,
    content: str,
    connection_id: str | None = None,
):
    """
    Dispatch a partnership outreach message via Caspian to a given recipient.
    Requires CASPIAN_API_KEY and a CASPIAN_{CHANNEL}_CONNECTION_ID to be configured.
    """
    dispatcher = OutreachDispatcher()
    result = await dispatcher.dispatch_outreach(
        recipient=recipient,
        channel=channel,
        content=content,
        connection_id=connection_id,
    )
    return result
