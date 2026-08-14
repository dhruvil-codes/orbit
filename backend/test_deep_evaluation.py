import asyncio
import json
import sys
sys.path.insert(0, ".")

from app.compatibility.matcher import CompatibilityMatcher
from app.communication.dispatcher import OutreachDispatcher

async def test_deep():
    matcher = CompatibilityMatcher()
    dispatcher = OutreachDispatcher()

    company_a = {"name": "Magic UI", "domain": "magicui.design", "industry": "UI Component Library"}
    company_b = {"name": "Shadcn UI", "domain": "ui.shadcn.com", "industry": "React Components"}

    print("=" * 70)
    print(f"RUNNING DEEP PARTNER EVALUATION: {company_a['name']} x {company_b['name']}")
    print("=" * 70)

    res = await matcher.evaluate_compatibility(company_a, company_b)

    print(f"Score: {res.compatibility_score} / 100")
    print(f"\nSTRATEGIC FIT SUMMARY:\n{res.strategic_fit_summary}")

    print("\nSPECIFIC PARTNERSHIP IDEAS (DERIVED FROM WEB SEARCH):")
    for i, idea in enumerate(res.partnership_ideas, 1):
        print(f"  {i}. {idea}")

    print("\nCONCRETE INTEGRATION OPPORTUNITIES:")
    for i, opp in enumerate(res.integration_opportunities, 1):
        print(f"  {i}. {opp}")

    print("\nCO-MARKETING CAMPAIGNS:")
    for i, cm in enumerate(res.co_marketing_opportunities, 1):
        print(f"  {i}. {cm}")

    print("\nRECOMMENDED OUTREACH ANGLE:")
    print(f"  {res.recommended_outreach_angle}")

    print("\nTESTING CASPIAN DISPATCHER ALERT:")
    alert_res = await dispatcher.send_manager_alert(
        conversation_id="",
        opportunity_title=f"{company_a['name']} & {company_b['name']} Partnership",
        compatibility_score=res.compatibility_score,
        confidence_score=res.confidence_score,
        reasoning_summary={"why_now": "surging Next.js adoption", "why_this_outreach_strategy": "value-first POC demo"},
        opportunity_id="opp_test_123",
        recipient_email="shadcn@ui.shadcn.com",
        proposed_body="Hi Shadcn, let's build an animated component bridge..."
    )

    print("\nCASPIAN EXECUTION DETAILS:")
    print(f"  Status: {alert_res.get('status')}")
    print(f"  Channel: {alert_res.get('channel')}")
    print(f"  Connection ID: {alert_res.get('connection_id')}")
    print(f"  Conversation ID: {alert_res.get('conversation_id')}")
    print("  Trace Logs:")
    for log in alert_res.get("trace_logs", []):
        print(f"    - [{log.get('step')}] {log.get('details')}")

asyncio.run(test_deep())
