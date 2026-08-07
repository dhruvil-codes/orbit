"""
Communication Domain - Multi-channel Dispatcher Engine
"""
from app.communication.caspian import CaspianGateway

class OutreachDispatcher:
    def __init__(self):
        self.caspian = CaspianGateway()

    async def dispatch_outreach(self, recipient: str, channel: str, content: str) -> dict:
        """Routes generated outreach through Caspian communication gateway."""
        return await self.caspian.send(recipient, channel, content)
