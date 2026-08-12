"""
Communication Domain - Caspian SDK Gateway Client
Wraps the real caspian-sdk CommClient for proactive outreach (initiate & send_message).
"""
from caspian_sdk import CommClient
from app.shared.config import settings


def get_caspian_client() -> CommClient:
    """Returns a configured CommClient. Raises RuntimeError if API key not set."""
    if not settings.CASPIAN_API_KEY:
        raise RuntimeError(
            "CASPIAN_API_KEY is not set. Add it to .env. "
            "Get a key at https://www.trycaspianai.com"
        )
    return CommClient(
        api_key=settings.CASPIAN_API_KEY,
        base_url=settings.CASPIAN_BASE_URL,
    )


class CaspianGateway:
    """
    Thin wrapper around caspian-sdk CommClient for Orbit's proactive outreach.

    Lazy-initializes the underlying CommClient on first use so the class
    can be imported safely even without CASPIAN_API_KEY being set.
    """

    def __init__(self):
        self._client: CommClient | None = None

    @property
    def client(self) -> CommClient:
        if self._client is None:
            self._client = get_caspian_client()
        return self._client

    def initiate_outreach(
        self,
        connection_id: str,
        recipient: str,
        text: str,
    ) -> dict:
        """
        Cold-start a new outreach conversation on a connected channel.

        Args:
            connection_id: Caspian connection ID for the channel (email, telegram, etc.)
            recipient: The target address (email address, Telegram username, etc.)
            text: The outreach message body.
        """
        return self.client.initiate(
            connection_id=connection_id,
            recipient=recipient,
            text=text,
        )

    def send_to_conversation(
        self,
        conversation_id: str,
        text: str,
        blocks: list[dict] | None = None,
    ) -> dict:
        """
        Send a message into an existing Caspian conversation.

        Args:
            conversation_id: The Caspian conversation ID.
            text: Plain text fallback message.
            blocks: Optional rich block layout (rendered on Slack/Telegram/email natively).
        """
        return self.client.send_message(
            conversation_id=conversation_id,
            text=text,
            blocks=blocks,
        )

    def reply_to_message(
        self,
        message_id: str,
        text: str,
        blocks: list[dict] | None = None,
    ) -> dict:
        """Reply directly to an inbound message (works on all channels)."""
        return self.client.reply(
            message_id=message_id,
            text=text,
            blocks=blocks,
        )
