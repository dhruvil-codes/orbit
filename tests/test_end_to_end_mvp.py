"""
Orbit Day 3 End-to-End MVP Intelligence Pipeline Test
Tests analysis of two SaaS companies (e.g. Notion & Linear) through LangGraph workflow and DB persistence.
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

import asyncio
import pytest
from app.graph.graph import run_orbit_graph
from app.shared.db import AsyncSessionLocal, Base, engine
from app.partnerships.service import PartnershipService
from app.partnerships.schemas import PartnerCompanyCreate, PartnershipOpportunityCreate


async def run_mvp_pipeline():
    # 1. Initialize Database Schema
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # 2. Define Realistic Input SaaS Companies
    company_a_input = {
        "name": "Notion",
        "domain": "notion.so",
        "industry": "Workspace & Knowledge Management",
        "description": "Connected workspace for wiki, docs, and project management"
    }
    company_b_input = {
        "name": "Linear",
        "domain": "linear.app",
        "industry": "Issue Tracking & Product Operations",
        "description": "Purpose-built tool for high-performance software product development"
    }

    # 3. Execute LangGraph Intelligence Workflow (Discover -> Understand -> Evaluate)
    initial_state = {
        "company_a": company_a_input,
        "company_b": company_b_input,
    }
    final_state = await run_orbit_graph(initial_state)

    # 4. Persist Analysis Results into Database Domain Repository
    async with AsyncSessionLocal() as session:
        service = PartnershipService(session)

        # Create/fetch companies
        company_a_dto = await service.get_or_create_company(
            PartnerCompanyCreate(**company_a_input)
        )
        company_b_dto = await service.get_or_create_company(
            PartnerCompanyCreate(**company_b_input)
        )

        # Save Partnership Opportunity
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

    # 5. Extract Output Components
    reasoning_card = final_state["reasoning_card"]
    
    return {
        "opportunity": opp_dto,
        "compatibility_score": final_state["compatibility_score"],
        "confidence_score": final_state["confidence_score"],
        "reasoning_card": reasoning_card,
        "compatibility_result": final_state["compatibility_result"]
    }

@pytest.mark.asyncio
async def test_end_to_end_mvp():
    result = await run_mvp_pipeline()
    assert result["opportunity"] is not None
    assert result["compatibility_score"] >= 0.0
    assert result["reasoning_card"] is not None
    assert "why_this_company" in result["reasoning_card"]

if __name__ == "__main__":
    res = asyncio.run(run_mvp_pipeline())
    print("\n=======================================================")
    print("  ORBIT DAY 3 END-TO-END MVP PIPELINE EXECUTION SUCCESS  ")
    print("=======================================================\n")
    print(f"  Partnership Opportunity ID : {res['opportunity'].id}")
    print(f"  Opportunity Title          : {res['opportunity'].title}")
    print(f"  Compatibility Score        : {res['compatibility_score']} / 100")
    print(f"  Confidence Score           : {res['confidence_score']} / 100")
    print(f"  Status                     : {res['opportunity'].status}\n")
    
    print("STRUCTURED AI REASONING CARD:")
    rc = res['reasoning_card']
    print(f"  - Why This Company?        : {rc['why_this_company']}")
    print(f"  - Why Now?                 : {rc['why_now']}")
    print(f"  - Why Decision Maker?      : {rc['why_this_decision_maker']}")
    print(f"  - Why Partnership?        : {rc['why_this_partnership']}")
    print(f"  - Why Outreach Strategy?   : {rc['why_this_outreach_strategy']}")
    print(f"  - Suggested Next Action    : {rc['suggested_next_action']}")
    print("\n=======================================================")

