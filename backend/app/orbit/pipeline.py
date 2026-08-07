"""
Orbit High-Level Pipeline Definition
Stages: Discovery -> Compatibility -> Research -> Communication -> Meeting
"""
from enum import Enum

class PipelineStage(str, Enum):
    DISCOVERED = "discovered"
    EVALUATED = "evaluated"
    RESEARCHED = "researched"
    COMMUNICATED = "communicated"
    MEETING_BOOKED = "meeting_booked"
