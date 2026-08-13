"""
Modular LLM Provider Interface for Compatibility Intelligence
Enables seamlessly swapping LLM backends (OpenAI, Featherless.ai, Anthropic, Gemini, Mock).
"""
import json
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from app.shared.config import settings

logger = logging.getLogger("orbit.llm_provider")

class BaseLLMProvider(ABC):
    @abstractmethod
    async def evaluate_pair(
        self, company_a: Dict[str, Any], company_b: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Evaluates strategic fit between two SaaS companies."""
        pass

class MockLLMProvider(BaseLLMProvider):
    """Deterministic, production-ready fallback provider for local testing and offline execution."""

    async def evaluate_pair(
        self, company_a: Dict[str, Any], company_b: Dict[str, Any]
    ) -> Dict[str, Any]:
        name_a = company_a.get("name", "Company A")
        name_b = company_b.get("name", "Company B")
        ind_a = company_a.get("industry", "SaaS")
        ind_b = company_b.get("industry", "SaaS")

        return {
            "compatibility_score": 87.5,
            "confidence_score": 92.0,
            "strategic_fit_summary": (
                f"High strategic alignment between {name_a} ({ind_a}) and {name_b} ({ind_b}). "
                f"Integrating {name_a}'s workflows directly with {name_b}'s data infrastructure creates "
                f"a compelling combined solution for shared enterprise customers."
            ),
            "partnership_ideas": [
                f"Joint go-to-market bundle for shared enterprise customers in {ind_a}",
                f"Co-branded webinar series on modern workflow automation",
                f"Cross-referral revenue share program"
            ],
            "integration_opportunities": [
                f"Native bi-directional data sync between {name_a} and {name_b}",
                f"Unified single sign-on (SSO) and Webhook event triggers",
                f"In-app action triggers inside {name_b}'s dashboard"
            ],
            "co_marketing_opportunities": [
                f"Joint case study highlighting dual-stack efficiency gains",
                f"Co-hosted developer meetup & API workshop",
                f"Shared launch blog post and email newsletter blast"
            ],
            "recommended_outreach_angle": (
                f"Focus on immediate joint value: propose a lightweight technical integration proof-of-concept "
                f"to unlock cross-sell potential across both company userbases."
            )
        }

class OpenAILLMProvider(BaseLLMProvider):
    """OpenAI / Featherless.ai API provider for production LLM analysis."""

    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None):
        self.api_key = api_key or settings.OPENAI_API_KEY
        self.base_url = base_url or getattr(settings, "OPENAI_API_BASE", None)

    async def evaluate_pair(
        self, company_a: Dict[str, Any], company_b: Dict[str, Any]
    ) -> Dict[str, Any]:
        if not self.api_key:
            logger.info("OPENAI_API_KEY not set. Using MockLLMProvider for evaluation.")
            fallback = MockLLMProvider()
            return await fallback.evaluate_pair(company_a, company_b)

        try:
            import openai
            client = openai.AsyncOpenAI(api_key=self.api_key, base_url=self.base_url)
            
            prompt = f"""
            Analyze strategic SaaS partnership potential between:
            Company A: {json.dumps(company_a)}
            Company B: {json.dumps(company_b)}
            
            Return ONLY a valid JSON object with keys:
            - compatibility_score (float 0-100)
            - confidence_score (float 0-100)
            - strategic_fit_summary (string)
            - partnership_ideas (list of strings)
            - integration_opportunities (list of strings)
            - co_marketing_opportunities (list of strings)
            - recommended_outreach_angle (string)
            """
            
            kwargs = {
                "model": settings.DEFAULT_LLM_MODEL,
                "messages": [{"role": "user", "content": prompt}],
            }
            # Add json_object format if supported
            if "gpt-" in settings.DEFAULT_LLM_MODEL.lower():
                kwargs["response_format"] = {"type": "json_object"}

            response = await client.chat.completions.create(**kwargs)
            content = response.choices[0].message.content or "{}"
            
            # Clean content if markdown codeblocks present
            if content.startswith("```"):
                content = content.split("```json")[-1].split("```")[0].strip()
                
            return json.loads(content)
        except Exception as e:
            logger.error(f"LLM Provider execution error: {e}. Falling back to deterministic provider.")
            fallback = MockLLMProvider()
            return await fallback.evaluate_pair(company_a, company_b)
