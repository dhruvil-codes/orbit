"""
Orbit FastAPI Application Entry Point
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.v1 import v1_router
from app.shared.db import Base, engine
from app.shared.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: initialize DB schema and perform column auto-migrations on startup."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        cols_to_add = [
            ('stage', 'VARCHAR DEFAULT "EVALUATED"'),
            ('sender_name', 'VARCHAR'),
            ('sender_email', 'VARCHAR'),
            ('sender_company', 'VARCHAR'),
            ('evidence_signals', 'JSON'),
            ('founder_intel', 'JSON'),
            ('reasoning_card', 'JSON'),
            ('outreach_drafts', 'JSON'),
            ('timeline_events', 'JSON'),
        ]
        for col_name, col_type in cols_to_add:
            try:
                await conn.execute(text(f'ALTER TABLE partnership_opportunities ADD COLUMN {col_name} {col_type}'))
            except Exception:
                pass

        try:
            await conn.execute(text('UPDATE partnership_opportunities SET stage = "EVALUATED" WHERE stage IS NULL'))
        except Exception:
            pass
    yield


app = FastAPI(
    title="Orbit AI Partnership Agent API",
    version="0.1.0",
    description="Autonomous AI Partnership Development Representative (AI PDR) powered by Caspian multi-channel communication.",
    lifespan=lifespan,
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all API v1 routes
app.include_router(v1_router, prefix=settings.API_V1_STR)


@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Orbit AI Backend API",
        "version": "0.1.0",
        "channels": ["telegram", "email"],
    }
