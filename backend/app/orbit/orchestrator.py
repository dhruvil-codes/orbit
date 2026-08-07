"""
Orbit Central Core Orchestrator
Coordinates business domains: Partnerships, Compatibility, Research, Communication, Insights, Memory, Human Review.
"""
from typing import Dict, Any
from app.partnerships.service import PartnershipService
from app.compatibility.matcher import CompatibilityMatcher
from app.research.company_research import CompanyResearchEngine
from app.research.contact_research import ContactResearchEngine
from app.communication.channel_policy import ChannelPolicy
from app.communication.dispatcher import OutreachDispatcher
from app.insights.generator import InsightsGenerator
from app.human_review.policy import HumanReviewPolicy
from app.orbit.state import OrbitCoreState

class OrbitOrchestrator:
    def __init__(self):
        self.partnerships = PartnershipService()
        self.compatibility = CompatibilityMatcher()
        self.company_research = CompanyResearchEngine()
        self.contact_research = ContactResearchEngine()
        self.channel_policy = ChannelPolicy()
        self.dispatcher = OutreachDispatcher()
        self.insights_generator = InsightsGenerator()
        self.review_policy = HumanReviewPolicy()

    async def execute_partnership_workflow(self, opportunity_id: str) -> OrbitCoreState:
        """
        Coordinates complete high-level partnership pipeline across business domains.
        """
        opportunity = await self.partnerships.get_opportunity(opportunity_id)
        partner_company = {
            "name": opportunity.partner_company_name if opportunity else "Target Partner",
            "domain": opportunity.partner_company_domain if opportunity else "partner.com"
        }

        # 1. Research
        comp_info = await self.company_research.analyze_company(partner_company["domain"])
        contacts = await self.contact_research.find_decision_makers(partner_company["domain"])
        research_data = {"company": comp_info, "contacts": contacts}

        # 2. Compatibility Analysis & Reasoning
        compat_result = await self.compatibility.evaluate_compatibility(partner_company, research_data)

        # 3. Insights Generation
        insights = await self.insights_generator.generate_insights(opportunity_id, partner_company["name"])

        # 4. Channel Policy Selection
        selected_channel = self.channel_policy.determine_optimal_channel(partner_company, compat_result.strategic_score)

        # 5. Human Review Policy Evaluation
        requires_review = self.review_policy.requires_review(compat_result.strategic_score)

        return OrbitCoreState(
            opportunity_id=opportunity_id,
            partner_company=partner_company,
            research_summary=research_data,
            compatibility_score=compat_result.strategic_score,
            reasoning_card=compat_result.reasoning_card,
            insights=insights,
            selected_channel=selected_channel,
            review_required=requires_review,
            pipeline_stage="evaluated"
        )
