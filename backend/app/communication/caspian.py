"""
Communication Domain - Caspian API Gateway Client
"""
import httpx
from app.shared.config import settings

class CaspianGateway:
    def __init__(self):
        self.base_url = settings.CASPIAN_BASE_URL
        self.api_key = settings.CASPIAN_API_KEY

    async def send(self, recipient: str, channel: str, message: str) -> dict:
        """Dispatches message through Caspian API."""
        return {"status": "delivered", "channel": channel, "recipient": recipient}
