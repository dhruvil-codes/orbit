"""
Shared Database Connectivity & ORM Declarative Base
"""
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.shared.config import settings

class Base(DeclarativeBase):
    pass

# Determine database URL
db_url = settings.DATABASE_URL
if "postgresql" in db_url and not os.getenv("POSTGRES_LIVE"):
    try:
        import aiosqlite
        db_url = "sqlite+aiosqlite:///./orbit.db"
    except ImportError:
        db_url = "sqlite:///./orbit.db"

# Create async engine if supported, otherwise standard engine configuration
try:
    engine = create_async_engine(db_url, echo=False)
    AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
except Exception:
    # Fallback in-memory / sync compatible configuration
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_db():
    """Dependency for providing database sessions."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


