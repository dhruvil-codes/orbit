"""
Orbit Graph Types & Business Action Enums
"""
from enum import Enum

class StepName(str, Enum):
    DISCOVER = "discover_node"
    UNDERSTAND = "understand_node"
    EVALUATE = "evaluate_node"
    COMMUNICATE = "communicate_node"
    NEGOTIATE = "negotiate_node"
    SCHEDULE = "schedule_node"
