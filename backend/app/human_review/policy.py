"""
Human Review Domain - Policy & Collaborative Workflow Modes
Execution Modes: MANUAL, REVIEW, AUTONOMOUS
"""
from enum import Enum
from pydantic import BaseModel
from typing import Optional

class ReviewMode(str, Enum):
    MANUAL = "manual"         # Full manual step approval required
    REVIEW = "review"         # Single-click human review & confirmation (Default)
    AUTONOMOUS = "autonomous" # Auto-execute actions meeting confidence threshold

class HumanReviewPolicy:
    def __init__(self, mode: ReviewMode = ReviewMode.REVIEW):
        self.mode = mode

    def requires_review(self, confidence_score: float) -> bool:
        """Determines if action requires human review before dispatch."""
        if self.mode == ReviewMode.MANUAL:
            return True
        elif self.mode == ReviewMode.REVIEW:
            return True
        elif self.mode == ReviewMode.AUTONOMOUS:
            return confidence_score < 80.0
        return True
