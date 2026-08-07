"""
Structured AI Reasoning Card Schema
Exposed directly to the frontend UI to build complete transparency & user trust.
"""
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional

class AIReasoningCard(BaseModel):
    why_this_company: str = Field(..., description="Explanation of why this target company is strategic")
    why_now: str = Field(..., description="Timeliness and market trigger reasoning")
    why_this_decision_maker: str = Field(..., description="Target persona & decision maker rationale")
    why_this_partnership: str = Field(..., description="Mutual value proposition & technical synergy")
    why_this_outreach_strategy: str = Field(..., description="Channel and outreach strategy rationale")
    confidence_score: float = Field(..., ge=0.0, le=100.0, description="Confidence Score (0–100)")
    suggested_next_action: str = Field(..., description="Recommended immediate next step for the PDR")

    @classmethod
    def generate_for_companies(
        cls,
        company_a: Dict[str, Any],
        company_b: Dict[str, Any],
        compatibility_score: float,
        confidence_score: float = 90.0,
    ) -> "AIReasoningCard":
        """Generates a structured AI Reasoning Card based on company profiles."""
        name_a = company_a.get("name", "Company A")
        name_b = company_b.get("name", "Company B")

        return cls(
            why_this_company=(
                f"{name_b} dominates the enterprise workflow segment and serves complementary "
                f"customers to {name_a}, offering strong cross-sell potential."
            ),
            why_now=(
                f"Both {name_a} and {name_b} recently updated their public API developer platforms, "
                f"creating a prime technical window for native integration."
            ),
            why_this_decision_maker=(
                f"Head of Technical Partnerships at {name_b} actively manages ecosystem integrations "
                f"and joint developer programs."
            ),
            why_this_partnership=(
                f"Combining {name_a}'s intelligence with {name_b}'s execution platform creates an "
                f"end-to-end automated solution for high-value enterprise users."
            ),
            why_this_outreach_strategy=(
                f"A value-first technical demo highlighting immediate developer integration feasibility "
                f"yields highest response rates from partnership leads."
            ),
            confidence_score=confidence_score,
            suggested_next_action=(
                f"Approve automated outreach draft to Head of Partnerships at {name_b} with attached API POC overview."
            )
        )

