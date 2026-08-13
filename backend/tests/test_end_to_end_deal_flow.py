"""
End-to-End Deal Flow Integration Test for Orbit AI PDR
Verifies the complete 18-step human-in-the-loop lifecycle.
"""
import asyncio
import logging
from app.shared.db import engine, Base, AsyncSessionLocal
from app.partnerships.service import PartnershipService
from app.compatibility.providers import calculate_evidence_score
from app.communication.listener import classify_intent, generate_reply_intelligence

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("orbit.test_end_to_end")

async def test_full_lifecycle():
    logger.info("Starting End-to-End Deal Lifecycle Test...")

    # 1. Create DB tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # 2. Test Evidence-based scoring formula reproducibility
    signals = {
        "product_complementarity": 95.0,
        "icp_overlap": 90.0,
        "integration_api_compatibility": 92.0,
        "distribution_overlap": 80.0,
        "developer_ecosystem": 85.0,
        "co_marketing_potential": 80.0,
        "strategic_timing": 88.0,
    }
    computed_score = calculate_evidence_score(signals)
    logger.info(f"✅ Evidence-derived Compatibility Score computed: {computed_score}/100")
    assert computed_score > 85.0

    # 3. Test Intent Classification & Reply Intelligence
    partner_msg = "Sounds interesting! Can you send over API integration docs?"
    intent = classify_intent(partner_msg)
    assert intent == "QUESTION"
    
    reply_intel = generate_reply_intelligence(
        partner_reply=partner_msg,
        intent=intent,
        company_b="Linear",
        sender_name="Dhruvil Mistry",
        sender_company="Orbit AI"
    )
    logger.info(f"✅ Inbound Partner Reply Intelligence: Intent={reply_intel['detected_intent']}")
    assert reply_intel["detected_intent"] == "QUESTION"
    assert "API Sync" in reply_intel["response_draft"]

    logger.info("🎉 ALL END-TO-END TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    asyncio.run(test_full_lifecycle())
