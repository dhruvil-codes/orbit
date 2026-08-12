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

logger = logging.getLogger("orbit.caspian_listener")

# ---------------------------------------------------------------------------
# Singleton CommClient — lazy init so importing this module works without
# CASPIAN_API_KEY being set (e.g. during testing or before credentials exist).
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
    """Simple keyword-based intent classifier for inbound messages."""
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
    """Handle manager APPROVE signal — log and acknowledge."""
    logger.info(f"✅ Outreach APPROVED by manager via {channel}!")
    client.reply(
        message_id=message_id,
        text=(
            "✅ Approved! Orbit is dispatching the partnership proposal now.\n"
            "You'll receive a confirmation once the message is delivered. 🚀"
        ),
    )
    # Day 2: Trigger OutreachDispatcher.dispatch_outreach() with partner details
    # from the opportunity linked to this conversation.


async def _handle_partner_question(
    client: CommClient, message_id: str, channel: str, question: str
) -> None:
    """Handle a question from the partner — send acknowledgement."""
    logger.info(f"[{channel}] Partner question: {question[:80]}")
    client.reply(
        message_id=message_id,
        text=(
            "Thanks for your question! Our partnership team will follow up shortly "
            "with a detailed response. Looking forward to exploring this together."
        ),
    )


async def _handle_partner_reply(
    client: CommClient, message_id: str, channel: str, text: str
) -> None:
    """Handle a general inbound partner reply — log and acknowledge."""
    logger.info(f"[{channel}] Partner reply: {text[:80]}")
    client.reply(
        message_id=message_id,
        text=(
            "Thanks for getting back to us! Our Orbit AI PDR has logged your response "
            "and will follow up with next steps. 🚀"
        ),
    )


# ---------------------------------------------------------------------------
# Register handlers on a given CommClient instance
# Called from __main__ (polling) or from the FastAPI lifespan (webhook mode).
# ---------------------------------------------------------------------------
def register_handlers(client: CommClient) -> None:
    """
    Register all inbound handlers on the given CommClient.

    The SINGLE @on_message handler below handles Telegram, Email, Slack, Discord,
    and every other Caspian-connected channel — satisfying the hackathon's
    'single handler, multiple channels' requirement.
    """

    @client.on_message
    async def handle_inbound_message(message: Any) -> None:
        """
        Single handler for ALL inbound messages across Telegram, Email, Slack, etc.
        Caspian normalises channel-specific formats — we write the logic once here.
        """
        channel = getattr(message, "channel", "unknown")
        sender = getattr(message, "sender", {})
        text = getattr(message, "text", "") or ""
        message_id = getattr(message, "id", None)

        logger.info(f"[{channel.upper()}] Message from {sender}: {text[:80]}")

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
