"""
Discovery Domain HTTP Controller
Exposes SaaS URL Metadata Analysis & TrustMRR/Product Hunt Partner Discovery endpoints.
"""
from fastapi import APIRouter
from pydantic import BaseModel, Field
from app.discovery.service import DiscoveryService
from app.research.company_research import CompanyResearchEngine

router = APIRouter(prefix="/discovery", tags=["Discovery Engine"])
discovery_service = DiscoveryService()
research_engine = CompanyResearchEngine()

class AnalyzeMetadataRequest(BaseModel):
    domain: str = Field(..., description="User's SaaS website domain (e.g. superx.com)")

class DiscoverPartnersRequest(BaseModel):
    domain: str = Field(..., description="User's SaaS website domain (e.g. superx.com)")

@router.post("/analyze-metadata")
async def analyze_saas_metadata(req: AnalyzeMetadataRequest):
    """
    Step 1: Scrapes live website metadata (title, description, category, ICP, developer API status)
    for the user's entered SaaS URL. Performs domain-level niche override before LLM classification.
    """
    clean_domain = req.domain.lower().replace("https://", "").replace("http://", "").replace("www.", "").strip("/")
    if "/" in clean_domain:
        clean_domain = clean_domain.split("/")[0]

    # Smart brand name derivation
    if "magicui" in clean_domain:
        brand_name = "Magic UI"
    elif "superx" in clean_domain:
        brand_name = "Superx"
    else:
        brand_name = clean_domain.split(".")[0].capitalize() if "." in clean_domain else clean_domain.capitalize()

    scraped = await research_engine.analyze_company(clean_domain)

    desc_lower = (scraped.get("description") or "").lower()
    title_lower = (scraped.get("title") or "").lower()
    combined = desc_lower + " " + title_lower + " " + clean_domain

    # Priority 1: UI / Design / Component Library signals
    if any(k in combined for k in ["ui", "component", "tailwind", "framer", "design system", "shadcn", "animation", "template", "landing page", "magicui", "aceternity", "lucide", "icon"]):
        category = "UI Component Library & Frontend Tools"
        target_icp = "React Developers, Next.js Engineers & Web Designers"
        niche = "ui_design"
    # Priority 2: Social / Creator / Twitter growth signals
    elif any(k in combined for k in ["twitter", "tweet", "linkedin", "social media", "creator", "scheduling", "content", "superx", "hypefury", "taplio", "typefully"]):
        category = "Social Growth & Creator Platform"
        target_icp = "Founders, Content Creators & Growth Marketers"
        niche = "creator_social"
    # Priority 3: Developer tool / API signals
    elif any(k in combined for k in ["api", "developer", "sdk", "git", "deploy", "build", "infrastructure", "webhook", "open-source"]):
        category = "Developer Tools & Infrastructure"
        target_icp = "Software Engineers, Product Managers & Tech Teams"
        niche = "developer"
    # Priority 4: Customer feedback / forms
    elif any(k in combined for k in ["form", "survey", "feedback", "chat", "bot", "testimonial"]):
        category = "Customer Engagement & Feedback"
        target_icp = "SaaS Founders, Product Managers & Growth Teams"
        niche = "engagement"
    # Fallback
    else:
        category = "B2B SaaS Growth & Productivity"
        target_icp = "SaaS Founders, Remote Teams & Growth Leaders"
        niche = "general"

    return {
        "domain": clean_domain,
        "brand_name": brand_name,
        "title": scraped.get("title") or f"{brand_name} — {category}",
        "description": scraped.get("description") or f"Modern SaaS platform operating on {clean_domain}.",
        "category": category,
        "target_icp": target_icp,
        "niche": niche,
        "has_developer_api": scraped.get("has_developer_api", False),
        "developer_links": scraped.get("developer_links", []),
        "status": scraped.get("status", "scraped")
    }

@router.post("/discover-partners")
async def discover_top_partners(req: DiscoverPartnersRequest):
    """
    Step 2: Matches user's analyzed SaaS against real, emerging independent SaaS startups (Product Hunt, TrustMRR, YC).
    """
    partners = await discovery_service.discover_top_partners(req.domain)
    return {"domain": req.domain, "top_partners": partners}
