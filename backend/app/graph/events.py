"""
Orbit LangGraph Real-time Streaming Events
"""
from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime

class GraphNodeEvent(BaseModel):
    opportunity_id: str
    node_name: str
    status: str
    payload: Dict[str, Any]
    timestamp: str = datetime.utcnow().isoformat()
