"""
Communication Domain - Multi-channel Dispatcher Engine
Routes Orbit's outreach through Caspian SDK (initiate or send_message).
"""
import logging
from typing import Optional, Dict, Any
from app.communication.caspian import CaspianGateway
from app.shared.config import settings

logger = logging.getLogger("orbit.dispatcher")


class OutreachDispatcher:
    def __init__(self):
        self.caspian = CaspianGateway()

    async def dispatch_outreach(
        self,
        recipient: str,
        channel: str,
        content: str,
        connection_id: str | None = None,
    ) -> dict:
        """
        Routes generated outreach through Caspian multi-channel gateway.
        """
        conn_id = connection_id or getattr(
            settings, f"CASPIAN_{channel.upper()}_CONNECTION_ID", None
        )

        if not conn_id:
            logger.warning(
                f"No Caspian connection_id found for channel '{channel}'. "
                f"Message to {recipient} not dispatched."
            )
            return {
                "status": "skipped",
                "reason": f"No connection_id configured for channel: {channel}",
                "channel": channel,
                "recipient": recipient,
            }

        try:
            result = self.caspian.initiate_outreach(
                connection_id=conn_id,
                recipient=recipient,
                text=content,
            )
            logger.info(f"✅ Outreach dispatched via {channel} to {recipient}")
            return {"status": "dispatched", "channel": channel, "recipient": recipient, **result}
        except Exception as e:
            logger.error(f"❌ Caspian dispatch failed for {channel}/{recipient}: {e}")
            return {"status": "error", "channel": channel, "recipient": recipient, "error": str(e)}

    async def send_manager_alert(
        self,
        conversation_id: str,
        opportunity_title: str,
        compatibility_score: float,
        confidence_score: float,
        reasoning_summary: dict,
        opportunity_id: str = "",
        recipient_email: str = "",
        proposed_body: str = "",
    ) -> dict:
        """
        Send initial outreach Telegram approval alert to manager via Caspian SDK.
        """
        alert_text = (
            f"🎯 *Orbit AI PDR — Partnership Approval Request*\n\n"
            f"📋 *Opportunity:* {opportunity_title}\n"
            f"🆔 *Opportunity ID:* `{opportunity_id}`\n"
            f"📊 *Compatibility Score:* {compatibility_score:.1f} / 100\n"
            f"🎯 *Confidence Score:* {confidence_score:.1f} / 100\n\n"
            f"*AI Reasoning Summary:*\n"
            f"• Why Now? {reasoning_summary.get('why_now', 'N/A')}\n"
            f"• Strategy: {reasoning_summary.get('why_this_outreach_strategy', 'N/A')}\n"
            f"• Suggested Action: {reasoning_summary.get('suggested_next_action', 'N/A')}\n\n"
            f"✉️ *Proposed Recipient:* `{recipient_email}`\n"
            f"📝 *Proposed Message:* \"{proposed_body[:120]}...\"\n\n"
            f"Reply *APPROVE* to trigger Caspian Email Outreach or *REJECT* to park."
        )

        try:
            if conversation_id:
                result = self.caspian.send_to_conversation(
                    conversation_id=conversation_id,
                    text=alert_text,
                )
            else:
                conn_id = getattr(settings, "CASPIAN_TELEGRAM_CONNECTION_ID", None)
                if not conn_id:
                    logger.warning("No CASPIAN_TELEGRAM_CONNECTION_ID configured.")
                    return {"status": "skipped", "reason": "No Telegram connection ID"}
                result = self.caspian.initiate_outreach(
                    connection_id=conn_id,
                    recipient="@OrbitPDRBot",
                    text=alert_text,
                )
            logger.info(f"📨 Manager alert sent for opportunity: {opportunity_title}")
            return {"status": "alert_sent", "opportunity": opportunity_title, **result}
        except Exception as e:
            logger.error(f"❌ Manager alert failed: {e}")
            return {"status": "error", "error": str(e)}

    async def send_reply_approval_alert(
        self,
        conversation_id: str,
        opportunity_title: str,
        partner_reply_text: str,
        detected_intent: str,
        reply_summary: str,
        recommended_action: str,
        response_draft: str,
        opportunity_id: str = "",
    ) -> dict:
        """
        Send Telegram approval request for partner reply response draft.
        """
        alert_text = (
            f"📩 *Orbit AI PDR — Partner Response Approval Request*\n\n"
            f"📋 *Opportunity:* {opportunity_title}\n"
            f"🆔 *Opportunity ID:* `{opportunity_id}`\n"
            f"🏷️ *Detected Intent:* *{detected_intent}*\n\n"
            f"💬 *Original Partner Reply:*\n\"{partner_reply_text[:140]}\"\n\n"
            f"🧠 *Orbit Recommendation:* {recommended_action}\n"
            f"📝 *Drafted Response:*\n\"{response_draft[:140]}...\"\n\n"
            f"Reply *APPROVE* to dispatch response via Caspian Email or *REJECT* to hold."
        )

        try:
            if conversation_id:
                result = self.caspian.send_to_conversation(
                    conversation_id=conversation_id,
                    text=alert_text,
                )
            else:
                conn_id = getattr(settings, "CASPIAN_TELEGRAM_CONNECTION_ID", None)
                result = self.caspian.initiate_outreach(
                    connection_id=conn_id,
                    recipient="@OrbitPDRBot",
                    text=alert_text,
                )
            logger.info(f"📨 Manager reply approval alert sent for: {opportunity_title}")
            return {"status": "reply_alert_sent", "opportunity": opportunity_title, **result}
        except Exception as e:
            logger.error(f"❌ Reply alert failed: {e}")
            return {"status": "error", "error": str(e)}
