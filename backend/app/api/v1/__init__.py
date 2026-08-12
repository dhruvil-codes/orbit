"""
API v1 Router Aggregator
"""
from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.partnerships import router as partnerships_router
from app.api.v1.opportunities import router as opportunities_router
from app.api.v1.discovery import router as discovery_router
from app.api.v1.compatibility import router as compatibility_router
from app.api.v1.communication import router as communication_router
from app.api.v1.graph import router as graph_router
from app.api.v1.webhooks import router as webhooks_router

v1_router = APIRouter()
v1_router.include_router(health_router)
v1_router.include_router(partnerships_router)
v1_router.include_router(opportunities_router)
v1_router.include_router(discovery_router)
v1_router.include_router(compatibility_router)
v1_router.include_router(communication_router)
v1_router.include_router(graph_router)
v1_router.include_router(webhooks_router)
