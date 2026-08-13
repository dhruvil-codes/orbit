"""
Research Domain - Company Research Engine
Scrapes live website metadata, developer platform endpoints, and strategic context.
"""
import logging
from typing import Dict, Any, List
import httpx
from bs4 import BeautifulSoup

logger = logging.getLogger("orbit.company_research")


class CompanyResearchEngine:
    def __init__(self, timeout: float = 2.0):
        self.timeout = timeout
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OrbitBot/1.0"
        }

    async def analyze_company(self, domain: str) -> Dict[str, Any]:
        """
        Scrapes and extracts live strategic context for a SaaS company domain.
        Parses title, meta description, og:description, developer/API links, and tech signals.
        """
        clean_domain = domain.replace("https://", "").replace("http://", "").strip("/")
        url = f"https://{clean_domain}"

        scraped_data = {
            "domain": clean_domain,
            "url": url,
            "title": "",
            "description": "",
            "keywords": [],
            "has_developer_api": False,
            "developer_links": [],
            "tech_signals": [],
            "status": "fallback"
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout, follow_redirects=True, headers=self.headers) as client:
                response = await client.get(url)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, "html.parser")

                    # Title
                    title_tag = soup.find("title")
                    if title_tag and title_tag.text:
                        scraped_data["title"] = title_tag.text.strip()

                    # Description (meta description or og:description)
                    meta_desc = (
                        soup.find("meta", attrs={"name": "description"})
                        or soup.find("meta", attrs={"property": "og:description"})
                    )
                    if meta_desc and meta_desc.get("content"):
                        scraped_data["description"] = meta_desc.get("content").strip()

                    # Keywords
                    meta_kw = soup.find("meta", attrs={"name": "keywords"})
                    if meta_kw and meta_kw.get("content"):
                        scraped_data["keywords"] = [k.strip() for k in meta_kw.get("content").split(",")]

                    # Developer API & Integration Signal Detection
                    api_keywords = ["api", "docs", "developer", "developers", "integration", "integrations", "webhooks"]
                    dev_links: List[str] = []

                    for a in soup.find_all("a", href=True):
                        href = a["href"].lower()
                        link_text = a.text.lower()
                        if any(kw in href or kw in link_text for kw in api_keywords):
                            full_link = href if href.startswith("http") else f"https://{clean_domain}{href}"
                            if full_link not in dev_links:
                                dev_links.append(full_link)

                    if dev_links:
                        scraped_data["has_developer_api"] = True
                        scraped_data["developer_links"] = dev_links[:5]

                    scraped_data["status"] = "scraped"
                    logger.info(f"Successfully scraped research for domain: {clean_domain}")

        except Exception as e:
            logger.warning(f"Could not scrape domain '{clean_domain}': {e}. Using fallback research context.")

        # Fallback enrichment if description was empty
        if not scraped_data["description"]:
            scraped_data["description"] = f"Modern B2B SaaS platform operating on {clean_domain}."

        return scraped_data
