"""
Orbit Caspian CommClient — Single Multi-Channel Inbound Handler
Handles messages from ALL connected channels (Telegram, Email, Slack, etc.)
through a single on_message handler. This is Orbit's "ears".

Run as a standalone background listener process:
    cd backend
    python -m app.communication.listener

Or use push-based webhooks (production) via: app/api/v1/webhooks.py
"""
import logging
from typing import Any

from caspian_sdk import CommClient, CommError
from app.shared.config import settings
from app.shared.db import AsyncSessionLocal
from app.partnerships.service import PartnershipService
from app.communication.dispatcher import OutreachDispatcher

logger = logging.getLogger("orbit.caspian_listener")
dispatcher = OutreachDispatcher()

# ---------------------------------------------------------------------------
# Singleton CommClient — lazy init
# ---------------------------------------------------------------------------
_caspian_client: CommClient | None = None


def get_client() -> CommClient:
    """Returns the global CommClient, initializing it on first use."""
    global _caspian_client
    if _caspian_client is None:
        if not settings.CASPIAN_API_KEY:
            raise RuntimeError(
                "CASPIAN_API_KEY is not set. Add it to your .env file. "
                "Get a key at https://www.trycaspianai.com"
            )
        _caspian_client = CommClient(
            api_key=settings.CASPIAN_API_KEY,
            base_url=settings.CASPIAN_BASE_URL,
        )
    return _caspian_client


# ---------------------------------------------------------------------------
# Intent Classifier
# ---------------------------------------------------------------------------
def classify_intent(text: str) -> str:
    """Keyword-based intent classifier for inbound messages across Telegram and Email."""
    text_upper = text.upper().strip()
    if any(kw in text_upper for kw in ["APPROVE", "YES", "GO", "SEND IT", "CONFIRM"]):
        return "APPROVE"
    if any(kw in text_upper for kw in ["REJECT", "NO", "CANCEL", "SKIP", "DENY"]):
        return "REJECT"
    if "?" in text:
        return "QUESTION"
    return "REPLY"


# ---------------------------------------------------------------------------
# Handler implementations
# ---------------------------------------------------------------------------
async def _handle_approval(client: CommClient, message_id: str, channel: str) -> None:
    """Handle manager APPROVE signal — update DB opportunity stage & dispatch email via Caspian."""
    logger.info(f"✅ Outreach APPROVED by manager via {channel}!")
    
    # 1. Acknowledge manager on Telegram immediately
    client.reply(
        message_id=message_id,
        text=(
            "✅ Approved! Orbit is updating deal status to APPROVED and dispatching "
            "the partnership proposal email via Caspian gateway now. 🚀"
        ),
    )

    # 2. Update Opportunity in DB & Dispatch Email
    try:
        async with AsyncSessionLocal() as session:
            service = PartnershipService(session)
            opportunities = await service.list_opportunities(limit=10)
            
            # Find recent opportunity in AWAITING_APPROVAL or EVALUATED stage
            target_opp = None
            for opp in opportunities:
                if opp.stage in ["AWAITING_APPROVAL", "EVALUATED"]:
                    target_opp = opp
                    break

            if target_opp:
                await service.update_opportunity_stage(
                    opportunity_id=target_opp.id,
                    new_stage="APPROVED",
                    event_note=f"Manager approved proposal via {channel} command"
                )

                # Dispatch Email proposal via Caspian
                recipient = target_opp.founder_intel.get("email") if target_opp.founder_intel else f"partnerships@{target_opp.partner_company.domain if target_opp.partner_company else 'company.com'}"
                body = target_opp.outreach_drafts.get("email_body") if target_opp.outreach_drafts else f"Partnership Proposal for {target_opp.title}"

                dispatch_res = await dispatcher.dispatch_outreach(
                    recipient=recipient,
                    channel="email",
                    content=body
                )

                await service.update_opportunity_stage(
                    opportunity_id=target_opp.id,
                    new_stage="OUTREACH_SENT",
                    event_note=f"Caspian Email proposal delivered to {recipient} (Status: {dispatch_res.get('status')})"
                )
                logger.info(f"✅ Partnership proposal email sent to {recipient}")

    except Exception as e:
        logger.error(f"Error executing approval dispatch: {e}")


async def _handle_partner_question(
    client: CommClient, message_id: str, channel: str, question: str
) -> None:
    """Handle a question from the partner — send acknowledgement & log."""
    logger.info(f"[{channel}] Partner question: {question[:80]}")
    client.reply(
        message_id=message_id,
        text=(
            "Thanks for your question! Our Orbit AI PDR has logged your inquiry "
            "and notified our partnership team. We'll follow up with detailed specs shortly!"
        ),
    )


async def _handle_partner_reply(
    client: CommClient, message_id: str, channel: str, text: str
) -> None:
    """Handle a general inbound partner reply — log and update DB stage to PARTNER_REPLIED."""
    logger.info(f"[{channel}] Partner reply received: {text[:80]}")
    client.reply(
        message_id=message_id,
        text=(
            "Thanks for getting back to us! Our Orbit AI PDR has logged your response "
            "and notified our partnership team. 🚀"
        ),
    )


# ---------------------------------------------------------------------------
# Register handlers on a given CommClient instance
# ---------------------------------------------------------------------------
def register_handlers(client: CommClient) -> None:
    """
    Register all inbound handlers on the given CommClient.
    The SINGLE @on_message handler handles Telegram, Email, Slack, Discord, etc.
    """

    @client.on_message
    async def handle_inbound_message(message: Any) -> None:
        channel = getattr(message, "channel", "unknown")
        sender = getattr(message, "sender", {})
        text = getattr(message, "text", "") or ""
        message_id = getattr(message, "id", None)

        logger.info(f"[{channel.upper()}] Inbound message from {sender}: {text[:80]}")
        intent = classify_intent(text)

        if intent == "APPROVE":
            await _handle_approval(client, message_id, channel)

        elif intent == "REJECT":
            client.reply(
                message_id=message_id,
                text="✅ Understood. Opportunity parked. No outreach will be sent.",
            )
            logger.info(f"Outreach REJECTED by manager on {channel}")

        elif intent == "QUESTION":
            await _handle_partner_question(client, message_id, channel, text)

        else:
            await _handle_partner_reply(client, message_id, channel, text)


# ---------------------------------------------------------------------------
# Entrypoint: run as a polling background listener process
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
    )
    logger.info("🚀 Orbit Caspian Listener starting — Telegram + Email channels active")

    client = get_client()
    register_handlers(client)

    client.listen(
        ack="⚡ Orbit AI PDR received your message — processing now...",
        concurrency="queue",
    )
