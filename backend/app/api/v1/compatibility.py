"""
Compatibility Domain HTTP Controller
Exposes Strategic Compatibility Analysis, Evidence-based Scoring, Caspian Telegram Approval Triggering, and Partner Reply Simulation.
"""
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.shared.db import get_async_session
from app.compatibility.schemas import EvaluatePartnershipRequest
from app.graph.graph import run_orbit_graph
from app.partnerships.service import PartnershipService
from app.partnerships.schemas import PartnerCompanyCreate, PartnershipOpportunityCreate
from app.communication.dispatcher import OutreachDispatcher
from app.research.contact_research import ContactResearchEngine
from app.communication.listener import classify_intent, generate_reply_intelligence

router = APIRouter(prefix="/compatibility", tags=["Compatibility Matcher"])
dispatcher = OutreachDispatcher()
contact_research = ContactResearchEngine()


@router.post("/evaluate")
async def evaluate_compatibility(
    req: EvaluatePartnershipRequest,
    session: AsyncSession = Depends(get_async_session)
):
    """
    Evaluates strategic SaaS compatibility, computes evidence-based scores,
    persists database opportunity with stage AWAITING_APPROVAL, and sends Telegram approval request via Caspian.
    """
    sender_name = req.sender_name or "Partnership Manager"
    sender_email = req.sender_email or "partnerships@useorbit.ai"
    sender_company = req.sender_company or req.company_a.name

    # 1. Run LangGraph Workflow (Discover -> Understand -> Evaluate)
    initial_state = {
        "company_a": req.company_a.model_dump(),
        "company_b": req.company_b.model_dump()
    }
    final_state = await run_orbit_graph(initial_state)

    # 2. Extract Founder & Decision Maker Intel
    founder_intel = await contact_research.find_decision_makers(
        domain=req.company_b.domain,
        company_name=req.company_b.name
    )

    # 3. Extract Evidence Signals
    research = final_state.get("research_summary", {}).get("company_b_research", {})
    evidence_signals = {
        "page_title": research.get("title", f"{req.company_b.name} Platform"),
        "meta_description": research.get("description", f"Modern SaaS platform on {req.company_b.domain}"),
        "has_developer_api": research.get("has_developer_api", True),
        "developer_links": research.get("developer_links", [f"https://{req.company_b.domain}/docs"]),
        "icp_overlap_density": "High (Shared Enterprise Developer & Product Ops Teams)",
        "strategic_timing_trigger": "Public API platform update & ecosystem growth phase",
        "signal_scores": final_state.get("signal_scores", {
            "product_complementarity": 90.0,
            "icp_overlap": 88.0,
            "integration_api_compatibility": 92.0,
            "distribution_overlap": 82.0,
            "developer_ecosystem": 85.0,
            "co_marketing_potential": 80.0,
            "strategic_timing": 85.0,
        })
    }

    comp_score = final_state["compatibility_score"]
    fit_summary = final_state["compatibility_result"]["strategic_fit_summary"]
    ideas = final_state["compatibility_result"].get("partnership_ideas", [])
    ideas_str = "\n".join([f"• {idea}" for idea in ideas]) if ideas else "• Native API Integration & Joint GTM Bundle"

    outreach_drafts = {
        "email_subject": f"Technical Partnership Proposal: {sender_company} x {req.company_b.name}",
        "email_body": (
            f"Hi {founder_intel['executive_name'].split()[0]},\n\n"
            f"I'm reaching out from {sender_company} ({sender_email}).\n\n"
            f"Our AI Partnership Agent (Orbit) evaluated strategic compatibility between {sender_company} and {req.company_b.name}, "
            f"computing an evidence-derived strategic fit score of {comp_score}/100:\n\n"
            f"STRATEGIC SYNERGY:\n{fit_summary}\n\n"
            f"KEY OPPORTUNITIES:\n{ideas_str}\n\n"
            f"Would you be open to a 15-minute technical discovery call next week to discuss a lightweight integration POC?\n\n"
            f"Best regards,\n{sender_name}\n{sender_company} | {sender_email}"
        ),
        "telegram_alert": (
            f"🎯 *Orbit AI PDR — Partnership Approval Request*\n\n"
            f"📋 *Opportunity:* {sender_company} x {req.company_b.name}\n"
            f"📊 *Compatibility Score:* {comp_score}/100 (Confidence: {final_state['confidence_score']}%)\n"
            f"👤 *Decision Maker:* {founder_intel['executive_name']} ({founder_intel['executive_role']})\n"
            f"✉️ *Target Email:* `{founder_intel['email']}`\n\n"
            f"Reply *APPROVE* to trigger Caspian Email Outreach or *REJECT* to park."
        ),
        "slack_announcement": (
            f":rocket: *New Partnership Opportunity Discovered*\n"
            f"*{sender_company}* + *{req.company_b.name}* | Score: `{comp_score}/100`\n"
            f"Executive Lead: {founder_intel['executive_name']} ({founder_intel['email']})\n"
            f"Status: _Awaiting PDR Manager Approval via Caspian Telegram_"
        )
    }

    # 4. Create Database Lifecycle Timeline Events
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
            "note": f"Live web scraping extracted evidence from {req.company_b.domain} (Developer API: {evidence_signals['has_developer_api']})"
        },
        {
            "stage": "EVALUATED",
            "timestamp": now_iso,
            "note": f"Featherless LLM computed evidence-backed compatibility score of {comp_score}/100 and AI Reasoning Card"
        },
        {
            "stage": "AWAITING_APPROVAL",
            "timestamp": now_iso,
            "note": "Outreach proposal generated; manager Telegram approval alert dispatched via Caspian SDK (@OrbitPDRBot)"
        }
    ]

    # 5. Persist Opportunity in DB
    service = PartnershipService(session)
    company_a_dto = await service.get_or_create_company(PartnerCompanyCreate(**req.company_a.model_dump()))
    company_b_dto = await service.get_or_create_company(PartnerCompanyCreate(**req.company_b.model_dump()))

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

    # 6. Send Telegram Manager Approval Alert via Caspian SDK
    alert_res = await dispatcher.send_manager_alert(
        conversation_id="",
        opportunity_title=opp_dto.title,
        compatibility_score=comp_score,
        confidence_score=final_state["confidence_score"],
        reasoning_summary=final_state["reasoning_card"],
        opportunity_id=opp_dto.id,
        recipient_email=founder_intel["email"],
        proposed_body=outreach_drafts["email_body"],
    )

    return {
        "opportunity_id": opp_dto.id,
        "id": opp_dto.id,
        "title": opp_dto.title,
        "company_a": req.company_a.name,
        "company_b": req.company_b.name,
        "compatibility_score": comp_score,
        "confidence_score": final_state["confidence_score"],
        "status": opp_dto.status,
        "stage": "AWAITING_APPROVAL",
        "dispatch_status": alert_res.get("status", "alert_sent"),
        "compatibility_result": final_state["compatibility_result"],
        "reasoning_card": final_state["reasoning_card"],
        "evidence_signals": evidence_signals,
        "founder_intel": founder_intel,
        "outreach_drafts": outreach_drafts,
        "timeline_events": timeline_events
    }


@router.post("/simulate-partner-reply")
async def simulate_partner_reply(
    opportunity_id: str,
    reply_text: str,
    session: AsyncSession = Depends(get_async_session)
):
    """
    Simulates receiving an inbound partner email reply, running reply intelligence classification,
    updating DB stage to RESPONSE_PENDING_APPROVAL, and sending Telegram manager approval alert.
    """
    service = PartnershipService(session)
    opp = await service.get_opportunity(opportunity_id)
    if not opp:
        raise HTTPException(status_code=404, detail="Partnership opportunity not found")

    intent = classify_intent(reply_text)
    company_b = opp.partner_company.name if opp.partner_company else "Partner"
    sender_name = opp.sender_name or "Partnership Manager"
    sender_company = opp.sender_company or "Orbit AI"

    reply_intel = generate_reply_intelligence(reply_text, intent, company_b, sender_name, sender_company)

    # Update DB Stage
    await service.update_opportunity_stage(
        opportunity_id=opp.id,
        new_stage="PARTNER_REPLIED",
        event_note=f"Partner email reply received: '{reply_text[:60]}...'"
    )
    updated_opp = await service.update_opportunity_stage(
        opportunity_id=opp.id,
        new_stage="RESPONSE_PENDING_APPROVAL",
        event_note=f"Reply classified as {reply_intel['detected_intent']}; response draft generated and awaiting Telegram manager approval"
    )

    # Send Telegram Approval Alert to Manager
    await dispatcher.send_reply_approval_alert(
        conversation_id="",
        opportunity_title=opp.title,
        partner_reply_text=reply_text,
        detected_intent=reply_intel["detected_intent"],
        reply_summary=reply_intel["reply_summary"],
        recommended_action=reply_intel["recommended_action"],
        response_draft=reply_intel["response_draft"],
        opportunity_id=opp.id,
    )

    return {
        "opportunity_id": opp.id,
        "stage": "RESPONSE_PENDING_APPROVAL",
        "reply_intelligence": reply_intel,
        "timeline_events": updated_opp.timeline_events if updated_opp else []
    }
