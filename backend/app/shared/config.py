"""
Orbit Configuration Management Settings
Uses Pydantic BaseSettings to parse & validate environment variables.
"""
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

# Resolve .env from the repo root (3 levels up from app/shared/config.py)
_ENV_FILE = Path(__file__).resolve().parents[3] / ".env"


class Settings(BaseSettings):
    # Application Info
    PROJECT_NAME: str = "Orbit AI Partnership Representative"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Database & Cache (PostgreSQL & Redis)
    DATABASE_URL: str = "sqlite+aiosqlite:///orbit.db"
    REDIS_URL: str = "redis://localhost:6379/0"

    # AI & Inference
    OPENAI_API_KEY: Optional[str] = None
    DEFAULT_LLM_MODEL: str = "gpt-4o-mini"

    # Caspian SDK — Core Gateway
    CASPIAN_API_KEY: Optional[str] = None
    CASPIAN_BASE_URL: str = "https://api.trycaspianai.com"
    CASPIAN_WEBHOOK_SECRET: Optional[str] = None

    # Caspian Channel Connection IDs (set after running: caspian connect <channel>)
    CASPIAN_TELEGRAM_CONNECTION_ID: Optional[str] = None   # for internal manager alerts
    CASPIAN_EMAIL_CONNECTION_ID: Optional[str] = None      # for external partner outreach
    CASPIAN_SLACK_CONNECTION_ID: Optional[str] = None      # optional: Slack outreach
    CASPIAN_DISCORD_CONNECTION_ID: Optional[str] = None    # optional: Discord outreach

    # Orbit Manager Config — who receives partnership approval alerts
    ORBIT_MANAGER_CONVERSATION_ID: Optional[str] = None    # Caspian conversation ID for manager Telegram

    model_config = SettingsConfigDict(
        env_file=str(_ENV_FILE),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()

