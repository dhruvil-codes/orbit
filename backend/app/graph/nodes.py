"""
Orbit LangGraph Workflow Execution Nodes
Discover -> Understand -> Evaluate
"""
from typing import Dict, Any
from app.graph.state import OrbitGraphState
from app.compatibility.matcher import CompatibilityMatcher

compatibility_matcher = CompatibilityMatcher()

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
    """Step 2: Deeply understand both SaaS companies & extract strategic context."""
    company_a = state.get("company_a", {})
    company_b = state.get("company_b", {})
    
    research_summary = {
        "company_a_context": f"{company_a.get('name')} offers automated agentic partnership workflow engines.",
        "company_b_context": f"{company_b.get('name')} provides developer-first API payment rails.",
        "synergy_hypothesis": f"Combining {company_a.get('name')} intelligence with {company_b.get('name')} infrastructure."
    }
    
    return {
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

