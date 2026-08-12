"""
External Caspian Webhook Receiver — push-based event delivery from Caspian gateway.
Use this in production (serverless / hosted) instead of the polling listener.

Register the webhook URL with:
    caspian set_webhook https://your-domain.com/api/v1/webhooks/caspian <secret>
"""
import logging
from fastapi import APIRouter, Request, HTTPException

from caspian_sdk import WebhookVerificationError
from app.communication.listener import get_client, register_handlers
from app.shared.config import settings

logger = logging.getLogger("orbit.webhooks")

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])

# Register handlers once (idempotent — safe to call multiple times)
_handlers_registered = False


def _ensure_handlers_registered():
    global _handlers_registered
    if not _handlers_registered and settings.CASPIAN_API_KEY:
        client = get_client()
        register_handlers(client)
        _handlers_registered = True


@router.post("/caspian")
async def caspian_webhook_handler(request: Request):
    """
    Receive and verify inbound events pushed by the Caspian gateway.
    Dispatches to the same on_message handler as the polling listener.
    """
    body = await request.body()
    headers = dict(request.headers)
    secret = settings.CASPIAN_WEBHOOK_SECRET

    if not settings.CASPIAN_API_KEY:
        logger.warning("CASPIAN_API_KEY not configured — webhook ignored.")
        return {"status": "unconfigured", "detail": "Caspian not yet configured"}

    _ensure_handlers_registered()
    client = get_client()

    if not secret:
        # Dev mode: skip signature verification, log a warning
        logger.warning("CASPIAN_WEBHOOK_SECRET not set — skipping signature verification (dev mode)")
        import json
        try:
            payload = json.loads(body)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid JSON payload")
        return {"status": "received_no_verify", "event_id": payload.get("id")}

    try:
        result = client.handle_webhook(
            body=body,
            headers=headers,
            secret=secret,
        )
        logger.info(
            f"Webhook handled: status={result.status} "
            f"event_id={result.event_id} type={result.event_type}"
        )
        return {
            "status": result.status,
            "event_id": result.event_id,
            "event_type": result.event_type,
        }
    except WebhookVerificationError as e:
        logger.error(f"Webhook signature verification failed: {e}")
        raise HTTPException(status_code=401, detail="Webhook signature verification failed")
    except Exception as e:
        logger.error(f"Webhook processing error: {e}")
        raise HTTPException(status_code=500, detail="Webhook processing error")
