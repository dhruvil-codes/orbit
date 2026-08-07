"""
Memory Domain - Business Context Memory Store
Stores previous conversations, partnership history, user preferences, and company notes.
"""
from typing import Dict, Any, List

class BusinessMemoryStore:
    async def get_company_history(self, company_id: str) -> Dict[str, Any]:
        """Retrieves historical partnership context, notes, and past interactions."""
        return {
            "company_id": company_id,
            "previous_interactions": [],
            "user_preferences": {"preferred_channels": ["caspian", "email"]},
            "notes": "Target company previously engaged at YC Demo Day."
        }
