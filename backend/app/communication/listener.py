"""
Orbit Caspian CommClient — Single Multi-Channel Inbound Handler
Handles messages from ALL connected channels (Telegram, Email, Slack, etc.)
through a single on_message handler. This is Orbit's "ears".

Run as a standalone background listener process:
    cd backend
    python -m app.communication.listener
"""
import logging
from typing import Any, Dict

from caspian_sdk import CommClient, CommError
from app.shared.config import settings
from app.shared.db import AsyncSessionLocal
from app.partnerships.service import PartnershipService
from app.communication.dispatcher import OutreachDispatcher

logger = logging.getLogger("orbit.caspian_listener")
dispatcher = OutreachDispatcher()

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
    if any(kw in text_upper for kw in ["MEETING", "CALL", "SCHEDULE", "CALENDAR", "BOOK"]):
        return "MEETING_REQUEST"
    if "?" in text or any(kw in text_upper for kw in ["HOW", "WHAT", "SPEC", "API"]):
        return "QUESTION"
    if any(kw in text_upper for kw in ["INTERESTED", "SOUNDS GOOD", "GREAT", "PERFECT"]):
        return "INTERESTED"
    return "REPLY"


def generate_reply_intelligence(partner_reply: str, intent: str, company_b: str, sender_name: str, sender_company: str) -> Dict[str, Any]:
    """Generates reply classification, summary, recommendation, and response draft."""
    if intent == "QUESTION" or "?" in partner_reply:
        detected_intent = "QUESTION"
        summary = f"Partner at {company_b} is interested but requested technical integration details."
        recommendation = "Provide API integration POC specs & propose a 15-minute discovery call."
        draft = (
            f"Hi Team,\n\nThanks for reaching out! Regarding technical integration between {sender_company} and {company_b}:\n\n"
            f"1. API Sync: Real-time Webhooks & REST endpoints.\n"
            f"2. Auth: OAuth 2.0 with granular permissions.\n\n"
            f"Would Tuesday at 10 AM PT work for a 15-minute technical walk-through?\n\nBest,\n{sender_name}\n{sender_company}"
        )
    elif intent == "MEETING_REQUEST":
        detected_intent = "MEETING_REQUEST"
        summary = f"Partner at {company_b} requested a meeting to discuss partnership terms."
        recommendation = "Confirm 15-minute technical discovery call and share calendar link."
        draft = (
            f"Hi Team,\n\nFantastic! I'd love to jump on a quick 15-minute call to align on joint GTM timelines.\n\n"
            f"Here is my scheduling link: https://cal.com/{sender_company.lower()}/partnership-intro\n\nLooking forward to speaking!\n\nBest,\n{sender_name}\n{sender_company}"
        )
    elif intent == "INTERESTED":
        detected_intent = "INTERESTED"
        summary = f"Partner at {company_b} expressed positive interest in the partnership proposal."
        recommendation = "Send lightweight 2-page integration brief and suggest initial call."
        draft = (
            f"Hi Team,\n\nGlad to hear you're aligned on the synergy between {sender_company} and {company_b}!\n\n"
            f"I've attached our 2-page developer integration brief. Would next week work for a brief intro call?\n\nBest,\n{sender_name}\n{sender_company}"
        )
    else:
        detected_intent = "NEEDS_MORE_INFORMATION"
        summary = f"Partner at {company_b} replied requesting further context on partnership scope."
        recommendation = "Clarify mutual enterprise customer value proposition."
        draft = (
            f"Hi Team,\n\nThanks for getting back to us. To clarify, our joint integration creates an automated data flow "
            f"between {sender_company} and {company_b}, saving shared enterprise teams 5+ hours weekly.\n\n"
            f"Open to a quick 10-minute overview call next week?\n\nBest,\n{sender_name}\n{sender_company}"
        )

    return {
        "detected_intent": detected_intent,
        "reply_summary": summary,
        "recommended_action": recommendation,
        "response_draft": draft,
        "confidence": 94.0,
    }


# ---------------------------------------------------------------------------
# Handler implementations
# ---------------------------------------------------------------------------
async def _handle_approval(client: CommClient, message_id: str, channel: str) -> None:
    """Handle manager APPROVE signal — update DB opportunity stage & dispatch email via Caspian."""
    logger.info(f"✅ Manager APPROVED via {channel}!")
    
    async with AsyncSessionLocal() as session:
        service = PartnershipService(session)
        opportunities = await service.list_opportunities(limit=10)
        
        # Check for opportunity in RESPONSE_PENDING_APPROVAL or AWAITING_APPROVAL stage
        target_opp = None
        for opp in opportunities:
            if opp.stage in ["RESPONSE_PENDING_APPROVAL", "AWAITING_APPROVAL", "EVALUATED"]:
                target_opp = opp
                break

        if target_opp:
            if target_opp.stage == "RESPONSE_PENDING_APPROVAL":
                # Manager approved the partner reply response draft
                client.reply(
                    message_id=message_id,
                    text=(
                        f"✅ Response Approved! Orbit is updating stage to RESPONSE_SENT and "
                        f"dispatching response email to {target_opp.founder_intel.get('email') if target_opp.founder_intel else 'partner'} via Caspian. 🚀"
                    ),
                )
                await service.update_opportunity_stage(
                    opportunity_id=target_opp.id,
                    new_stage="RESPONSE_SENT",
                    event_note=f"Manager approved response draft on Telegram ({channel})"
                )

                # Dispatch reply response email
                recipient = target_opp.founder_intel.get("email") if target_opp.founder_intel else "partner@company.com"
                body = target_opp.outreach_drafts.get("response_draft") if target_opp.outreach_drafts else "Thank you for your response."
                await dispatcher.dispatch_outreach(recipient=recipient, channel="email", content=body)
                logger.info(f"✅ Partner response email dispatched to {recipient}")

            else:
                # Manager approved initial outreach proposal
                client.reply(
                    message_id=message_id,
                    text=(
                        f"✅ Outreach Approved! Orbit is updating stage to APPROVED and "
                        f"dispatching initial proposal email to {target_opp.founder_intel.get('email') if target_opp.founder_intel else 'partner'} via Caspian. 🚀"
                    ),
                )
                await service.update_opportunity_stage(
                    opportunity_id=target_opp.id,
                    new_stage="APPROVED",
                    event_note=f"Manager approved initial outreach proposal on Telegram ({channel})"
                )

                recipient = target_opp.founder_intel.get("email") if target_opp.founder_intel else "partner@company.com"
                body = target_opp.outreach_drafts.get("email_body") if target_opp.outreach_drafts else f"Partnership Proposal for {target_opp.title}"
                dispatch_res = await dispatcher.dispatch_outreach(recipient=recipient, channel="email", content=body)

                await service.update_opportunity_stage(
                    opportunity_id=target_opp.id,
                    new_stage="OUTREACH_SENT",
                    event_note=f"Caspian Email proposal delivered to {recipient} (Status: {dispatch_res.get('status')})"
                )
                logger.info(f"✅ Partnership proposal email sent to {recipient}")


async def _handle_partner_reply(
    client: CommClient, message_id: str, channel: str, text: str
) -> None:
    """Handle inbound partner email reply — run reply intelligence and trigger Telegram approval."""
    logger.info(f"[{channel}] Partner reply received: {text[:80]}")
    
    # Acknowledge partner
    client.reply(
        message_id=message_id,
        text="Thanks for getting back to us! Our Orbit AI PDR has logged your response and notified our partnership team. 🚀",
    )

    async with AsyncSessionLocal() as session:
        service = PartnershipService(session)
        opportunities = await service.list_opportunities(limit=10)
        
        # Find active opportunity in OUTREACH_SENT or PARTNER_REPLIED
        target_opp = None
        for opp in opportunities:
            if opp.stage in ["OUTREACH_SENT", "APPROVED", "AWAITING_APPROVAL"]:
                target_opp = opp
                break

        if target_opp:
            # 1. Classify intent & generate response draft
            intent = classify_intent(text)
            company_b = target_opp.partner_company.name if target_opp.partner_company else "Partner"
            sender_name = target_opp.sender_name or "Partnership Manager"
            sender_company = target_opp.sender_company or "Orbit AI"

            reply_intel = generate_reply_intelligence(text, intent, company_b, sender_name, sender_company)

            # 2. Store outreach response draft in opportunity DTO
            drafts = dict(target_opp.outreach_drafts or {})
            drafts["last_partner_reply"] = text
            drafts["detected_intent"] = reply_intel["detected_intent"]
            drafts["reply_summary"] = reply_intel["reply_summary"]
            drafts["response_draft"] = reply_intel["response_draft"]

            # 3. Update DB Stage to PARTNER_REPLIED -> RESPONSE_PENDING_APPROVAL
            await service.update_opportunity_stage(
                opportunity_id=target_opp.id,
                new_stage="PARTNER_REPLIED",
                event_note=f"Partner email reply received via Caspian: '{text[:60]}...'"
            )
            await service.update_opportunity_stage(
                opportunity_id=target_opp.id,
                new_stage="RESPONSE_PENDING_APPROVAL",
                event_note=f"Reply classified as {reply_intel['detected_intent']}; response draft generated and awaiting Telegram manager approval"
            )

            # 4. Trigger Telegram Approval Request to Manager via Caspian SDK
            await dispatcher.send_reply_approval_alert(
                conversation_id="",
                opportunity_title=target_opp.title,
                partner_reply_text=text,
                detected_intent=reply_intel["detected_intent"],
                reply_summary=reply_intel["reply_summary"],
                recommended_action=reply_intel["recommended_action"],
                response_draft=reply_intel["response_draft"],
                opportunity_id=target_opp.id,
            )
            logger.info(f"📨 Telegram reply approval alert sent for opportunity {target_opp.id}")


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
                text="✅ Understood. Action parked. No outreach dispatched.",
            )
            logger.info(f"Action REJECTED by manager on {channel}")

        else:
            await _handle_partner_reply(client, message_id, channel, text)


# ---------------------------------------------------------------------------
# Entrypoint: run as background listener
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
