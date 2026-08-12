"""
Communication Domain - Multi-channel Dispatcher Engine
Routes Orbit's outreach through Caspian SDK (initiate or send_message).
"""
import logging
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

        Args:
            recipient: Target address (email, Telegram handle, Slack user ID, etc.)
            channel: Channel name (e.g. 'email', 'telegram', 'slack')
            content: The message body/proposal to send.
            connection_id: Caspian connection ID — defaults to channel-specific config.
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
    ) -> dict:
        """
        Send internal manager alert via Caspian (Telegram) for human-in-the-loop approval.
        The manager can reply 'APPROVE' or 'REJECT' — picked up by listener.py.
        """
        alert_text = (
            f"🎯 *Orbit AI PDR — Partnership Alert*\n\n"
            f"📋 *Opportunity:* {opportunity_title}\n"
            f"📊 *Compatibility Score:* {compatibility_score:.1f} / 100\n"
            f"🎯 *Confidence Score:* {confidence_score:.1f} / 100\n\n"
            f"*AI Reasoning Summary:*\n"
            f"• Why Now? {reasoning_summary.get('why_now', 'N/A')}\n"
            f"• Outreach Strategy: {reasoning_summary.get('why_this_outreach_strategy', 'N/A')}\n"
            f"• Suggested Action: {reasoning_summary.get('suggested_next_action', 'N/A')}\n\n"
            f"Reply *APPROVE* to dispatch outreach or *REJECT* to skip."
        )

        try:
            result = self.caspian.send_to_conversation(
                conversation_id=conversation_id,
                text=alert_text,
            )
            logger.info(f"📨 Manager alert sent for opportunity: {opportunity_title}")
            return {"status": "alert_sent", "opportunity": opportunity_title, **result}
        except Exception as e:
            logger.error(f"❌ Manager alert failed: {e}")
            return {"status": "error", "error": str(e)}
