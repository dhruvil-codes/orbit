"""
Discovery Domain Engine Service — Multi-Platform SaaS Launchpad Ecosystem
Discovery priority:
  1. Tavily web search (real-time, live internet results)
  2. Featherless LLM (AI-generated, niche-aware)
  3. Curated niche catalogs (static fallback)
"""
from typing import List, Dict, Any, Optional
import httpx
import json
import logging
from app.shared.config import settings

logger = logging.getLogger("orbit.discovery")

# ─────────────────────────────────────────────────────────────────────────────
# STATIC NICHE CATALOGS (fallback when APIs are unavailable)
# ─────────────────────────────────────────────────────────────────────────────

UI_DESIGN_CATALOG = [
    {"name": "Shadcn UI", "domain": "ui.shadcn.com", "industry": "React Component Infrastructure", "description": "Re-usable React & Tailwind components to copy-paste into apps", "compatibility_score": 96.0, "synergy_reason": "Co-market component templates & cross-promote UI design systems to Next.js/React developers.", "executive_lead": {"name": "Shadcn", "role": "Creator & Founder", "email": "shadcn@ui.shadcn.com"}, "recent_news": "GitHub #1 Trending UI Project; 60k+ GitHub Stars.", "category": "design", "platform_badge": "GitHub #1"},
    {"name": "Aceternity UI", "domain": "ui.aceternity.com", "industry": "Animated Tailwind Components", "description": "Copy-paste animated React components built with Framer Motion & Tailwind CSS", "compatibility_score": 94.0, "synergy_reason": "Joint component bundle showcase & mutual attribution on landing page showcases.", "executive_lead": {"name": "Manu Arora", "role": "Creator & Founder", "email": "manu@aceternity.com"}, "recent_news": "Peerlist Spotlight (199K visits/mo); 500k monthly component views.", "category": "design", "platform_badge": "Peerlist Spotlight"},
    {"name": "Lucide Icons", "domain": "lucide.dev", "industry": "Open Source Icon Suite", "description": "Beautiful & consistent open-source icon library for React and modern web apps", "compatibility_score": 92.0, "synergy_reason": "Native icon package integration inside UI component blocks & co-branded docs.", "executive_lead": {"name": "Eric Fennis", "role": "Core Maintainer", "email": "eric@lucide.dev"}, "recent_news": "DevHunt Top Developer Tool (62K visits/mo); default icon choice for Next.js.", "category": "design", "platform_badge": "DevHunt Top"},
    {"name": "Framer", "domain": "framer.com", "industry": "Visual Web Design & Prototyping", "description": "Design and publish stunning sites with Framer's visual web builder", "compatibility_score": 91.0, "synergy_reason": "Bundle UI components with Framer templates for no-code/design teams.", "executive_lead": {"name": "Koen Bok", "role": "Co-founder & CEO", "email": "koen@framer.com"}, "recent_news": "Product Hunt #1; 500k+ active designers on platform.", "category": "design", "platform_badge": "Product Hunt #1"},
    {"name": "Mintlify", "domain": "mintlify.com", "industry": "Developer Component Docs", "description": "Beautiful documentation platforms with interactive live code previews", "compatibility_score": 93.0, "synergy_reason": "Co-brand interactive component documentation & live preview playgrounds.", "executive_lead": {"name": "Han Wang", "role": "Co-founder & CEO", "email": "han@mintlify.com"}, "recent_news": "Show HN #1 & Peerlist Spotlight; $2.8M seed round.", "category": "developer", "platform_badge": "Show HN #1"},
    {"name": "Resend", "domain": "resend.com", "industry": "React Email Component Infrastructure", "description": "Modern developer-first email platform powered by React Email components", "compatibility_score": 90.0, "synergy_reason": "Provide styled React Email UI components for landing page form submissions.", "executive_lead": {"name": "Zeno Rocha", "role": "CEO & Founder", "email": "zeno@resend.com"}, "recent_news": "Peerlist Weekly Winner (199K visits/mo); 20,000+ developer accounts.", "category": "developer", "platform_badge": "Peerlist Winner"},
    {"name": "Screen Studio", "domain": "screen.studio", "industry": "UI Demo Video Capture", "description": "Beautiful screen recording software for high-converting product demo videos", "compatibility_score": 88.0, "synergy_reason": "Co-market animated UI component recording tools for component creators.", "executive_lead": {"name": "Adam Pitts", "role": "Founder", "email": "adam@screen.studio"}, "recent_news": "Indie Hackers Featured (DR 80); $60,000 MRR.", "category": "marketing", "platform_badge": "Indie Hackers Top"},
]

CREATOR_SOCIAL_CATALOG = [
    {"name": "Typefully", "domain": "typefully.com", "industry": "Twitter/X Content & Scheduling", "description": "Clean, distraction-free thread editor & analytics for Twitter/X creators", "compatibility_score": 95.0, "synergy_reason": "Cross-promote content creation & engagement analytics to creator audiences.", "executive_lead": {"name": "Francesco Di Lorenzo", "role": "Co-founder", "email": "francesco@typefully.com"}, "recent_news": "Product Hunt #1 Product of the Day; 100k+ active creators.", "category": "social", "platform_badge": "Product Hunt #1"},
    {"name": "Hypefury", "domain": "hypefury.com", "industry": "Social Media Growth", "description": "Automate social media growth, thread scheduling & product cross-selling", "compatibility_score": 93.0, "synergy_reason": "Integrate automated social post syndication & joint creator growth webinars.", "executive_lead": {"name": "Yannick Veys", "role": "Co-founder", "email": "yannick@hypefury.com"}, "recent_news": "TrustMRR Featured Creator Tool; $80k+ MRR bootstrapped.", "category": "social", "platform_badge": "TrustMRR Featured"},
    {"name": "Taplio", "domain": "taplio.com", "industry": "LinkedIn Creator AI & Growth", "description": "All-in-one AI platform for LinkedIn content creation & lead generation", "compatibility_score": 91.0, "synergy_reason": "Cross-market cross-platform publishing for Twitter/X and LinkedIn creators.", "executive_lead": {"name": "Alex Berman", "role": "Co-founder", "email": "alex@taplio.com"}, "recent_news": "SaaSHub Verified (358K visits/mo); acquired by Lempire.", "category": "social", "platform_badge": "SaaSHub Verified"},
    {"name": "Senja", "domain": "senja.io", "industry": "Social Proof & Creator Testimonials", "description": "Collect & embed creator testimonials to boost social media conversion rates", "compatibility_score": 94.0, "synergy_reason": "Embed creator social proof widgets directly into creator landing pages.", "executive_lead": {"name": "Wilson Wilson", "role": "Co-founder", "email": "wilson@senja.io"}, "recent_news": "SaaSHub Verified (358K visits/mo); $45,000 MRR on TrustMRR.", "category": "marketing", "platform_badge": "SaaSHub #1"},
    {"name": "Dubs.co", "domain": "dubs.co", "industry": "Short Link Attribution for Creators", "description": "Open-source link management and short link attribution platform", "compatibility_score": 90.0, "synergy_reason": "Track click-through attribution on social media bios and promotional tweets.", "executive_lead": {"name": "Steven Tey", "role": "Founder", "email": "steven@dubs.co"}, "recent_news": "Peerlist Weekly Winner (199K visits/mo); TrustMRR #1.", "category": "marketing", "platform_badge": "Peerlist Winner"},
    {"name": "Beehiiv", "domain": "beehiiv.com", "industry": "Newsletter & Creator Monetization", "description": "The newsletter platform built for growth — monetize your audience", "compatibility_score": 89.0, "synergy_reason": "Co-promote newsletter growth tools alongside social media scheduling.", "executive_lead": {"name": "Tyler Denk", "role": "Co-founder & CEO", "email": "tyler@beehiiv.com"}, "recent_news": "SaaSHub Top (358K visits/mo); $2.6M ARR.", "category": "social", "platform_badge": "SaaSHub Top"},
]

EDUCATION_CODING_CATALOG = [
    {"name": "Scrimba", "domain": "scrimba.com", "industry": "Interactive Coding Education", "description": "Interactive coding screencasts for learning web development", "compatibility_score": 95.0, "synergy_reason": "Co-develop interactive coding challenges and share learner communities.", "executive_lead": {"name": "Per Harald Borgen", "role": "Co-founder & CEO", "email": "per@scrimba.com"}, "recent_news": "Product Hunt #2; 100k+ active learners on platform.", "category": "education", "platform_badge": "Product Hunt #2"},
    {"name": "Exercism", "domain": "exercism.org", "industry": "Coding Practice & Mentorship", "description": "Free coding exercises and mentorship in 60+ programming languages", "compatibility_score": 93.0, "synergy_reason": "Cross-promote coding challenges and structured learning paths to coding learners.", "executive_lead": {"name": "Jeremy Walker", "role": "CEO & Founder", "email": "jeremy@exercism.org"}, "recent_news": "GitHub Open Source with 9k stars; 500k registered learners.", "category": "education", "platform_badge": "GitHub OSS"},
    {"name": "Brilliant.org", "domain": "brilliant.org", "industry": "STEM & Coding Education", "description": "Interactive STEM and coding courses for curious problem-solvers", "compatibility_score": 88.0, "synergy_reason": "Bundle gamified math & logic challenges alongside coding adventure tracks.", "executive_lead": {"name": "Sue Khim", "role": "Co-founder & CEO", "email": "sue@brilliant.org"}, "recent_news": "Series C funded; 10M+ active learners globally.", "category": "education", "platform_badge": "EdTech Leader"},
    {"name": "Replit", "domain": "replit.com", "industry": "Cloud IDE & Coding Platform", "description": "Browser-based collaborative IDE for learning and building projects", "compatibility_score": 92.0, "synergy_reason": "Embed live coding environments inside coding adventure tracks.", "executive_lead": {"name": "Amjad Masad", "role": "CEO & Founder", "email": "amjad@replit.com"}, "recent_news": "Peerlist Featured; $97M Series B; 20M+ users.", "category": "developer", "platform_badge": "Peerlist Featured"},
    {"name": "CodePen", "domain": "codepen.io", "industry": "Front-end Code Playground", "description": "Social development environment for front-end developers", "compatibility_score": 91.0, "synergy_reason": "Showcase interactive HTML/CSS/JS coding challenges directly on CodePen.", "executive_lead": {"name": "Chris Coyier", "role": "Co-founder", "email": "chris@codepen.io"}, "recent_news": "DevHunt Top (62K visits/mo); 3M+ public pens shared.", "category": "developer", "platform_badge": "DevHunt Top"},
    {"name": "freeCodeCamp", "domain": "freecodecamp.org", "industry": "Free Coding Curriculum", "description": "Learn to code for free with millions of learners worldwide", "compatibility_score": 90.0, "synergy_reason": "Co-promote free coding paths alongside structured gamified adventure curricula.", "executive_lead": {"name": "Quincy Larson", "role": "Founder", "email": "quincy@freecodecamp.org"}, "recent_news": "Alexa Top 1000; 40M+ page views/month; YouTube 9M+ subscribers.", "category": "education", "platform_badge": "Top 1000 Website"},
    {"name": "Roadmap.sh", "domain": "roadmap.sh", "industry": "Developer Learning Roadmaps", "description": "Community-driven developer roadmaps & learning guides", "compatibility_score": 89.0, "synergy_reason": "Integrate structured learning roadmaps to guide coding adventure progression paths.", "executive_lead": {"name": "Kamran Ahmed", "role": "Creator & Founder", "email": "kamran@roadmap.sh"}, "recent_news": "GitHub #1 Most Starred Educational Repo 2024; 250k+ monthly visitors.", "category": "education", "platform_badge": "GitHub #1 Educational"},
    {"name": "The Odin Project", "domain": "theodinproject.com", "industry": "Free Web Dev Curriculum", "description": "Free open-source full-stack web development curriculum", "compatibility_score": 87.0, "synergy_reason": "Co-promote project-based learning tracks alongside coding adventure quests.", "executive_lead": {"name": "Erik Trautman", "role": "Founder", "email": "erik@theodinproject.com"}, "recent_news": "GitHub OSS with 20k+ stars; 200k+ learners completed courses.", "category": "education", "platform_badge": "GitHub OSS"},
]

GENERAL_INDIE_CATALOG = [
    {"name": "Senja", "domain": "senja.io", "industry": "Testimonials & Social Proof", "description": "Collect, manage, and display video & text testimonials for SaaS", "compatibility_score": 95.0, "synergy_reason": "Cross-promote testimonial widgets to increase checkout conversion rates for joint customers.", "executive_lead": {"name": "Wilson Wilson", "role": "Co-founder", "email": "wilson@senja.io"}, "recent_news": "SaaSHub Verified (358K visits/mo); $45,000 MRR on TrustMRR.", "category": "marketing", "platform_badge": "SaaSHub #1"},
    {"name": "Tally Forms", "domain": "tally.so", "industry": "No-code Form Builder", "description": "The simplest free form builder for indie hackers and modern SaaS teams", "compatibility_score": 93.0, "synergy_reason": "Embed lead capture forms & automated survey triggers inside user onboarding flows.", "executive_lead": {"name": "Marie Martens", "role": "Co-founder", "email": "marie@tally.so"}, "recent_news": "Product Hunt Gold Standard & Uneed Featured (91K visits/mo).", "category": "marketing", "platform_badge": "Uneed Featured"},
    {"name": "Dubs.co", "domain": "dubs.co", "industry": "Link Infrastructure & Attribution", "description": "Open-source link management and short link attribution platform for SaaS", "compatibility_score": 92.0, "synergy_reason": "Bi-directional referral link tracking & partner campaign analytics integration.", "executive_lead": {"name": "Steven Tey", "role": "Founder", "email": "steven@dubs.co"}, "recent_news": "Peerlist Weekly Winner (199K visits/mo); TrustMRR #1.", "category": "marketing", "platform_badge": "Peerlist Winner"},
    {"name": "Mintlify", "domain": "mintlify.com", "industry": "Developer Documentation", "description": "Beautiful documentation platforms that convert developers into customers", "compatibility_score": 94.0, "synergy_reason": "Co-brand technical API guides and integration tutorials for developer audiences.", "executive_lead": {"name": "Han Wang", "role": "Co-founder & CEO", "email": "han@mintlify.com"}, "recent_news": "Show HN #1 & Peerlist Spotlight; $2.8M seed round.", "category": "developer", "platform_badge": "Show HN #1"},
    {"name": "Typebot", "domain": "typebot.io", "industry": "Conversational AI Forms", "description": "Open-source conversational chat builder for lead qualification", "compatibility_score": 90.0, "synergy_reason": "Integrate interactive chat widgets for high-converting customer onboarding.", "executive_lead": {"name": "Baptiste Arnaud", "role": "Creator & Founder", "email": "baptiste@typebot.io"}, "recent_news": "BetaList Curated (145K visits/mo); 10M chat executions/mo.", "category": "developer", "platform_badge": "BetaList Top"},
    {"name": "Unkey", "domain": "unkey.com", "industry": "API Key Management & Security", "description": "Open-source API key management and rate limiting platform for developer SaaS", "compatibility_score": 91.0, "synergy_reason": "Provide secure API key authorization & rate-limiting for joint developer tools.", "executive_lead": {"name": "James Perkins", "role": "Co-founder", "email": "james@unkey.com"}, "recent_news": "DevHunt #1 Developer Tool (62K visits/mo); YC backed.", "category": "developer", "platform_badge": "DevHunt #1"},
    {"name": "Polar.sh", "domain": "polar.sh", "industry": "Open Source Monetization", "description": "Merchant of Record & digital product monetization platform for indie developers", "compatibility_score": 89.0, "synergy_reason": "Automate revenue sharing & partner payout splits for joint digital products.", "executive_lead": {"name": "Birk Jernström", "role": "Founder & CEO", "email": "birk@polar.sh"}, "recent_news": "Microlaunch Spotlight (79K visits/mo); open-source MoR.", "category": "fintech", "platform_badge": "Microlaunch Top"},
    {"name": "Plunk", "domain": "useplunk.com", "industry": "Transactional Email Infrastructure", "description": "Open-source AWS SES email marketing and transactional platform for SaaS", "compatibility_score": 87.0, "synergy_reason": "Trigger transactional email notifications & co-branded partner newsletters.", "executive_lead": {"name": "Dries Bosman", "role": "Founder", "email": "dries@useplunk.com"}, "recent_news": "Fazier Product of the Day (17K visits/mo); 5,000 active instances.", "category": "developer", "platform_badge": "Fazier #1"},
    {"name": "Screen Studio", "domain": "screen.studio", "industry": "Screen Recording & Video Demos", "description": "Beautiful screen recording software for high-converting product demo videos", "compatibility_score": 88.0, "synergy_reason": "Co-market product demo video creation tools to SaaS founders.", "executive_lead": {"name": "Adam Pitts", "role": "Founder", "email": "adam@screen.studio"}, "recent_news": "Indie Hackers Featured (DR 80); $60,000 MRR.", "category": "marketing", "platform_badge": "Indie Hackers Top"},
    {"name": "Formbricks", "domain": "formbricks.com", "industry": "In-app Experience & Surveys", "description": "Open-source user feedback and in-app survey infrastructure", "compatibility_score": 86.0, "synergy_reason": "Run joint customer satisfaction (CSAT) and churn prevention surveys.", "executive_lead": {"name": "Johannes Abele", "role": "Co-founder", "email": "johannes@formbricks.com"}, "recent_news": "DevHunt & Peerlist Featured; $1.6M seed round.", "category": "marketing", "platform_badge": "DevHunt Featured"},
]


# ─────────────────────────────────────────────────────────────────────────────
# TAVILY WEB SEARCH ENGINE (primary discovery method)
# ─────────────────────────────────────────────────────────────────────────────

class TavilyDiscoveryEngine:
    """
    Uses Tavily Search API to find REAL, live, niche-specific SaaS partners
    for any domain by querying the live internet.
    """
    TAVILY_ENDPOINT = "https://api.tavily.com/search"

    async def search_partners(self, domain: str, brand: str, niche_description: str) -> List[Dict[str, Any]]:
        """
        Queries Tavily for real indie SaaS companies that would make good partners
        for the given domain, then parses the results using Featherless LLM.
        """
        if not settings.TAVILY_API_KEY:
            return []

        # Build a highly specific search query based on the scraped niche
        query = (
            f"indie SaaS startups similar to {brand} ({domain}) that could form partnerships "
            f"in {niche_description}. "
            f"Find bootstrapped or early-stage SaaS products on Product Hunt, Peerlist, "
            f"TrustMRR, DevHunt, SaaSHub that serve the same developer or user audience. "
            f"Include their website, founder name, and why they would partner with {brand}."
        )

        try:
            async with httpx.AsyncClient(timeout=12.0) as client:
                res = await client.post(
                    self.TAVILY_ENDPOINT,
                    json={
                        "api_key": settings.TAVILY_API_KEY,
                        "query": query,
                        "search_depth": "advanced",
                        "max_results": 10,
                        "include_answer": True,
                        "include_domains": [
                            "producthunt.com", "peerlist.io", "saashub.com",
                            "uneed.best", "devhunt.org", "betalist.com",
                            "indiehackers.com", "trustmrr.com", "news.ycombinator.com"
                        ],
                    },
                )
                if res.status_code != 200:
                    logger.warning(f"Tavily returned {res.status_code}: {res.text[:200]}")
                    return []

                tavily_data = res.json()
                raw_answer = tavily_data.get("answer", "")
                raw_results = tavily_data.get("results", [])

                # Feed Tavily results into LLM to extract structured partner list
                partners = await self._extract_partners_from_tavily(
                    domain, brand, niche_description, raw_answer, raw_results
                )
                return partners

        except Exception as e:
            logger.warning(f"Tavily search failed for {domain}: {e}")
            return []

    async def _extract_partners_from_tavily(
        self,
        domain: str,
        brand: str,
        niche: str,
        answer: str,
        results: list,
    ) -> List[Dict[str, Any]]:
        """Uses Featherless LLM to parse Tavily web search results into structured partner objects."""
        if not settings.FEATHERLESS_API_KEY:
            return []

        snippets = "\n\n".join(
            f"- Title: {r.get('title', '')}\n  URL: {r.get('url', '')}\n  Content: {r.get('content', '')[:300]}"
            for r in results[:8]
        )

        prompt = f"""
You are Orbit, an autonomous B2B SaaS Partnership AI.

The user's SaaS is "{brand}" ({domain}), which operates in: {niche}

Below are real web search results from Product Hunt, Peerlist, TrustMRR, and SaaSHub about similar indie SaaS companies.
Tavily Answer: {answer[:500]}

Web Results:
{snippets}

From these results, identify 6 to 8 REAL independent SaaS companies that would make genuine partnership or co-marketing candidates for {brand}.

STRICT RULES:
- Only include real products with actual domains you can verify from the search results
- No huge enterprises (Google, Stripe, Notion, Salesforce, Microsoft)
- Only indie/bootstrapped/early-stage SaaS companies
- Partnership must make logical sense for {brand}'s niche: {niche}

Return ONLY a valid JSON array. Each object must have EXACTLY these keys:
{{
  "name": "Product Name",
  "domain": "actual-domain.com",
  "industry": "their industry niche",
  "description": "1-2 sentence description",
  "compatibility_score": 88.5,
  "synergy_reason": "Specific co-marketing / integration reason tailored to {brand}",
  "executive_lead": {{"name": "Founder Name", "role": "CEO / Founder", "email": "founder@domain.com"}},
  "recent_news": "Platform signal e.g. Product Hunt #1 or TrustMRR Featured",
  "platform_badge": "Product Hunt #1"
}}
"""

        headers = {
            "Authorization": f"Bearer {settings.FEATHERLESS_API_KEY}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": settings.FEATHERLESS_MODEL,
            "messages": [
                {"role": "system", "content": "You are a B2B SaaS Partnership AI. Output valid JSON arrays only. No markdown, no explanation."},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.3,
            "max_tokens": 2000,
        }

        async with httpx.AsyncClient(timeout=20.0) as client:
            res = await client.post(
                "https://api.featherless.ai/v1/chat/completions",
                headers=headers,
                json=payload,
            )
            if res.status_code != 200:
                return []

            content = res.json()["choices"][0]["message"]["content"].strip()
            # Strip markdown fences if present
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()

            parsed = json.loads(content)
            if isinstance(parsed, list) and len(parsed) >= 2:
                return parsed

        return []


# ─────────────────────────────────────────────────────────────────────────────
# DISCOVERY SERVICE (orchestrates all three methods)
# ─────────────────────────────────────────────────────────────────────────────

class DiscoveryService:
    def __init__(self):
        self.tavily = TavilyDiscoveryEngine()

    async def discover_top_partners(self, domain: str) -> List[Dict[str, Any]]:
        """
        Given ANY SaaS website domain, detects its niche from domain signals
        and metadata, then finds real partner companies via:
          1. Tavily web search (live internet)
          2. Featherless LLM (AI-generated, niche-aware)
          3. Static niche catalogs (guaranteed fallback, always 6–10 results)
        """
        domain_clean = domain.lower().replace("https://", "").replace("http://", "").replace("www.", "").strip("/")
        if "/" in domain_clean:
            domain_clean = domain_clean.split("/")[0]

        # Smart brand name derivation
        brand_overrides = {
            "magicui": "Magic UI",
            "superx": "Superx",
            "codedex": "Codedex",
        }
        brand_name = next(
            (v for k, v in brand_overrides.items() if k in domain_clean),
            domain_clean.split(".")[0].capitalize() if "." in domain_clean else domain_clean.capitalize()
        )

        # Detect niche
        niche_catalog, niche_description = self._detect_niche(domain_clean)

        # 1. Try Tavily live web search
        try:
            tavily_results = await self.tavily.search_partners(domain_clean, brand_name, niche_description)
            if tavily_results and len(tavily_results) >= 4:
                logger.info(f"Tavily returned {len(tavily_results)} partners for {domain_clean}")
                return tavily_results
        except Exception as e:
            logger.warning(f"Tavily discovery failed: {e}")

        # 2. Try Featherless LLM
        try:
            llm_results = await self._discover_via_llm(domain_clean, brand_name, niche_description)
            if llm_results and len(llm_results) >= 4:
                logger.info(f"LLM returned {len(llm_results)} partners for {domain_clean}")
                return llm_results
        except Exception as e:
            logger.warning(f"LLM discovery failed: {e}")

        # 3. Static catalog fallback — always returns 6–10 results
        logger.info(f"Using static catalog for {domain_clean} (niche: {niche_description})")
        return self._customize_partners(niche_catalog, domain_clean, brand_name)

    def _detect_niche(self, domain_clean: str):
        """
        Returns (catalog, niche_description) based on domain signal keywords.
        Always returns the full niche catalog (never filters down to 2 companies).
        """
        if any(k in domain_clean for k in ["ui", "design", "component", "tailwind", "css", "icon", "theme", "framer", "shadcn", "magic", "aceternity"]):
            return UI_DESIGN_CATALOG, "UI component libraries, design systems, and frontend developer tools"

        if any(k in domain_clean for k in ["codedex", "learn", "course", "bootcamp", "academy", "school", "teach", "edu", "tutorial", "quiz", "lesson", "exercise", "challenge"]):
            return EDUCATION_CODING_CATALOG, "coding education, gamified learning, and developer upskilling platforms"

        if any(k in domain_clean for k in ["superx", "twitter", "tweet", "linkedin", "social", "content", "creator", "hype", "taplio", "typefully"]):
            return CREATOR_SOCIAL_CATALOG, "social media growth, content creation, and creator monetization tools"

        # Default: return full general catalog (never filter by sub-category — avoids the 2-result bug)
        return GENERAL_INDIE_CATALOG, "B2B SaaS, developer tools, and indie founder products"

    def _customize_partners(self, partners: List[Dict[str, Any]], domain: str, brand: str) -> List[Dict[str, Any]]:
        """
        Preserves niche-specific catalog synergy reasons — only injects the brand name.
        Never overwrites with generic strings.
        """
        customized = []
        for p in partners:
            item = dict(p)
            base = p.get("synergy_reason", "")
            # Inject brand name contextually without losing specificity
            item["synergy_reason"] = (
                base
                .replace("joint customers", f"{brand} customers")
                .replace("user onboarding flows", f"{brand} onboarding")
                .replace("SaaS founders", f"{brand} users")
            ) if base else f"Co-market {brand} with {p['name']} to reach shared niche audiences."
            customized.append(item)
        return customized

    async def _discover_via_llm(self, domain: str, brand: str, niche: str) -> List[Dict[str, Any]]:
        """Featherless LLM fallback — niche-aware partner discovery without web search."""
        if not settings.FEATHERLESS_API_KEY:
            return []

        prompt = f"""
You are Orbit, a B2B SaaS Partnership AI.

The user's product is "{brand}" ({domain}) which operates in: {niche}

Identify 6-8 REAL independent SaaS companies from Product Hunt, Peerlist, DevHunt, SaaSHub, TrustMRR that match this niche exactly.

RULES:
- No enterprise giants (Google, Microsoft, Stripe, Salesforce, Adobe, Notion, Slack)
- Only indie/bootstrapped/early-stage companies with real domains
- Partnership must be genuinely valuable for {brand}'s niche

Return ONLY a valid JSON array with objects containing:
name, domain, industry, description, compatibility_score (float), synergy_reason, executive_lead ({{name, role, email}}), recent_news, platform_badge
"""
        headers = {"Authorization": f"Bearer {settings.FEATHERLESS_API_KEY}", "Content-Type": "application/json"}
        payload = {
            "model": settings.FEATHERLESS_MODEL,
            "messages": [
                {"role": "system", "content": "Output valid JSON only. No markdown fences."},
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.3,
            "max_tokens": 1800,
        }
        async with httpx.AsyncClient(timeout=16.0) as client:
            res = await client.post("https://api.featherless.ai/v1/chat/completions", headers=headers, json=payload)
            if res.status_code != 200:
                return []
            content = res.json()["choices"][0]["message"]["content"].strip()
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()
            parsed = json.loads(content)
            return parsed if isinstance(parsed, list) and len(parsed) >= 2 else []
