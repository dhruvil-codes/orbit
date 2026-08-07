"""
Health & Liveness Endpoint
"""
from fastapi import APIRouter

router = APIRouter()

@router.get("/health", tags=["Health"])
async def check_health():
    return {
        "status": "healthy",
        "service": "Orbit Backend API",
        "version": "0.1.0"
    }
