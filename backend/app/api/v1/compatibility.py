"""
Compatibility Domain HTTP Controller
Exposes Strategic Compatibility Analysis & AI Reasoning Cards via CompatibilityMatcher.
"""
from fastapi import APIRouter
from app.compatibility.matcher import CompatibilityMatcher

router = APIRouter(prefix="/compatibility", tags=["Compatibility Matcher"])
matcher = CompatibilityMatcher()

@router.post("/evaluate")
async def evaluate_compatibility(company_name: str, domain: str):
    """Evaluates strategic fit and outputs structured AI reasoning card."""
    result = await matcher.evaluate_compatibility({"name": company_name, "domain": domain}, {})
    return result
