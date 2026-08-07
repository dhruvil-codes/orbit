"""
Memory Domain - User Strategy Preferences Memory
"""
from typing import Dict, Any

class UserMemory:
    async def get_user_preferences(self) -> Dict[str, Any]:
        """Retrieves user partnership preferences and channel defaults."""
        return {
            "preferred_communication_channel": "caspian",
            "min_score_threshold": 70.0,
            "auto_review_mode": "review"
        }
