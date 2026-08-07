"""
Compatibility Domain - CompatibilityMatcher
Core intelligence engine evaluating strategic fit between two SaaS companies.
"""
from typing import Dict, Any, Optional
from app.compatibility.schemas import CompatibilityAnalysisResult
from app.compatibility.reasoning import AIReasoningCard
from app.compatibility.providers import BaseLLMProvider, MockLLMProvider, OpenAILLMProvider
from app.shared.config import settings

class CompatibilityMatcher:
    def __init__(self, provider: Optional[BaseLLMProvider] = None):
        if provider is not None:
            self.provider = provider
        elif settings.OPENAI_API_KEY:
            self.provider = OpenAILLMProvider()
        else:
            self.provider = MockLLMProvider()

    async def evaluate_compatibility(
        self, company_a: Dict[str, Any], company_b: Dict[str, Any]
    ) -> CompatibilityAnalysisResult:
        """
        Evaluates strategic partnership compatibility between two SaaS companies.
        """
        raw_result = await self.provider.evaluate_pair(company_a, company_b)
        result = CompatibilityAnalysisResult(**raw_result)
        
        if result.reasoning_card is None:
            result.reasoning_card = AIReasoningCard.generate_for_companies(
                company_a=company_a,
                company_b=company_b,
                compatibility_score=result.compatibility_score,
                confidence_score=result.confidence_score,
            )
            
        return result


