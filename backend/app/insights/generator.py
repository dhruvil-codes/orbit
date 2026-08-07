"""
Insights Domain Generator
Generates and persists reusable strategic insights across opportunities.
"""
from typing import List
from app.insights.schemas import StrategicInsightDTO

class InsightsGenerator:
    async def generate_insights(self, opportunity_id: str, company_name: str) -> List[StrategicInsightDTO]:
        """Generates reusable strategic partnership insights."""
        return [
            StrategicInsightDTO(
                id="ins_1",
                opportunity_id=opportunity_id,
                partner_company_name=company_name,
                category="integration",
                title="Bi-directional API Connector",
                description=f"Establish automated webhook sync between Orbit and {company_name}.",
                confidence_score=92.0
            ),
            StrategicInsightDTO(
                id="ins_2",
                opportunity_id=opportunity_id,
                partner_company_name=company_name,
                category="co_marketing",
                title="Joint Developer Grant Announcement",
                description="Co-announce strategic grant initiative for developer platform builders.",
                confidence_score=85.0
            )
        ]
