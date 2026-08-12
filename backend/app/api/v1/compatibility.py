"""
Compatibility Domain HTTP Controller
Exposes Strategic Compatibility Analysis & AI Reasoning Cards via CompatibilityMatcher & LangGraph.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.db import get_async_session
from app.compatibility.schemas import EvaluatePartnershipRequest, CompatibilityAnalysisResult
from app.graph.graph import run_orbit_graph
from app.partnerships.service import PartnershipService
from app.partnerships.schemas import PartnerCompanyCreate, PartnershipOpportunityCreate
from app.communication.dispatcher import OutreachDispatcher

router = APIRouter(prefix="/compatibility", tags=["Compatibility Matcher"])
dispatcher = OutreachDispatcher()

@router.post("/evaluate")
async def evaluate_compatibility(
    req: EvaluatePartnershipRequest,
    session: AsyncSession = Depends(get_async_session)
):
    """
    Evaluates strategic SaaS compatibility between Company A and Company B,
    runs the LangGraph workflow, persists the opportunity, and returns the AI Reasoning Card.
    """
    # 1. Execute LangGraph Workflow (Discover -> Understand -> Evaluate)
    initial_state = {
        "company_a": req.company_a.model_dump(),
        "company_b": req.company_b.model_dump()
    }
    final_state = await run_orbit_graph(initial_state)

    # 2. Persist to Database Domain Repository
    service = PartnershipService(session)
    company_a_dto = await service.get_or_create_company(
        PartnerCompanyCreate(**req.company_a.model_dump())
    )
    company_b_dto = await service.get_or_create_company(
        PartnerCompanyCreate(**req.company_b.model_dump())
    )

    opp_dto = await service.create_opportunity(
        PartnershipOpportunityCreate(
            primary_company_id=company_a_dto.id,
            partner_company_id=company_b_dto.id,
            title=f"{company_a_dto.name} & {company_b_dto.name} Product Intelligence Partnership",
            compatibility_score=final_state["compatibility_score"],
            status="evaluated",
            strategic_fit_summary=final_state["compatibility_result"]["strategic_fit_summary"]
        )
    )

    # 3. Optional Caspian Multi-channel Dispatch
    dispatch_status = "idle"
    if req.dispatch_outreach and final_state["compatibility_score"] >= 80.0:
        # Example outreach dispatch via Caspian
        outreach_content = (
            f"Subject: Technical Partnership Proposal: {req.company_a.name} x {req.company_b.name}\n\n"
            f"Hi {req.company_b.name} Team,\n\n"
            f"Orbit AI PDR evaluated a strategic fit score of {final_state['compatibility_score']}/100 "
            f"between {req.company_a.name} and {req.company_b.name}.\n\n"
            f"Key Synergy: {final_state['compatibility_result']['strategic_fit_summary']}\n\n"
            f"Let's explore a native API integration. Reply to this email to connect!"
        )
        dispatch_res = await dispatcher.dispatch_outreach(
            recipient=f"partnerships@{req.company_b.domain}",
            channel="email",
            content=outreach_content
        )
        dispatch_status = dispatch_res.get("status", "attempted")

    return {
        "opportunity_id": opp_dto.id,
        "title": opp_dto.title,
        "company_a": req.company_a.name,
        "company_b": req.company_b.name,
        "compatibility_score": final_state["compatibility_score"],
        "confidence_score": final_state["confidence_score"],
        "status": opp_dto.status,
        "dispatch_status": dispatch_status,
        "compatibility_result": final_state["compatibility_result"],
        "reasoning_card": final_state["reasoning_card"]
    }
