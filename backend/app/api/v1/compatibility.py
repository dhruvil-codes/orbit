"""
Compatibility Domain HTTP Controller
Exposes Strategic Compatibility Analysis, AI Reasoning Cards, Founder Intel & Multi-channel Outreach Drafts via LangGraph.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.shared.db import get_async_session
from app.compatibility.schemas import EvaluatePartnershipRequest
from app.graph.graph import run_orbit_graph
from app.partnerships.service import PartnershipService
from app.partnerships.schemas import PartnerCompanyCreate, PartnershipOpportunityCreate
from app.communication.dispatcher import OutreachDispatcher
from app.research.contact_research import ContactResearchEngine

router = APIRouter(prefix="/compatibility", tags=["Compatibility Matcher"])
dispatcher = OutreachDispatcher()
contact_research = ContactResearchEngine()


@router.post("/evaluate")
async def evaluate_compatibility(
    req: EvaluatePartnershipRequest,
    session: AsyncSession = Depends(get_async_session)
):
    """
    Evaluates strategic SaaS compatibility between Company A and Company B,
    runs the LangGraph workflow, persists the opportunity, extracts founder intel,
    generates multi-channel outreach drafts, and returns the full AI Reasoning payload.
    """
    # 1. Execute LangGraph Workflow (Discover -> Understand -> Evaluate)
    initial_state = {
        "company_a": req.company_a.model_dump(),
        "company_b": req.company_b.model_dump()
    }
    final_state = await run_orbit_graph(initial_state)

    # 2. Extract Decision Maker & Founder Intelligence
    founder_intel = await contact_research.find_decision_makers(
        domain=req.company_b.domain,
        company_name=req.company_b.name
    )

    # 3. Generate Multi-channel Outreach Message Drafts
    comp_score = final_state["compatibility_score"]
    fit_summary = final_state["compatibility_result"]["strategic_fit_summary"]
    ideas = final_state["compatibility_result"].get("partnership_ideas", [])
    ideas_str = "\n".join([f"• {idea}" for idea in ideas]) if ideas else "• Native API Integration & Joint GTM Bundle"

    outreach_drafts = {
        "email_subject": f"Strategic Partnership Proposal: {req.company_a.name} x {req.company_b.name}",
        "email_body": (
            f"Hi {founder_intel['executive_name'].split()[0]},\n\n"
            f"I hope this finds you well. I'm reaching out from {req.company_a.name}.\n\n"
            f"Our AI Partnership Agent evaluated strategic compatibility between {req.company_a.name} and {req.company_b.name}, "
            f"scoring a {comp_score}/100 strategic fit:\n\n"
            f"SYNERGY SUMMARY:\n{fit_summary}\n\n"
            f"HIGH-IMPACT OPPORTUNITIES:\n{ideas_str}\n\n"
            f"Would you be open to a 15-minute technical discovery call next week to explore a proof-of-concept?\n\n"
            f"Best regards,\nOrbit AI PDR (on behalf of {req.company_a.name})"
        ),
        "telegram_alert": (
            f"🎯 *Orbit AI PDR Alert*\n"
            f"Target: {req.company_a.name} x {req.company_b.name}\n"
            f"Score: *{comp_score}/100* (Confidence: {final_state['confidence_score']}%)\n"
            f"Decision Maker: {founder_intel['executive_name']} ({founder_intel['executive_role']})\n\n"
            f"Reply *APPROVE* to trigger Caspian Email Outreach or *REJECT* to park."
        ),
        "slack_announcement": (
            f":rocket: *New Partnership Opportunity Discovered*\n"
            f"*{req.company_a.name}* + *{req.company_b.name}* | Compatibility Score: `{comp_score}/100`\n"
            f"Executive Lead: {founder_intel['executive_name']} ({founder_intel['email']})\n"
            f"Status: _Pending PDR Manager Approval via Caspian Telegram_"
        )
    }

    # 4. Persist to Database Domain Repository
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
            compatibility_score=comp_score,
            status="evaluated",
            strategic_fit_summary=fit_summary
        )
    )

    # 5. Optional Caspian Multi-channel Dispatch
    dispatch_status = "idle"
    if req.dispatch_outreach and comp_score >= 80.0:
        dispatch_res = await dispatcher.dispatch_outreach(
            recipient=founder_intel["email"],
            channel="email",
            content=outreach_drafts["email_body"]
        )
        dispatch_status = dispatch_res.get("status", "attempted")

    return {
        "opportunity_id": opp_dto.id,
        "title": opp_dto.title,
        "company_a": req.company_a.name,
        "company_b": req.company_b.name,
        "compatibility_score": comp_score,
        "confidence_score": final_state["confidence_score"],
        "status": opp_dto.status,
        "dispatch_status": dispatch_status,
        "compatibility_result": final_state["compatibility_result"],
        "reasoning_card": final_state["reasoning_card"],
        "founder_intel": founder_intel,
        "outreach_drafts": outreach_drafts
    }
