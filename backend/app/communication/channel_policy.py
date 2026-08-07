"""
Communication Domain - Channel Policy Engine
Decides optimal communication channel (Caspian, Slack, Email) based on context, relationship history, and strategy.
"""
from typing import Dict, Any

class ChannelPolicy:
    def determine_optimal_channel(
        self, partner_company_info: Dict[str, Any], confidence_score: float
    ) -> str:
        """
        Evaluates context, relationship history, and strategy to choose best communication channel.
        Default execution channel: Caspian multi-channel gateway.
        """
        if confidence_score >= 85.0:
            return "caspian"
        elif partner_company_info.get("preferred_channel"):
            return partner_company_info["preferred_channel"]
        return "caspian"
