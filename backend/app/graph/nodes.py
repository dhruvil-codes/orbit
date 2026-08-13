"""
Orbit LangGraph Workflow Execution Nodes
Discover -> Understand -> Evaluate
"""
from typing import Dict, Any
from app.graph.state import OrbitGraphState
from app.compatibility.matcher import CompatibilityMatcher
from app.research.company_research import CompanyResearchEngine

compatibility_matcher = CompatibilityMatcher()
research_engine = CompanyResearchEngine()

async def discover_node(state: OrbitGraphState) -> Dict[str, Any]:
    """Step 1: Discover partnership targets & initialize company metadata."""
    company_a = state.get("company_a") or {
        "name": "Orbit AI",
        "domain": "useorbit.ai",
        "industry": "AI Partnership Infrastructure",
        "description": "Autonomous AI PDR platform for SaaS partnerships"
    }
    company_b = state.get("company_b") or {
        "name": "Stripe",
        "domain": "stripe.com",
        "industry": "Fintech & Payments",
        "description": "Financial infrastructure for the internet"
    }
    
    return {
        "company_a": company_a,
        "company_b": company_b,
        "status": "discovered",
        "next_step": "understand"
    }

async def understand_node(state: OrbitGraphState) -> Dict[str, Any]:
    """Step 2: Deeply understand both SaaS companies & extract strategic context via live scraping."""
    company_a = state.get("company_a", {})
    company_b = state.get("company_b", {})
    
    domain_a = company_a.get("domain", "")
    domain_b = company_b.get("domain", "")

    # Live scraping research for both companies
    info_a = await research_engine.analyze_company(domain_a) if domain_a else {}
    info_b = await research_engine.analyze_company(domain_b) if domain_b else {}

    # Merge scraped data into descriptions if available
    if info_a.get("description") and not company_a.get("description"):
        company_a["description"] = info_a["description"]
    if info_b.get("description") and not company_b.get("description"):
        company_b["description"] = info_b["description"]

    research_summary = {
        "company_a_research": info_a,
        "company_b_research": info_b,
        "synergy_hypothesis": f"Combining {company_a.get('name')} intelligence with {company_b.get('name')} platform capabilities."
    }
    
    return {
        "company_a": company_a,
        "company_b": company_b,
        "research_summary": research_summary,
        "status": "understood",
        "next_step": "evaluate"
    }

async def evaluate_node(state: OrbitGraphState) -> Dict[str, Any]:
    """Step 3: Evaluate compatibility using CompatibilityMatcher & produce structured AI reasoning card."""
    company_a = state.get("company_a", {})
    company_b = state.get("company_b", {})
    
    result = await compatibility_matcher.evaluate_compatibility(company_a, company_b)
    
    return {
        "compatibility_score": result.compatibility_score,
        "confidence_score": result.confidence_score,
        "compatibility_result": result.model_dump(),
        "reasoning_card": result.reasoning_card.model_dump() if result.reasoning_card else None,
        "status": "evaluated",
        "next_step": "complete"
    }
