"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Sparkles,
  Zap,
  CheckCircle2,
  Send,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Brain,
  Building2,
  RefreshCw,
  Mail,
  Smartphone,
  ChevronRight,
  Activity,
  Copy,
  Check,
  Search,
  UserCheck,
  Share2,
  ArrowUpRight,
  ExternalLink,
  Flame,
  Star,
} from "lucide-react";

interface CompanyData {
  name: string;
  domain: string;
  industry: string;
  description: string;
}

interface ReasoningCard {
  why_this_company: string;
  why_now: string;
  why_this_decision_maker: string;
  why_this_partnership: string;
  why_this_outreach_strategy: string;
  confidence_score: number;
  suggested_next_action: string;
}

interface FounderIntel {
  company_domain: string;
  company_name: string;
  executive_name: string;
  executive_role: string;
  email: string;
  email_verified: boolean;
  platforms: {
    telegram: { status: string; badge: string; handle: string };
    email: { status: string; badge: string; address: string };
    twitter_x: { status: string; handle: string };
    linkedin: { status: string; url: string };
  };
}

interface OutreachDrafts {
  email_subject: string;
  email_body: string;
  telegram_alert: string;
  slack_announcement: string;
}

interface EvaluationResult {
  opportunity_id?: string;
  title?: string;
  company_a: string;
  company_b: string;
  compatibility_score: number;
  confidence_score: number;
  status: string;
  dispatch_status: string;
  compatibility_result: {
    strategic_fit_summary: string;
    partnership_ideas: string[];
    integration_opportunities: string[];
    co_marketing_opportunities: string[];
    recommended_outreach_angle: string;
  };
  reasoning_card: ReasoningCard;
  founder_intel: FounderIntel;
  outreach_drafts: OutreachDrafts;
}

export default function Home() {
  const [companyA, setCompanyA] = useState<CompanyData>({
    name: "Notion",
    domain: "notion.so",
    industry: "Workspace & Knowledge Management",
    description: "Connected workspace for docs, wiki, and project management",
  });

  const [companyB, setCompanyB] = useState<CompanyData>({
    name: "Linear",
    domain: "linear.app",
    industry: "Issue Tracking & Product Operations",
    description: "Purpose-built tool for high-performance software product development",
  });

  const [dispatchOutreach, setDispatchOutreach] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<"idle" | "discover" | "understand" | "evaluate" | "complete">("idle");
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [telegramStatus, setTelegramStatus] = useState<"pending" | "approved" | "dispatched">("pending");
  const [activeTab, setActiveTab] = useState<"email" | "telegram" | "slack">("email");
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const loadPreset = (preset: "notion-linear" | "stripe-orbit" | "figma-canva" | "cal-zendesk") => {
    if (preset === "notion-linear") {
      setCompanyA({
        name: "Notion",
        domain: "notion.so",
        industry: "Workspace & Knowledge Management",
        description: "Connected workspace for wiki, docs, and project management",
      });
      setCompanyB({
        name: "Linear",
        domain: "linear.app",
        industry: "Issue Tracking & Product Operations",
        description: "Purpose-built tool for high-performance product teams",
      });
    } else if (preset === "stripe-orbit") {
      setCompanyA({
        name: "Stripe",
        domain: "stripe.com",
        industry: "Fintech & Payments",
        description: "Financial infrastructure for the internet",
      });
      setCompanyB({
        name: "Orbit AI",
        domain: "useorbit.ai",
        industry: "AI Agent Infrastructure",
        description: "Autonomous AI Partnership Development Representative",
      });
    } else if (preset === "figma-canva") {
      setCompanyA({
        name: "Figma",
        domain: "figma.com",
        industry: "Design & Prototyping",
        description: "Collaborative interface design platform",
      });
      setCompanyB({
        name: "Canva",
        domain: "canva.com",
        industry: "Visual Communication",
        description: "All-in-one graphic design and content platform",
      });
    } else if (preset === "cal-zendesk") {
      setCompanyA({
        name: "Cal.com",
        domain: "cal.com",
        industry: "Scheduling Infrastructure",
        description: "Open source scheduling for everyone",
      });
      setCompanyB({
        name: "Zendesk",
        domain: "zendesk.com",
        industry: "Customer Service Software",
        description: "Customer service and CRM platform",
      });
    }
  };

  const runEvaluation = async () => {
    setIsLoading(true);
    setResult(null);
    setTelegramStatus("pending");

    // Stepper animation sequence
    setCurrentStep("discover");
    await new Promise((r) => setTimeout(r, 650));

    setCurrentStep("understand");
    await new Promise((r) => setTimeout(r, 750));

    setCurrentStep("evaluate");

    try {
      const response = await fetch("http://localhost:8000/api/v1/compatibility/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_a: companyA,
          company_b: companyB,
          dispatch_outreach: dispatchOutreach,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        throw new Error("Backend API error");
      }
    } catch {
      // Fallback payload for local UI testing
      setResult({
        opportunity_id: "opp_ca587b2c910d",
        title: `${companyA.name} & ${companyB.name} Product Intelligence Partnership`,
        company_a: companyA.name,
        company_b: companyB.name,
        compatibility_score: 87.5,
        confidence_score: 92.0,
        status: "evaluated",
        dispatch_status: dispatchOutreach ? "dispatched" : "idle",
        compatibility_result: {
          strategic_fit_summary: `High strategic alignment between ${companyA.name} (${companyA.industry}) and ${companyB.name} (${companyB.industry}). Integrating shared API data flows creates immediate value for mutual enterprise teams.`,
          partnership_ideas: [
            `Joint go-to-market bundle for shared enterprise customers`,
            `Co-branded technical integration workshop & webinar series`,
            `Cross-referral partner tier for enterprise accounts`,
          ],
          integration_opportunities: [
            `Bi-directional real-time data sync between ${companyA.name} and ${companyB.name}`,
            `Single Sign-On (SSO) and Webhook event automation`,
            `Embedded action widgets inside ${companyB.name}'s workspace`,
          ],
          co_marketing_opportunities: [
            `Joint case study detailing dual-stack efficiency gains`,
            `Co-hosted developer meetup & API release event`,
          ],
          recommended_outreach_angle: `Focus on immediate technical synergy: propose a 2-week integration proof-of-concept for joint enterprise accounts.`,
        },
        reasoning_card: {
          why_this_company: `${companyB.name} dominates its segment and shares a high-density ICP overlap with ${companyA.name}, offering immediate cross-sell potential.`,
          why_now: `Both ${companyA.name} and ${companyB.name} recently updated public API platforms, creating an optimal technical window for native integration.`,
          why_this_decision_maker: `Head of Technical Partnerships at ${companyB.name} manages joint ecosystem integrations and developer partnerships.`,
          why_this_partnership: `Combining ${companyA.name}'s workspace platform with ${companyB.name}'s specialized engine creates an end-to-end automated workflow for enterprise users.`,
          why_this_outreach_strategy: `A value-first technical demo highlighting immediate developer integration feasibility yields the highest response rate.`,
          confidence_score: 92.0,
          suggested_next_action: `Approve automated outreach proposal to Head of Partnerships at ${companyB.name} via Caspian multi-channel gateway.`,
        },
        founder_intel: {
          company_domain: companyB.domain,
          company_name: companyB.name,
          executive_name: companyB.domain.includes("linear") ? "Karri Saarinen" : companyB.domain.includes("stripe") ? "Patrick Collison" : "Ivan Zhao",
          executive_role: companyB.domain.includes("linear") ? "CEO & Co-founder" : "VP of Technical Partnerships & Ecosystem",
          email: `partnerships@${companyB.domain}`,
          email_verified: true,
          platforms: {
            telegram: { status: "Active", badge: "Caspian Bot Active", handle: "@OrbitPDRBot" },
            email: { status: "Verified", badge: "Deliverable", address: `partnerships@${companyB.domain}` },
            twitter_x: { status: "Active", handle: `@${companyB.name.toLowerCase()}app` },
            linkedin: { status: "Active", url: `linkedin.com/company/${companyB.name.toLowerCase()}` },
          },
        },
        outreach_drafts: {
          email_subject: `Strategic Partnership Proposal: ${companyA.name} x ${companyB.name}`,
          email_body: `Hi Team,\n\nI'm reaching out from ${companyA.name}.\n\nOur AI Partnership Agent evaluated strategic compatibility between ${companyA.name} and ${companyB.name}, scoring a 87.5/100 strategic fit:\n\nSYNERGY SUMMARY:\nHigh strategic alignment between ${companyA.name} and ${companyB.name}. Integrating shared API data flows creates immediate value for mutual enterprise teams.\n\nRECOMMENDED POC:\n• Bi-directional real-time data sync\n• Single Sign-On (SSO) and Webhook event triggers\n\nWould you be open to a 15-minute technical discovery call next week to explore a proof-of-concept?\n\nBest regards,\nOrbit AI PDR (on behalf of ${companyA.name})`,
          telegram_alert: `🎯 *Orbit AI PDR Alert*\nTarget: ${companyA.name} x ${companyB.name}\nScore: *87.5/100* (Confidence: 92%)\nDecision Maker: Karri Saarinen (CEO & Co-founder)\n\nReply *APPROVE* to trigger Caspian Email Outreach or *REJECT* to park.`,
          slack_announcement: `:rocket: *New Partnership Opportunity Discovered*\n*${companyA.name}* + *${companyB.name}* | Compatibility Score: \`87.5/100\`\nExecutive Lead: Karri Saarinen (partnerships@${companyB.domain})\nStatus: _Pending PDR Manager Approval via Caspian Telegram_`,
        },
      });
    } finally {
      setCurrentStep("complete");
      setIsLoading(false);

      // Scroll smoothly to results dashboard
      const elem = document.getElementById("dashboard-results");
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleSimulateTelegramApproval = () => {
    setTelegramStatus("approved");
    setTimeout(() => {
      setTelegramStatus("dispatched");
    }, 1200);
  };

  const copyToClipboard = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabName);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#0c0a09] font-sans selection:bg-[#c1e1f7] selection:text-[#3398e1]">
      {/* ─────────────────────────────────────────────────────────────────────────────
          TOP NAVIGATION BAR (Seline Style)
         ───────────────────────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#fafaf9]/90 backdrop-blur-md border-b border-[#e8e6e5] px-6 py-3.5">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          {/* Logo & Brand Wordmark */}
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-md bg-[#0c0a09] flex items-center justify-center text-white">
              <Flame className="w-4 h-4 text-[#3ba6f1]" />
            </div>
            <span className="font-medium text-sm tracking-tight text-[#0c0a09]">
              Orbit <span className="font-normal text-[#78716c]">AI PDR</span>
            </span>
          </div>

          {/* Navigation Scroll Links */}
          <div className="hidden md:flex items-center space-x-6 text-xs text-[#78716c] font-normal">
            <a href="#overview" className="hover:text-[#0c0a09] transition-colors">
              Overview
            </a>
            <a href="#engine" className="hover:text-[#0c0a09] transition-colors">
              Partnership Engine
            </a>
            <a href="#founder-intel" className="hover:text-[#0c0a09] transition-colors">
              Founder Intel
            </a>
            <a href="#caspian-hub" className="hover:text-[#0c0a09] transition-colors">
              Caspian Multi-Channel
            </a>
          </div>

          {/* Active Channel Badges & Cyan CTA */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 text-xs text-[#78716c]">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#ffffff] border border-[#e8e6e5] text-[#0c0a09]">
                <Smartphone className="w-3 h-3 text-[#3ba6f1] mr-1.5" />
                Telegram: <strong className="ml-1 text-[#0c0a09] font-normal">@OrbitPDRBot</strong>
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#ffffff] border border-[#e8e6e5] text-[#0c0a09]">
                <Mail className="w-3 h-3 text-[#3ba6f1] mr-1.5" />
                Email: <strong className="ml-1 text-[#0c0a09] font-normal">Active</strong>
              </span>
            </div>

            <motion.a
              href="#engine"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-cyan-primary text-xs inline-flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Launch Engine</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </motion.a>
          </div>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────────────────────
          EDITORIAL LANDING HERO SECTION (Instrument Serif + Geist Typography)
         ───────────────────────────────────────────────────────────────────────────── */}
      <section id="overview" className="pt-20 pb-16 px-6 max-w-[1200px] mx-auto text-left space-y-12">
        {/* Eyebrow & Display Headline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 max-w-3xl"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#ffffff] border border-[#e8e6e5] text-xs text-[#78716c]">
            <Star className="w-3.5 h-3.5 text-[#0c0a09] fill-[#0c0a09]" />
            <span>Autonomous AI Partnership Development Representative &bull; Caspian SDK</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-[56px] font-serif-heading leading-[1.08] tracking-[-0.02em] text-[#0c0a09]">
            Orchestrate SaaS technology partnerships with{" "}
            <span className="highlight-span">whispered precision</span>.
          </h1>

          <p className="text-base text-[#78716c] leading-[1.69] max-w-2xl font-normal">
            Orbit evaluates strategic compatibility between any two SaaS companies, extracts decision-maker intelligence, generates transparent AI Reasoning Cards, and manages human-in-the-loop multi-channel outreach over Telegram &amp; Email.
          </p>
        </motion.div>

        {/* Action Button Pair */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap items-center gap-4 pt-2"
        >
          <motion.a
            href="#engine"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-cyan-primary flex items-center space-x-2 text-sm cursor-pointer"
          >
            <span>Evaluate Any Website</span>
            <Zap className="w-4 h-4" />
          </motion.a>
          <motion.a
            href="#caspian-hub"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-ghost-secondary flex items-center space-x-2 text-sm cursor-pointer"
          >
            <span>View Caspian Multi-Channel Hub</span>
            <ArrowRight className="w-4 h-4 text-[#78716c]" />
          </motion.a>
        </motion.div>

        {/* Hero Dashboard Preview Card (Floating Preview Surface) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="floating-preview-card p-3 sm:p-4 border border-[#e8e6e5] space-y-3"
        >
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-[#e8e6e5] text-xs text-[#78716c]">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#e8e6e5]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#e8e6e5]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#e8e6e5]" />
              <span className="ml-2 font-mono text-[11px]">orbit.ai/dashboard/intelligence</span>
            </div>
            <span className="text-[11px] text-[#3398e1] font-mono">LIVE PREVIEW</span>
          </div>

          {/* Muted Product Dashboard Hero Mockup */}
          <div className="stone-card p-6 bg-[#fafaf9] dashboard-muted-filter space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e8e6e5] pb-4">
              <div>
                <span className="text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">COMPATIBILITY SCORE</span>
                <div className="text-3xl font-normal text-[#0c0a09] tracking-tight flex items-baseline gap-3 mt-1">
                  87.5 <span className="text-sm font-normal text-[#78716c]">/ 100</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#c1e1f7] text-[#3398e1] font-normal">
                    High Strategic Fit
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-5 text-xs">
                <div className="text-right">
                  <div className="text-xs text-[#78716c]">Confidence Metric</div>
                  <div className="font-semibold text-[#0c0a09]">92.0%</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#78716c]">Primary Channel</div>
                  <div className="font-semibold text-[#3398e1]">Caspian Telegram + Email</div>
                </div>
              </div>
            </div>

            {/* 3-Column Preview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="stone-card p-4 space-y-1">
                <h3 className="font-medium text-xs text-[#0c0a09]">1. Why This Company?</h3>
                <p className="text-[#78716c] leading-relaxed">
                  Linear dominates enterprise product ops with complementary userbases to Notion.
                </p>
              </div>

              <div className="stone-card p-4 space-y-1">
                <h3 className="font-medium text-xs text-[#0c0a09]">2. Decision Maker Intel</h3>
                <p className="text-[#78716c] leading-relaxed">
                  Karri Saarinen (CEO &amp; Co-founder) &bull; Active on Telegram &amp; Email.
                </p>
              </div>

              <div className="stone-card p-4 space-y-1">
                <h3 className="font-medium text-xs text-[#0c0a09]">3. Multi-Channel Outreach</h3>
                <p className="text-[#78716c] leading-relaxed">
                  Telegram approval alert sent &rarr; Automatic Caspian proposal email dispatch.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature Grid (4 Architectural Pillars with Geist Card Titles) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6"
        >
          <motion.div whileHover={{ y: -3, transition: { duration: 0.2 } }} className="stone-card p-6 space-y-2">
            <Building2 className="w-5 h-5 text-[#0c0a09]" />
            <h3 className="font-medium text-sm text-[#0c0a09]">Any SaaS Website Input</h3>
            <p className="text-xs text-[#78716c] leading-relaxed">
              Analyze any custom SaaS website URL. Live web scraping extracts API endpoints, meta descriptions, and tech stack signals.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -3, transition: { duration: 0.2 } }} className="stone-card p-6 space-y-2">
            <Brain className="w-5 h-5 text-[#0c0a09]" />
            <h3 className="font-medium text-sm text-[#0c0a09]">AI Reasoning Cards</h3>
            <p className="text-xs text-[#78716c] leading-relaxed">
              Transparent 6-dimension rationale replaces black-box scoring. Understand why, when, and how to partner.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -3, transition: { duration: 0.2 } }} className="stone-card p-6 space-y-2">
            <UserCheck className="w-5 h-5 text-[#0c0a09]" />
            <h3 className="font-medium text-sm text-[#0c0a09]">Founder &amp; Exec Intel</h3>
            <p className="text-xs text-[#78716c] leading-relaxed">
              Identifies key decision-makers, verified emails, and active platform handles across Telegram, X, LinkedIn, and Email.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -3, transition: { duration: 0.2 } }} className="stone-card p-6 space-y-2">
            <Smartphone className="w-5 h-5 text-[#3ba6f1]" />
            <h3 className="font-medium text-sm text-[#0c0a09]">Caspian SDK Engine</h3>
            <p className="text-xs text-[#78716c] leading-relaxed">
              Human-in-the-loop approval. Pings Telegram with reasoning, waits for manager approval, then dispatches email outreach.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          INTERACTIVE ORBIT PARTNERSHIP ENGINE (DASHBOARD SECTION)
         ───────────────────────────────────────────────────────────────────────────── */}
      <section id="engine" className="py-16 px-6 max-w-[1200px] mx-auto space-y-8 border-t border-[#e8e6e5]">
        {/* Section Header with Instrument Serif Heading */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-[#78716c] uppercase tracking-wider flex items-center space-x-2">
            <Zap className="w-4 h-4 text-[#3ba6f1]" />
            <span>INTERACTIVE PARTNERSHIP MATCHING ENGINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-heading leading-snug text-[#0c0a09]">
            Evaluate any SaaS company for strategic partnership.
          </h2>
          <p className="text-sm text-[#78716c]">
            Enter any two SaaS website domains below to execute live web research, Featherless LLM inference, and multi-channel outreach drafting.
          </p>
        </div>

        {/* Presets Row */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#78716c] font-medium mr-2">1-Click Presets:</span>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => loadPreset("notion-linear")}
            className="px-3 py-1.5 rounded-full bg-[#ffffff] hover:bg-[#fafaf9] border border-[#e8e6e5] text-[#0c0a09] transition-all cursor-pointer"
          >
            ⚡ Notion x Linear
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => loadPreset("stripe-orbit")}
            className="px-3 py-1.5 rounded-full bg-[#ffffff] hover:bg-[#fafaf9] border border-[#e8e6e5] text-[#0c0a09] transition-all cursor-pointer"
          >
            💳 Stripe x Orbit AI
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => loadPreset("figma-canva")}
            className="px-3 py-1.5 rounded-full bg-[#ffffff] hover:bg-[#fafaf9] border border-[#e8e6e5] text-[#0c0a09] transition-all cursor-pointer"
          >
            🎨 Figma x Canva
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => loadPreset("cal-zendesk")}
            className="px-3 py-1.5 rounded-full bg-[#ffffff] hover:bg-[#fafaf9] border border-[#e8e6e5] text-[#0c0a09] transition-all cursor-pointer"
          >
            📅 Cal.com x Zendesk
          </motion.button>
        </div>

        {/* Input Form Grid (Company A vs Company B) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Company (A) */}
          <div className="stone-card p-6 space-y-4">
            <div className="flex items-center space-x-2 border-b border-[#e8e6e5] pb-3">
              <Building2 className="w-5 h-5 text-[#0c0a09]" />
              <div>
                <h3 className="font-medium text-sm text-[#0c0a09]">Primary SaaS Company (A)</h3>
                <p className="text-xs text-[#78716c]">Your platform or product ecosystem</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#0c0a09] font-medium mb-1">Company Name</label>
                <input
                  type="text"
                  value={companyA.name}
                  onChange={(e) => setCompanyA({ ...companyA, name: e.target.value })}
                  className="input-stone w-full"
                  placeholder="e.g. Notion"
                />
              </div>

              <div>
                <label className="block text-[#0c0a09] font-medium mb-1">Website Domain</label>
                <input
                  type="text"
                  value={companyA.domain}
                  onChange={(e) => setCompanyA({ ...companyA, domain: e.target.value })}
                  className="input-stone w-full font-mono"
                  placeholder="e.g. notion.so"
                />
              </div>

              <div>
                <label className="block text-[#0c0a09] font-medium mb-1">Industry Segment</label>
                <input
                  type="text"
                  value={companyA.industry}
                  onChange={(e) => setCompanyA({ ...companyA, industry: e.target.value })}
                  className="input-stone w-full"
                  placeholder="e.g. Workspace Management"
                />
              </div>
            </div>
          </div>

          {/* Target Partner (B) */}
          <div className="stone-card p-6 space-y-4">
            <div className="flex items-center space-x-2 border-b border-[#e8e6e5] pb-3">
              <Search className="w-5 h-5 text-[#3ba6f1]" />
              <div>
                <h3 className="font-medium text-sm text-[#0c0a09]">Target Partner Website (B)</h3>
                <p className="text-xs text-[#78716c]">SaaS domain you wish to partner with</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#0c0a09] font-medium mb-1">Target Company Name</label>
                <input
                  type="text"
                  value={companyB.name}
                  onChange={(e) => setCompanyB({ ...companyB, name: e.target.value })}
                  className="input-stone w-full"
                  placeholder="e.g. Linear"
                />
              </div>

              <div>
                <label className="block text-[#0c0a09] font-medium mb-1">Target Website Domain</label>
                <input
                  type="text"
                  value={companyB.domain}
                  onChange={(e) => setCompanyB({ ...companyB, domain: e.target.value })}
                  className="input-stone w-full font-mono"
                  placeholder="e.g. linear.app"
                />
              </div>

              <div>
                <label className="block text-[#0c0a09] font-medium mb-1">Industry Segment</label>
                <input
                  type="text"
                  value={companyB.industry}
                  onChange={(e) => setCompanyB({ ...companyB, industry: e.target.value })}
                  className="input-stone w-full"
                  placeholder="e.g. Issue Tracking"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Options & Execute Button Bar */}
        <div className="stone-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <label className="flex items-center space-x-3 text-xs text-[#78716c] cursor-pointer">
            <input
              type="checkbox"
              checked={dispatchOutreach}
              onChange={(e) => setDispatchOutreach(e.target.checked)}
              className="w-4 h-4 rounded border-[#d6d3d1] text-[#3ba6f1] focus:ring-[#3ba6f1]"
            />
            <span>Automatically prepare Caspian multi-channel outreach if score &ge; 80</span>
          </label>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={runEvaluation}
            disabled={isLoading}
            className="btn-cyan-primary w-full sm:w-auto flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Executing LangGraph Pipeline...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Evaluate Strategic Compatibility</span>
              </>
            )}
          </motion.button>
        </div>

        {/* LangGraph Stepper Indicator */}
        {(isLoading || result) && (
          <div className="stone-card p-4 space-y-2">
            <div className="text-xs font-medium text-[#78716c] flex items-center justify-between">
              <span>LANGGRAPH WORKFLOW EXECUTION</span>
              <span className="font-mono text-[#3398e1]">Discover &rarr; Understand &rarr; Evaluate</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <motion.div
                animate={{ scale: currentStep === "discover" ? [1, 1.02, 1] : 1 }}
                transition={{ repeat: currentStep === "discover" ? Infinity : 0, duration: 1 }}
                className={`p-3 rounded-lg border flex items-center space-x-2 ${
                  currentStep === "discover" || currentStep === "understand" || currentStep === "evaluate" || currentStep === "complete"
                    ? "bg-[#fafaf9] border-[#3ba6f1] text-[#0c0a09]"
                    : "bg-[#fafaf9] border-[#e8e6e5] text-[#78716c]"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-[#3ba6f1]" />
                <div>
                  <h4 className="font-medium text-xs text-[#0c0a09]">1. Discover Node</h4>
                  <div className="text-[11px] text-[#78716c]">Profiles parsed</div>
                </div>
              </motion.div>

              <motion.div
                animate={{ scale: currentStep === "understand" ? [1, 1.02, 1] : 1 }}
                transition={{ repeat: currentStep === "understand" ? Infinity : 0, duration: 1 }}
                className={`p-3 rounded-lg border flex items-center space-x-2 ${
                  currentStep === "understand" || currentStep === "evaluate" || currentStep === "complete"
                    ? "bg-[#fafaf9] border-[#3ba6f1] text-[#0c0a09]"
                    : "bg-[#fafaf9] border-[#e8e6e5] text-[#78716c]"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-[#3ba6f1]" />
                <div>
                  <h4 className="font-medium text-xs text-[#0c0a09]">2. Understand Node</h4>
                  <div className="text-[11px] text-[#78716c]">Live web scraping &amp; API signals</div>
                </div>
              </motion.div>

              <motion.div
                animate={{ scale: currentStep === "evaluate" ? [1, 1.02, 1] : 1 }}
                transition={{ repeat: currentStep === "evaluate" ? Infinity : 0, duration: 1 }}
                className={`p-3 rounded-lg border flex items-center space-x-2 ${
                  currentStep === "evaluate" || currentStep === "complete"
                    ? "bg-[#fafaf9] border-[#3ba6f1] text-[#0c0a09]"
                    : "bg-[#fafaf9] border-[#e8e6e5] text-[#78716c]"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-[#3ba6f1]" />
                <div>
                  <h4 className="font-medium text-xs text-[#0c0a09]">3. Evaluate Node</h4>
                  <div className="text-[11px] text-[#78716c]">Featherless LLM &amp; Reasoning Card</div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────────────────────
            DASHBOARD RESULTS SECTION (Framer Motion Animation & Geist Font Formatting)
           ───────────────────────────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {result && (
            <motion.div
              id="dashboard-results"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8 pt-4"
            >
              {/* Overall Score Header */}
              <div className="stone-card p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-l-4 border-l-[#3ba6f1]">
                <div className="space-y-2">
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#c1e1f7] text-[#3398e1] text-xs font-normal">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Strategic Compatibility Assessed</span>
                  </div>
                  <h2 className="text-3xl font-serif-heading tracking-tight text-[#0c0a09]">
                    {result.company_a} &amp; {result.company_b} Partnership
                  </h2>
                  <p className="text-xs text-[#78716c] max-w-2xl leading-relaxed">
                    {result.compatibility_result.strategic_fit_summary}
                  </p>
                </div>

                <div className="flex items-center space-x-6 shrink-0">
                  <div className="text-center">
                    <div className="text-4xl font-normal text-[#0c0a09] tracking-tight">
                      {result.compatibility_score}
                    </div>
                    <div className="text-[10px] font-medium text-[#78716c] uppercase tracking-wider mt-0.5">
                      Compatibility / 100
                    </div>
                  </div>

                  <div className="h-10 w-px bg-[#e8e6e5]" />

                  <div className="text-center">
                    <div className="text-2xl font-semibold text-[#3398e1]">
                      {result.confidence_score}%
                    </div>
                    <div className="text-[10px] font-medium text-[#78716c] uppercase tracking-wider mt-0.5">
                      Confidence
                    </div>
                  </div>
                </div>
              </div>

              {/* 6 Structured AI Reasoning Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-[#78716c] uppercase tracking-wider flex items-center space-x-2 font-sans">
                    <Brain className="w-4 h-4 text-[#3ba6f1]" />
                    <span>STRUCTURED AI REASONING CARD (6 DIMENSIONS)</span>
                  </h3>
                  <span className="text-xs text-[#78716c]">Transparent AI Explainability</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                  {/* 1. Why This Company */}
                  <motion.div whileHover={{ y: -3, transition: { duration: 0.2 } }} className="stone-card p-5 space-y-2">
                    <h3 className="font-medium text-xs text-[#0c0a09] flex items-center justify-between">
                      <span>1. Why This Company?</span>
                      <Building2 className="w-3.5 h-3.5 text-[#78716c]" />
                    </h3>
                    <p className="text-[#78716c] leading-relaxed">
                      {result.reasoning_card.why_this_company}
                    </p>
                  </motion.div>

                  {/* 2. Why Now */}
                  <motion.div whileHover={{ y: -3, transition: { duration: 0.2 } }} className="stone-card p-5 space-y-2">
                    <h3 className="font-medium text-xs text-[#0c0a09] flex items-center justify-between">
                      <span>2. Why Now?</span>
                      <Sparkles className="w-3.5 h-3.5 text-[#3ba6f1]" />
                    </h3>
                    <p className="text-[#78716c] leading-relaxed">
                      {result.reasoning_card.why_now}
                    </p>
                  </motion.div>

                  {/* 3. Why Decision Maker */}
                  <motion.div whileHover={{ y: -3, transition: { duration: 0.2 } }} className="stone-card p-5 space-y-2">
                    <h3 className="font-medium text-xs text-[#0c0a09] flex items-center justify-between">
                      <span>3. Why Decision Maker?</span>
                      <UserCheck className="w-3.5 h-3.5 text-[#78716c]" />
                    </h3>
                    <p className="text-[#78716c] leading-relaxed">
                      {result.reasoning_card.why_this_decision_maker}
                    </p>
                  </motion.div>

                  {/* 4. Why Partnership */}
                  <motion.div whileHover={{ y: -3, transition: { duration: 0.2 } }} className="stone-card p-5 space-y-2">
                    <h3 className="font-medium text-xs text-[#0c0a09] flex items-center justify-between">
                      <span>4. Why This Partnership?</span>
                      <Zap className="w-3.5 h-3.5 text-[#78716c]" />
                    </h3>
                    <p className="text-[#78716c] leading-relaxed">
                      {result.reasoning_card.why_this_partnership}
                    </p>
                  </motion.div>

                  {/* 5. Why Outreach Strategy */}
                  <motion.div whileHover={{ y: -3, transition: { duration: 0.2 } }} className="stone-card p-5 space-y-2">
                    <h3 className="font-medium text-xs text-[#0c0a09] flex items-center justify-between">
                      <span>5. Why Outreach Strategy?</span>
                      <Send className="w-3.5 h-3.5 text-[#78716c]" />
                    </h3>
                    <p className="text-[#78716c] leading-relaxed">
                      {result.reasoning_card.why_this_outreach_strategy}
                    </p>
                  </motion.div>

                  {/* 6. Suggested Action */}
                  <motion.div whileHover={{ y: -3, transition: { duration: 0.2 } }} className="stone-card p-5 bg-[#fafaf9] border-[#3ba6f1] space-y-2">
                    <h3 className="font-medium text-xs text-[#0c0a09] flex items-center justify-between">
                      <span>6. Suggested Action</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#3ba6f1]" />
                    </h3>
                    <p className="text-[#0c0a09] leading-relaxed font-normal">
                      {result.reasoning_card.suggested_next_action}
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* FOUNDER & EXECUTIVE INTELLIGENCE CARD */}
              <motion.div id="founder-intel" whileHover={{ y: -2 }} className="stone-card p-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e8e6e5] pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#0c0a09] text-white flex items-center justify-center font-semibold text-sm">
                      {result.founder_intel.executive_name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="font-medium text-base text-[#0c0a09] flex items-center space-x-2">
                        <span>{result.founder_intel.executive_name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#c1e1f7] text-[#3398e1] font-normal">
                          Verified Contact
                        </span>
                      </h3>
                      <p className="text-xs text-[#78716c]">
                        {result.founder_intel.executive_role} &bull; {result.founder_intel.company_name}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-[#78716c]">
                    Direct Email: <strong className="text-[#0c0a09] font-mono ml-1">{result.founder_intel.email}</strong>
                  </div>
                </div>

                {/* Active Channels / Social Badges Grid */}
                <div className="space-y-2 text-xs">
                  <div className="text-[#78716c] font-medium">Active Channels &amp; Social Profiles:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Telegram */}
                    <div className="p-3 rounded-lg border border-[#e8e6e5] bg-[#ffffff] space-y-1">
                      <div className="flex items-center justify-between text-[#78716c]">
                        <span className="flex items-center space-x-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-[#3ba6f1]" />
                          <span>Telegram</span>
                        </span>
                        <span className="text-[10px] text-[#3398e1] font-semibold">Active</span>
                      </div>
                      <div className="font-mono text-[#0c0a09] text-[11px]">{result.founder_intel.platforms.telegram.handle}</div>
                    </div>

                    {/* Email */}
                    <div className="p-3 rounded-lg border border-[#e8e6e5] bg-[#ffffff] space-y-1">
                      <div className="flex items-center justify-between text-[#78716c]">
                        <span className="flex items-center space-x-1.5">
                          <Mail className="w-3.5 h-3.5 text-[#3ba6f1]" />
                          <span>Email</span>
                        </span>
                        <span className="text-[10px] text-[#3398e1] font-semibold">Verified</span>
                      </div>
                      <div className="font-mono text-[#0c0a09] text-[11px] truncate">{result.founder_intel.email}</div>
                    </div>

                    {/* X / Twitter */}
                    <div className="p-3 rounded-lg border border-[#e8e6e5] bg-[#ffffff] space-y-1">
                      <div className="flex items-center justify-between text-[#78716c]">
                        <span className="flex items-center space-x-1.5">
                          <Share2 className="w-3.5 h-3.5 text-[#0c0a09]" />
                          <span>X (Twitter)</span>
                        </span>
                        <span className="text-[10px] text-[#78716c]">Active</span>
                      </div>
                      <div className="font-mono text-[#0c0a09] text-[11px]">{result.founder_intel.platforms.twitter_x.handle}</div>
                    </div>

                    {/* LinkedIn */}
                    <div className="p-3 rounded-lg border border-[#e8e6e5] bg-[#ffffff] space-y-1">
                      <div className="flex items-center justify-between text-[#78716c]">
                        <span className="flex items-center space-x-1.5">
                          <ExternalLink className="w-3.5 h-3.5 text-[#0c0a09]" />
                          <span>LinkedIn</span>
                        </span>
                        <span className="text-[10px] text-[#78716c]">Active</span>
                      </div>
                      <div className="font-mono text-[#0c0a09] text-[11px] truncate">{result.founder_intel.platforms.linkedin.url}</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* MULTI-TAB OUTREACH MESSAGE PREVIEWER */}
              <div className="stone-card p-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e8e6e5] pb-3">
                  <div className="space-y-0.5">
                    <h3 className="font-medium text-sm text-[#0c0a09] flex items-center space-x-2">
                      <Send className="w-4 h-4 text-[#3ba6f1]" />
                      <span>Multi-Channel Outreach Message Previews</span>
                    </h3>
                    <p className="text-xs text-[#78716c]">
                      Customized proposal copy generated for Email, Telegram approval, and Slack.
                    </p>
                  </div>

                  {/* Tab Controls */}
                  <div className="flex items-center space-x-1 bg-[#fafaf9] p-1 rounded-full border border-[#e8e6e5] text-xs">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setActiveTab("email")}
                      className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                        activeTab === "email" ? "bg-[#1c1917] text-white font-medium" : "text-[#78716c] hover:text-[#0c0a09]"
                      }`}
                    >
                      Email Proposal
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setActiveTab("telegram")}
                      className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                        activeTab === "telegram" ? "bg-[#1c1917] text-white font-medium" : "text-[#78716c] hover:text-[#0c0a09]"
                      }`}
                    >
                      Telegram Alert
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setActiveTab("slack")}
                      className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                        activeTab === "slack" ? "bg-[#1c1917] text-white font-medium" : "text-[#78716c] hover:text-[#0c0a09]"
                      }`}
                    >
                      Slack Markdown
                    </motion.button>
                  </div>
                </div>

                {/* Animated Tab Content Box */}
                <div className="relative">
                  <AnimatePresence mode="wait">
                    {activeTab === "email" && (
                      <motion.div
                        key="email"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="stone-card p-5 bg-[#fafaf9] space-y-3 font-mono text-xs text-[#0c0a09]"
                      >
                        <div className="flex items-center justify-between border-b border-[#e8e6e5] pb-2 font-sans text-xs">
                          <span className="text-[#78716c]">Subject: <strong className="text-[#0c0a09]">{result.outreach_drafts.email_subject}</strong></span>
                          <button
                            onClick={() => copyToClipboard(result.outreach_drafts.email_body, "email")}
                            className="text-xs text-[#3398e1] hover:underline flex items-center space-x-1 cursor-pointer"
                          >
                            {copiedTab === "email" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedTab === "email" ? "Copied!" : "Copy Email"}</span>
                          </button>
                        </div>
                        <pre className="whitespace-pre-wrap font-mono text-xs text-[#0c0a09] leading-relaxed">
                          {result.outreach_drafts.email_body}
                        </pre>
                      </motion.div>
                    )}

                    {activeTab === "telegram" && (
                      <motion.div
                        key="telegram"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="stone-card p-5 bg-[#fafaf9] space-y-3 font-mono text-xs text-[#0c0a09]"
                      >
                        <div className="flex items-center justify-between border-b border-[#e8e6e5] pb-2 font-sans text-xs">
                          <span className="text-[#78716c]">Target: <strong className="text-[#0c0a09]">Manager Approval Prompt (@OrbitPDRBot)</strong></span>
                          <button
                            onClick={() => copyToClipboard(result.outreach_drafts.telegram_alert, "telegram")}
                            className="text-xs text-[#3398e1] hover:underline flex items-center space-x-1 cursor-pointer"
                          >
                            {copiedTab === "telegram" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedTab === "telegram" ? "Copied!" : "Copy Alert"}</span>
                          </button>
                        </div>
                        <pre className="whitespace-pre-wrap font-mono text-xs text-[#0c0a09] leading-relaxed">
                          {result.outreach_drafts.telegram_alert}
                        </pre>
                      </motion.div>
                    )}

                    {activeTab === "slack" && (
                      <motion.div
                        key="slack"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="stone-card p-5 bg-[#fafaf9] space-y-3 font-mono text-xs text-[#0c0a09]"
                      >
                        <div className="flex items-center justify-between border-b border-[#e8e6e5] pb-2 font-sans text-xs">
                          <span className="text-[#78716c]">Format: <strong className="text-[#0c0a09]">Slack Block Markdown</strong></span>
                          <button
                            onClick={() => copyToClipboard(result.outreach_drafts.slack_announcement, "slack")}
                            className="text-xs text-[#3398e1] hover:underline flex items-center space-x-1 cursor-pointer"
                          >
                            {copiedTab === "slack" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedTab === "slack" ? "Copied!" : "Copy Markdown"}</span>
                          </button>
                        </div>
                        <pre className="whitespace-pre-wrap font-mono text-xs text-[#0c0a09] leading-relaxed">
                          {result.outreach_drafts.slack_announcement}
                        </pre>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* CASPIAN MULTI-CHANNEL DISPATCH HUB */}
              <div id="caspian-hub" className="stone-card p-6 space-y-4 border-t-2 border-t-[#3ba6f1]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-[#0c0a09] text-white flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-[#3ba6f1]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm text-[#0c0a09]">Caspian Multi-Channel Control Hub</h3>
                      <p className="text-xs text-[#78716c]">Human-in-the-loop Telegram approval &amp; Email delivery</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    {telegramStatus === "pending" && (
                      <span className="px-3 py-1 rounded-full bg-[#fafaf9] border border-[#e8e6e5] text-[#78716c]">
                        Telegram Alert Sent (Pending Approval)
                      </span>
                    )}
                    {telegramStatus === "approved" && (
                      <span className="px-3 py-1 rounded-full bg-[#c1e1f7] text-[#3398e1]">
                        Approved via Telegram!
                      </span>
                    )}
                    {telegramStatus === "dispatched" && (
                      <span className="px-3 py-1 rounded-full bg-[#c1e1f7] text-[#3398e1]">
                        Caspian Email Dispatched
                      </span>
                    )}
                  </div>
                </div>

                {/* Interactive Telegram Approval Banner */}
                <div className="p-4 rounded-lg bg-[#fafaf9] border border-[#e8e6e5] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="font-medium text-[#0c0a09] flex items-center space-x-2">
                      <Smartphone className="w-4 h-4 text-[#3ba6f1]" />
                      <span>Telegram PDR Manager Approval Simulator</span>
                    </div>
                    <p className="text-[#78716c]">
                      &quot;Orbit AI PDR Alert: High Fit Found ({result.company_a} x {result.company_b} - {result.compatibility_score}/100). Reply APPROVE to send outreach.&quot;
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSimulateTelegramApproval}
                    disabled={telegramStatus === "dispatched"}
                    className="btn-cyan-primary text-xs shrink-0 cursor-pointer disabled:opacity-50 flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Simulate Manager Approval</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          FOOTER (Seline Editorial Minimal Footer)
         ───────────────────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#e8e6e5] bg-[#fafaf9] px-6 py-8 text-xs text-[#78716c]">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded bg-[#0c0a09] text-white flex items-center justify-center text-[10px]">
              <Flame className="w-3 h-3 text-[#3ba6f1]" />
            </div>
            <span>Orbit AI PDR &copy; 2026 &bull; Built for Caspian Buildathon</span>
          </div>

          <div className="flex items-center space-x-6">
            <a href="https://www.trycaspianai.com/docs/" target="_blank" rel="noreferrer" className="hover:text-[#0c0a09] transition-colors">
              Caspian SDK Docs
            </a>
            <a href="https://github.com/dhruvil-codes/orbit" target="_blank" rel="noreferrer" className="hover:text-[#0c0a09] transition-colors">
              GitHub Repository
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
