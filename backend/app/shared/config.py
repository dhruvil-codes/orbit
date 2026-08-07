"""
Orbit Configuration Management Settings
Uses Pydantic BaseSettings to parse & validate environment variables.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # Application Info
    PROJECT_NAME: str = "Orbit AI Partnership Representative"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Database & Cache (PostgreSQL & Redis)
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/orbit_db"
    REDIS_URL: str = "redis://localhost:6379/0"

    # API Keys & Third-Party Integrations
    OPENAI_API_KEY: Optional[str] = None
    DEFAULT_LLM_MODEL: str = "gpt-5.5"

    CASPIAN_API_KEY: Optional[str] = None
    CASPIAN_BASE_URL: str = "https://api.caspian.ai/v1"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
