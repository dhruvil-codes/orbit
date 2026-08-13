"""
Compatibility Domain HTTP Controller
Exposes Strategic Compatibility Analysis, AI Reasoning Cards, Founder Intel, Evidence & Timeline via LangGraph.
"""
from datetime import datetime
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
    runs the LangGraph workflow, persists the opportunity with explicit sender identity,
    evidence signals, founder intel, multi-channel outreach drafts, and timeline lifecycle events.
    """
    # Sender identity defaults
    sender_name = req.sender_name or "Partnership Manager"
    sender_email = req.sender_email or "partnerships@useorbit.ai"
    sender_company = req.sender_company or req.company_a.name

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

    # 3. Extract Evidence Signals from Web Scraping Research Summary
    research = final_state.get("research_summary", {}).get("company_b_research", {})
    evidence_signals = {
        "page_title": research.get("title", f"{req.company_b.name} Platform"),
        "meta_description": research.get("description", f"Modern SaaS platform on {req.company_b.domain}"),
        "has_developer_api": research.get("has_developer_api", True),
        "developer_links": research.get("developer_links", [f"https://{req.company_b.domain}/docs"]),
        "icp_overlap_density": "High (Shared Enterprise Developer & Product Ops Teams)",
        "strategic_timing_trigger": "Public API platform update & ecosystem growth phase"
    }

    # 4. Generate Multi-channel Outreach Message Drafts using User's Sender Identity
    comp_score = final_state["compatibility_score"]
    fit_summary = final_state["compatibility_result"]["strategic_fit_summary"]
    ideas = final_state["compatibility_result"].get("partnership_ideas", [])
    ideas_str = "\n".join([f"• {idea}" for idea in ideas]) if ideas else "• Native API Integration & Joint GTM Bundle"

    outreach_drafts = {
        "email_subject": f"Technical Partnership Proposal: {sender_company} x {req.company_b.name}",
        "email_body": (
            f"Hi {founder_intel['executive_name'].split()[0]},\n\n"
            f"I hope this finds you well. My name is {sender_name} from {sender_company} ({sender_email}).\n\n"
            f"Our AI Partnership Development Agent (Orbit) evaluated a strategic compatibility fit of {comp_score}/100 "
            f"between {sender_company} and {req.company_b.name}:\n\n"
            f"STRATEGIC SYNERGY:\n{fit_summary}\n\n"
            f"KEY OPPORTUNITIES:\n{ideas_str}\n\n"
            f"Would you be open to a 15-minute technical discovery call next week to discuss a lightweight integration POC?\n\n"
            f"Best regards,\n{sender_name}\n{sender_company} | {sender_email}"
        ),
        "telegram_alert": (
            f"🎯 *Orbit AI PDR — Manager Approval Request*\n\n"
            f"📋 *Opportunity:* {sender_company} x {req.company_b.name}\n"
            f"📊 *Compatibility Score:* {comp_score}/100 (Confidence: {final_state['confidence_score']}%)\n"
            f"👤 *Decision Maker:* {founder_intel['executive_name']} ({founder_intel['executive_role']})\n"
            f"✉️ *Target Email:* `{founder_intel['email']}`\n\n"
            f"Reply *APPROVE* to trigger Caspian Email Outreach or *REJECT* to park."
        ),
        "slack_announcement": (
            f":rocket: *New Partnership Opportunity Discovered*\n"
            f"*{sender_company}* + *{req.company_b.name}* | Score: `{comp_score}/100`\n"
            f"Sender Identity: {sender_name} ({sender_email})\n"
            f"Executive Lead: {founder_intel['executive_name']} ({founder_intel['email']})\n"
            f"Status: _Awaiting PDR Manager Approval via Caspian Telegram_"
        )
    }

    # 5. Build Initial Communication Timeline Events
    now_iso = datetime.utcnow().isoformat()
    timeline_events = [
        {
            "stage": "DISCOVERED",
            "timestamp": now_iso,
            "note": f"Opportunity discovered between {sender_company} and {req.company_b.name}"
        },
        {
            "stage": "RESEARCHED",
            "timestamp": now_iso,
            "note": f"Live web scraping extracted evidence from {req.company_b.domain} (API Docs: {evidence_signals['has_developer_api']})"
        },
        {
            "stage": "EVALUATED",
            "timestamp": now_iso,
            "note": f"Featherless LLM computed compatibility score of {comp_score}/100 and AI Reasoning Card"
        },
        {
            "stage": "AWAITING_APPROVAL",
            "timestamp": now_iso,
            "note": "Outreach recommendation drafted; pending manager approval on Telegram (@OrbitPDRBot)"
        }
    ]

    # 6. Persist to Database Domain Repository
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
            stage="AWAITING_APPROVAL",
            strategic_fit_summary=fit_summary,
            sender_name=sender_name,
            sender_email=sender_email,
            sender_company=sender_company,
            evidence_signals=evidence_signals,
            founder_intel=founder_intel,
            reasoning_card=final_state["reasoning_card"],
            outreach_drafts=outreach_drafts,
            timeline_events=timeline_events
        )
    )

    # 7. Optional Caspian Multi-channel Dispatch
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
        "stage": "AWAITING_APPROVAL",
        "dispatch_status": dispatch_status,
        "compatibility_result": final_state["compatibility_result"],
        "reasoning_card": final_state["reasoning_card"],
        "evidence_signals": evidence_signals,
        "founder_intel": founder_intel,
        "outreach_drafts": outreach_drafts,
        "timeline_events": timeline_events
    }
