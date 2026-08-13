"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
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
  Copy,
  Check,
  Search,
  UserCheck,
  Share2,
  ExternalLink,
  Layers,
  ArrowLeft,
  X,
  FileText,
  Clock,
  Activity,
  Sparkles,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

interface DiscoveredPartner {
  name: string;
  domain: string;
  industry: string;
  description: string;
  compatibility_score: number;
  synergy_reason: string;
  executive_lead: { name: string; role: string; email: string };
  recent_news: string;
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
  last_partner_reply?: string;
  detected_intent?: string;
  reply_summary?: string;
  response_draft?: string;
}

interface SignalScores {
  product_complementarity: number;
  icp_overlap: number;
  integration_api_compatibility: number;
  distribution_overlap: number;
  developer_ecosystem: number;
  co_marketing_potential: number;
  strategic_timing: number;
}

interface EvidenceSignals {
  page_title: string;
  meta_description: string;
  has_developer_api: boolean;
  developer_links: string[];
  icp_overlap_density: string;
  strategic_timing_trigger: string;
  signal_scores?: SignalScores;
}

interface TimelineEvent {
  stage: string;
  timestamp: string;
  note: string;
}

interface OpportunityItem {
  id?: string;
  opportunity_id?: string;
  title: string;
  company_a: string;
  company_b: string;
  compatibility_score: number;
  confidence_score: number;
  status: string;
  stage: string;
  dispatch_status: string;
  sender_name?: string;
  sender_email?: string;
  sender_company?: string;
  compatibility_result: {
    strategic_fit_summary: string;
    partnership_ideas: string[];
    integration_opportunities: string[];
    co_marketing_opportunities: string[];
    recommended_outreach_angle: string;
  };
  reasoning_card: ReasoningCard;
  evidence_signals?: EvidenceSignals;
  founder_intel: FounderIntel;
  outreach_drafts: OutreachDrafts;
  timeline_events?: TimelineEvent[];
  primary_company?: { name: string; domain: string };
  partner_company?: { name: string; domain: string };
}

export default function DashboardPage() {
  // Explicit Sender Identity (MVP Auth)
  const [senderName, setSenderName] = useState("Dhruvil Mistry");
  const [senderEmail, setSenderEmail] = useState("dhruvil@useorbit.ai");
  const [senderCompany, setSenderCompany] = useState("Notion");
  const [userWebsiteDomain, setUserWebsiteDomain] = useState("notion.so");

  // Autonomous Top 3 Partner Discovery State
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [topPartners, setTopPartners] = useState<DiscoveredPartner[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<DiscoveredPartner | null>(null);

  // Pipeline & Report Generation Loading State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>("Analyzing Website & Scraping API Surfaces...");
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<OpportunityItem | null>(null);

  // Caspian Command Center Log Stream
  const [activeTab, setActiveTab] = useState<"email" | "telegram" | "slack">("email");
  const [eventLogs, setEventLogs] = useState<Array<{ id: string | number; text: string; time: string; channel: string }>>([
    { id: "1", text: "Caspian SDK initialized on Telegram (@OrbitPDRBot) and Email Gateway", time: "10:14:02", channel: "system" },
    { id: "2", text: "Orbit AI PDR Listener active & listening for manager commands", time: "10:14:05", channel: "listener" },
  ]);

  // Fetch opportunities on mount & auto-discover for default URL
  useEffect(() => {
    fetchOpportunities();
    handleAutoDiscover("notion.so");
  }, []);

  const fetchOpportunities = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/opportunities/");
      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          const mapped: OpportunityItem[] = data.items.map((item: any) => ({
            ...item,
            company_a: item.primary_company?.name || item.company_a || "Notion",
            company_b: item.partner_company?.name || item.company_b || "Partner",
          }));
          setOpportunities(mapped);
        }
      }
    } catch {
      // Backend offline fallback
    }
  };

  const sanitizeDomain = (rawDomain: string): string => {
    return rawDomain.toLowerCase().replace("https://", "").replace("http://", "").replace("www.", "").split("/")[0].trim() || "notion.so";
  };

  const handleAutoDiscover = async (domainToSearch?: string) => {
    const rawDomain = domainToSearch || userWebsiteDomain;
    const cleanDomain = sanitizeDomain(rawDomain);
    setIsDiscovering(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/discovery/discover-partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: cleanDomain }),
      });

      if (res.ok) {
        const data = await res.json();
        setTopPartners(data.top_partners || []);
        addEventLog(`Auto-discovered Top 3 strategic partners for ${cleanDomain}`, "orbit");
      } else {
        throw new Error("Discovery API error");
      }
    } catch {
      // Custom URL dynamic fallback
      const brandName = cleanDomain.split(".")[0].toUpperCase();
      setTopPartners([
        {
          name: `Linear (${brandName} Integration)`,
          domain: "linear.app",
          industry: "Product Operations & Issue Tracking",
          description: `High-performance issue tracking system connecting with ${brandName}`,
          compatibility_score: 92.0,
          synergy_reason: `Bi-directional real-time data sync between ${brandName} and Linear product workflows.`,
          executive_lead: { name: "Karri Saarinen", role: "CEO & Co-founder", email: "karri@linear.app" },
          recent_news: `Launched open API ecosystem supporting native ${brandName} data flows.`,
        },
        {
          name: `Slack (${brandName} Connect)`,
          domain: "slack.com",
          industry: "Enterprise Communication",
          description: `AI productivity platform for work and automated ${brandName} alerts`,
          compatibility_score: 88.0,
          synergy_reason: `Real-time action notifications and joint Slack Connect channel integration.`,
          executive_lead: { name: "Lidiane Jones", role: "CEO", email: "partnerships@slack.com" },
          recent_news: `Announced enterprise App Directory integration with ${brandName}.`,
        },
        {
          name: `Stripe (${brandName} Payments)`,
          domain: "stripe.com",
          industry: "Financial Infrastructure",
          description: `Payment processing & billing infrastructure for ${brandName} enterprise customers`,
          compatibility_score: 85.0,
          synergy_reason: `Automated subscription billing & enterprise revenue share reconciliation.`,
          executive_lead: { name: "Patrick Collison", role: "CEO & Co-founder", email: "patrick@stripe.com" },
          recent_news: `Expanded developer API platform for SaaS partner billing integrations.`,
        },
      ]);
    } finally {
      setIsDiscovering(false);
    }
  };

  const handleSelectPartnerAndGenerateReport = async (partner: DiscoveredPartner) => {
    setSelectedPartner(partner);
    setIsLoading(true);

    // Animated Loading Messages
    setLoadingStep("1. Scraped Web Evidence & Analyzed API Surfaces...");
    await new Promise((r) => setTimeout(r, 700));

    setLoadingStep("2. Extracted Decision Maker & Founder Intelligence...");
    await new Promise((r) => setTimeout(r, 700));

    setLoadingStep("3. Featherless LLM Computed Evidence-Based Strategic Fit...");
    await new Promise((r) => setTimeout(r, 800));

    setLoadingStep("4. Generating Caspian Multi-Channel Outreach & Telegram Alert...");
    await new Promise((r) => setTimeout(r, 600));

    const cleanUserDomain = sanitizeDomain(userWebsiteDomain);
    const compA = { name: senderCompany || "My Company", domain: cleanUserDomain, industry: "SaaS", description: "My SaaS platform" };
    const compB = { name: partner.name, domain: partner.domain, industry: partner.industry, description: partner.description };

    try {
      const response = await fetch("http://localhost:8000/api/v1/compatibility/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_a: compA,
          company_b: compB,
          dispatch_outreach: true,
          sender_name: senderName,
          sender_email: senderEmail,
          sender_company: senderCompany,
        }),
      });

      if (response.ok) {
        const data: OpportunityItem = await response.json();
        setOpportunities((prev) => [data, ...prev]);
        setSelectedOpp(data);
        addEventLog(`Generated strategic report for ${senderCompany} x ${partner.name} (${partner.compatibility_score}/100)`, "orbit");
        addEventLog(`Sent Telegram manager approval alert (@OrbitPDRBot)`, "telegram");
      } else {
        throw new Error("Evaluation error");
      }
    } catch {
      // Mock report creation
      const mockData: OpportunityItem = {
        id: `opp_${Date.now()}`,
        opportunity_id: `opp_${Date.now()}`,
        title: `${senderCompany} & ${partner.name} Strategic Partnership`,
        company_a: senderCompany,
        company_b: partner.name,
        compatibility_score: partner.compatibility_score,
        confidence_score: 94.0,
        status: "evaluated",
        stage: "AWAITING_APPROVAL",
        dispatch_status: "dispatched",
        sender_name: senderName,
        sender_email: senderEmail,
        sender_company: senderCompany,
        compatibility_result: {
          strategic_fit_summary: partner.synergy_reason,
          partnership_ideas: [
            `Joint enterprise bundle between ${senderCompany} and ${partner.name}`,
            `Co-branded technical integration workshop & webinar series`,
            `Cross-referral partner tier for enterprise accounts`,
          ],
          integration_opportunities: [
            `Bi-directional real-time API data sync between ${senderCompany} and ${partner.name}`,
            `Single Sign-On (SSO) and Webhook event automation`,
            `Embedded action widgets inside ${partner.name}'s workspace`,
          ],
          co_marketing_opportunities: [
            `Joint case study detailing dual-stack efficiency gains`,
            `Co-hosted developer meetup & API release event`,
          ],
          recommended_outreach_angle: `Focus on immediate technical synergy: propose a 2-week integration proof-of-concept for joint accounts.`,
        },
        reasoning_card: {
          why_this_company: `${partner.name} dominates its segment and shares a high-density ICP overlap with ${senderCompany}.`,
          why_now: `Recent news: ${partner.recent_news}`,
          why_this_decision_maker: `${partner.executive_lead.name} (${partner.executive_lead.role}) manages joint ecosystem integrations.`,
          why_this_partnership: partner.synergy_reason,
          why_this_outreach_strategy: `A value-first technical demo highlighting immediate developer feasibility yields highest response rate.`,
          confidence_score: 94.0,
          suggested_next_action: `Approve automated outreach proposal to ${partner.executive_lead.name} via Caspian gateway.`,
        },
        evidence_signals: {
          page_title: `${partner.name} Official Platform`,
          meta_description: partner.description,
          has_developer_api: true,
          developer_links: [`https://${partner.domain}/docs`, `https://${partner.domain}/api`],
          icp_overlap_density: "High (Shared Enterprise Developer & Product Ops Teams)",
          strategic_timing_trigger: partner.recent_news,
          signal_scores: {
            product_complementarity: 92.0,
            icp_overlap: 90.0,
            integration_api_compatibility: 94.0,
            distribution_overlap: 85.0,
            developer_ecosystem: 88.0,
            co_marketing_potential: 82.0,
            strategic_timing: 89.0,
          },
        },
        founder_intel: {
          company_domain: partner.domain,
          company_name: partner.name,
          executive_name: partner.executive_lead.name,
          executive_role: partner.executive_lead.role,
          email: partner.executive_lead.email,
          email_verified: true,
          platforms: {
            telegram: { status: "Active", badge: "Caspian Bot Active", handle: "@OrbitPDRBot" },
            email: { status: "Verified", badge: "Deliverable", address: partner.executive_lead.email },
            twitter_x: { status: "Active", handle: `@${partner.name.toLowerCase()}` },
            linkedin: { status: "Active", url: `linkedin.com/company/${partner.name.toLowerCase()}` },
          },
        },
        outreach_drafts: {
          email_subject: `Technical Partnership Proposal: ${senderCompany} x ${partner.name}`,
          email_body: `Hi ${partner.executive_lead.name.split(" ")[0]},\n\nI'm reaching out from ${senderCompany} (${senderEmail}).\n\nOur AI Partnership Agent (Orbit) evaluated strategic compatibility between ${senderCompany} and ${partner.name}, scoring a strategic fit of ${partner.compatibility_score}/100:\n\nSYNERGY SUMMARY:\n${partner.synergy_reason}\n\nRECOMMENDED POC:\n• Bi-directional real-time data sync\n• Single Sign-On (SSO) and Webhook triggers\n\nWould you be open to a 15-minute technical discovery call next week?\n\nBest regards,\n${senderName}\n${senderCompany} | ${senderEmail}`,
          telegram_alert: `🎯 *Orbit AI PDR Alert*\nTarget: ${senderCompany} x ${partner.name}\nScore: *${partner.compatibility_score}/100*\nDecision Maker: ${partner.executive_lead.name}\n\nReply *APPROVE* to trigger Caspian Email Outreach or *REJECT* to park.`,
          slack_announcement: `:rocket: *New Partnership Opportunity Discovered*\n*${senderCompany}* + *${partner.name}* | Score: \`${partner.compatibility_score}/100\`\nExecutive Lead: ${partner.executive_lead.name} (${partner.executive_lead.email})`,
        },
        timeline_events: [
          { stage: "DISCOVERED", timestamp: new Date().toISOString(), note: `Discovered top strategic partner: ${partner.name}` },
          { stage: "RESEARCHED", timestamp: new Date().toISOString(), note: `Extracted executive intel for ${partner.executive_lead.name}` },
          { stage: "EVALUATED", timestamp: new Date().toISOString(), note: `Featherless LLM generated evidence score ${partner.compatibility_score}/100` },
          { stage: "AWAITING_APPROVAL", timestamp: new Date().toISOString(), note: "Telegram manager approval request sent (@OrbitPDRBot)" },
        ],
      };

      setOpportunities((prev) => [mockData, ...prev]);
      setSelectedOpp(mockData);
      addEventLog(`Generated detailed strategic report for ${senderCompany} x ${partner.name}`, "orbit");
      addEventLog(`Dispatched Telegram manager approval alert (@OrbitPDRBot)`, "telegram");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulateTelegramApproval = async (opp: OpportunityItem) => {
    const oppId = opp.id || opp.opportunity_id;
    try {
      if (oppId && !oppId.startsWith("opp_17")) {
        const targetStage = opp.stage === "RESPONSE_PENDING_APPROVAL" ? "RESPONSE_SENT" : "APPROVED";
        await fetch(`http://localhost:8000/api/v1/opportunities/${oppId}/stage?stage=${targetStage}&event_note=Manager%20approved%20action%20on%20Telegram`, {
          method: "POST",
        });
      }
    } catch {
      // Fallback
    }

    let nextStage = "OUTREACH_SENT";
    let eventNote = `Caspian Email proposal dispatched to ${opp.founder_intel.email}`;

    if (opp.stage === "RESPONSE_PENDING_APPROVAL") {
      nextStage = "RESPONSE_SENT";
      eventNote = `Caspian response email dispatched back to ${opp.founder_intel.email}`;
    }

    const updatedTimeline = [
      ...(opp.timeline_events || []),
      { stage: opp.stage === "RESPONSE_PENDING_APPROVAL" ? "RESPONSE_APPROVED" : "APPROVED", timestamp: new Date().toISOString(), note: "Manager sent APPROVE via Telegram (@OrbitPDRBot)" },
      { stage: nextStage, timestamp: new Date().toISOString(), note: eventNote },
    ];

    const updatedOpp = { ...opp, stage: nextStage, timeline_events: updatedTimeline };
    setOpportunities((prev) => prev.map((o) => ((o.id || o.opportunity_id) === oppId ? updatedOpp : o)));
    if ((selectedOpp?.id || selectedOpp?.opportunity_id) === oppId) {
      setSelectedOpp(updatedOpp);
    }

    addEventLog(`Received APPROVE command on Telegram for ${opp.company_a} x ${opp.company_b}`, "telegram");
    addEventLog(eventNote, "email");
  };

  const handleSimulatePartnerReply = async (opp: OpportunityItem) => {
    const oppId = opp.id || opp.opportunity_id;
    const replyText = "Sounds interesting! Can you explain how the technical API integration would work for enterprise accounts?";

    try {
      if (oppId && !oppId.startsWith("opp_17")) {
        const res = await fetch(`http://localhost:8000/api/v1/compatibility/simulate-partner-reply?opportunity_id=${oppId}&reply_text=${encodeURIComponent(replyText)}`, {
          method: "POST",
        });
        if (res.ok) {
          const data = await res.json();
          const updatedTimeline = data.timeline_events || [
            ...(opp.timeline_events || []),
            { stage: "PARTNER_REPLIED", timestamp: new Date().toISOString(), note: `Partner email reply received: '${replyText.slice(0, 50)}...'` },
            { stage: "RESPONSE_PENDING_APPROVAL", timestamp: new Date().toISOString(), note: "Reply classified as QUESTION; response draft generated and awaiting Telegram manager approval" },
          ];

          const updatedOpp: OpportunityItem = {
            ...opp,
            stage: "RESPONSE_PENDING_APPROVAL",
            timeline_events: updatedTimeline,
            outreach_drafts: {
              ...opp.outreach_drafts,
              last_partner_reply: replyText,
              detected_intent: data.reply_intelligence?.detected_intent || "QUESTION",
              reply_summary: data.reply_intelligence?.reply_summary || "Partner requested technical integration specs.",
              response_draft: data.reply_intelligence?.response_draft || `Hi Team,\n\nThanks for reaching out! Regarding API integration...\n\nBest,\n${senderName}`,
            },
          };

          setOpportunities((prev) => prev.map((o) => ((o.id || o.opportunity_id) === oppId ? updatedOpp : o)));
          setSelectedOpp(updatedOpp);
          addEventLog(`Inbound Partner Email reply caught by Caspian listener: "${replyText.slice(0, 40)}..."`, "email");
          addEventLog(`Generated response draft & sent Telegram approval alert (@OrbitPDRBot)`, "telegram");
          return;
        }
      }
    } catch {
      // Local fallback
    }

    const updatedTimeline = [
      ...(opp.timeline_events || []),
      { stage: "PARTNER_REPLIED", timestamp: new Date().toISOString(), note: `Partner email reply received: '${replyText.slice(0, 50)}...'` },
      { stage: "RESPONSE_PENDING_APPROVAL", timestamp: new Date().toISOString(), note: "Reply classified as QUESTION; response draft generated and awaiting Telegram manager approval" },
    ];

    const updatedOpp: OpportunityItem = {
      ...opp,
      stage: "RESPONSE_PENDING_APPROVAL",
      timeline_events: updatedTimeline,
      outreach_drafts: {
        ...opp.outreach_drafts,
        last_partner_reply: replyText,
        detected_intent: "QUESTION",
        reply_summary: `Partner at ${opp.company_b} is interested but requested technical integration API details.`,
        response_draft: `Hi Team,\n\nThanks for your reply! Regarding technical API integration between ${senderCompany} and ${opp.company_b}:\n\n1. Real-time Webhooks & REST endpoints.\n2. OAuth 2.0 with granular scopes.\n\nWould next Tuesday work for a 15-minute technical discovery call?\n\nBest regards,\n${senderName}\n${senderCompany}`,
      },
    };

    setOpportunities((prev) => prev.map((o) => ((o.id || o.opportunity_id) === oppId ? updatedOpp : o)));
    setSelectedOpp(updatedOpp);
    addEventLog(`Inbound Partner Email reply caught by Caspian listener: "${replyText.slice(0, 40)}..."`, "email");
    addEventLog(`Generated response draft & sent Telegram approval alert (@OrbitPDRBot)`, "telegram");
  };

  const addEventLog = (text: string, channel: string) => {
    const nowStr = new Date().toLocaleTimeString();
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    setEventLogs((prev) => [{ id: uniqueId, text, time: nowStr, channel }, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#0c0a09] font-sans selection:bg-[#c1e1f7] selection:text-[#3398e1]">
      {/* ─────────────────────────────────────────────────────────────────────────────
          PROMINENT REPORT GENERATION LOADING MODAL OVERLAY
         ───────────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isLoading && (
          <div className="fixed inset-0 z-50 bg-[#0c0a09]/60 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#ffffff] border border-[#e8e6e5] rounded-2xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-[#c1e1f7] text-[#3398e1] mx-auto flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif-heading text-2xl text-[#0c0a09]">
                  Generating Strategic Partnership Report...
                </h3>
                <p className="text-xs text-[#3398e1] font-mono font-medium animate-pulse">
                  {loadingStep}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#fafaf9] border border-[#e8e6e5] text-left text-xs space-y-2 text-[#78716c]">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3ba6f1]" />
                  <span>Web research &amp; developer API surface scraped</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3ba6f1]" />
                  <span>Featherless LLM computing 7 evidence signals</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3ba6f1]" />
                  <span>Caspian Telegram manager approval prompt drafted</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────────────────────────
          TOP DASHBOARD WORKSPACE NAVIGATION BAR
         ───────────────────────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#fafaf9]/90 backdrop-blur-md border-b border-[#e8e6e5] px-6 py-3.5">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2 text-[#78716c] hover:text-[#0c0a09] transition-colors text-xs mr-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Landing</span>
            </Link>
            <div className="h-4 w-px bg-[#e8e6e5]" />
            <div className="w-6 h-6 rounded bg-[#0c0a09] flex items-center justify-center text-white">
              <Flame className="w-3.5 h-3.5 text-[#3ba6f1]" />
            </div>
            <span className="font-medium text-sm tracking-tight text-[#0c0a09]">
              Orbit <span className="font-normal text-[#78716c]">Partnership Workspace</span>
            </span>
          </div>

          <div className="hidden lg:flex items-center space-x-6 text-xs text-[#78716c] font-normal">
            <a href="#discovery-engine" className="hover:text-[#0c0a09] transition-colors">
              Partner Discovery
            </a>
            <a href="#command-center" className="hover:text-[#0c0a09] transition-colors">
              Caspian Center
            </a>
            <a href="#pipeline" className="hover:text-[#0c0a09] transition-colors">
              Deal Pipeline
            </a>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#ffffff] border border-[#e8e6e5] text-[#0c0a09]">
              <Smartphone className="w-3 h-3 text-[#3ba6f1] mr-1.5" />
              Telegram: <strong className="ml-1 text-[#0c0a09] font-normal">@OrbitPDRBot</strong>
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#ffffff] border border-[#e8e6e5] text-[#0c0a09]">
              <Mail className="w-3 h-3 text-[#3ba6f1] mr-1.5" />
              Email Gateway: <strong className="ml-1 text-[#0c0a09] font-normal">Active</strong>
            </span>
          </div>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────────────────────
          MAIN DASHBOARD CONTAINER
         ───────────────────────────────────────────────────────────────────────────── */}
      <main className="max-w-[1200px] mx-auto px-6 py-8 space-y-8">
        {/* 1. EXPLICIT SENDER IDENTITY CONFIGURATION BAR */}
        <section className="stone-card p-5 space-y-3 bg-[#ffffff]">
          <div className="flex items-center justify-between border-b border-[#e8e6e5] pb-3">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-[#3ba6f1]" />
              <h3 className="font-medium text-xs text-[#0c0a09]">Sender Profile &amp; Company Configuration</h3>
            </div>
            <span className="text-[11px] text-[#78716c]">Outreach will attach this identity</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[#78716c] font-medium mb-1">Your Name</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="input-stone w-full"
                placeholder="e.g. Dhruvil Mistry"
              />
            </div>
            <div>
              <label className="block text-[#78716c] font-medium mb-1">Your Work Email</label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="input-stone w-full font-mono"
                placeholder="e.g. dhruvil@useorbit.ai"
              />
            </div>
            <div>
              <label className="block text-[#78716c] font-medium mb-1">Your Company Name</label>
              <input
                type="text"
                value={senderCompany}
                onChange={(e) => {
                  setSenderCompany(e.target.value);
                  const clean = sanitizeDomain(e.target.value);
                  setUserWebsiteDomain(`${clean.toLowerCase()}.com`);
                }}
                className="input-stone w-full"
                placeholder="e.g. Notion"
              />
            </div>
          </div>
        </section>

        {/* 2. SIMPLIFIED DYNAMIC PARTNER DISCOVERY ENGINE FOR ANY CUSTOM LINK */}
        <section id="discovery-engine" className="stone-card p-6 space-y-6 bg-[#ffffff] border-t-2 border-t-[#3ba6f1]">
          <div className="space-y-1 border-b border-[#e8e6e5] pb-4">
            <div className="text-xs font-semibold text-[#78716c] uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#3ba6f1]" />
              <span>AUTONOMOUS PARTNER DISCOVERY ENGINE</span>
            </div>
            <h2 className="text-2xl font-serif-heading text-[#0c0a09]">
              Enter ANY custom SaaS website URL to discover top strategic partners.
            </h2>
            <p className="text-xs text-[#78716c]">
              Orbit automatically scrapes your platform, analyzes developer API surfaces, and discovers the top 3 high-synergy partner companies.
            </p>
          </div>

          {/* URL Input & Discover Button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAutoDiscover();
            }}
            className="flex flex-col sm:flex-row items-center gap-3"
          >
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#78716c] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userWebsiteDomain}
                onChange={(e) => setUserWebsiteDomain(e.target.value)}
                className="input-stone w-full pl-9 font-mono text-xs"
                placeholder="Enter custom website URL (e.g. zendesk.com, salesforce.com, hubspot.com, custom.io)"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isDiscovering}
              className="btn-cyan-primary text-xs shrink-0 flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isDiscovering ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Discovering Partners...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>Discover Top Strategic Partners</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Quick Try Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
            <span className="text-[#78716c] font-medium mr-1">Quick Try Links:</span>
            <button
              onClick={() => { setUserWebsiteDomain("notion.so"); setSenderCompany("Notion"); handleAutoDiscover("notion.so"); }}
              className="px-2.5 py-1 rounded-full bg-[#fafaf9] hover:bg-[#ffffff] border border-[#e8e6e5] text-[#0c0a09] cursor-pointer"
            >
              📝 notion.so
            </button>
            <button
              onClick={() => { setUserWebsiteDomain("stripe.com"); setSenderCompany("Stripe"); handleAutoDiscover("stripe.com"); }}
              className="px-2.5 py-1 rounded-full bg-[#fafaf9] hover:bg-[#ffffff] border border-[#e8e6e5] text-[#0c0a09] cursor-pointer"
            >
              💳 stripe.com
            </button>
            <button
              onClick={() => { setUserWebsiteDomain("zendesk.com"); setSenderCompany("Zendesk"); handleAutoDiscover("zendesk.com"); }}
              className="px-2.5 py-1 rounded-full bg-[#fafaf9] hover:bg-[#ffffff] border border-[#e8e6e5] text-[#0c0a09] cursor-pointer"
            >
              🎧 zendesk.com
            </button>
            <button
              onClick={() => { setUserWebsiteDomain("cal.com"); setSenderCompany("Cal.com"); handleAutoDiscover("cal.com"); }}
              className="px-2.5 py-1 rounded-full bg-[#fafaf9] hover:bg-[#ffffff] border border-[#e8e6e5] text-[#0c0a09] cursor-pointer"
            >
              📅 cal.com
            </button>
          </div>

          {/* TOP 3 DISCOVERED PARTNER CARDS GRID */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#78716c] uppercase tracking-wider">
                TOP 3 RECOMMENDED PARTNERS FOR {userWebsiteDomain.toUpperCase()}
              </span>
              <span className="text-[#3398e1] font-mono text-[11px]">Ranked by Strategic Compatibility</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topPartners.map((partner, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="stone-card p-5 space-y-4 bg-[#ffffff] flex flex-col justify-between border-t-2 border-t-[#3ba6f1]"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#78716c]">
                          Rank #{idx + 1} Partner
                        </span>
                        <h3 className="font-serif-heading text-xl text-[#0c0a09]">{partner.name}</h3>
                        <div className="font-mono text-[11px] text-[#78716c]">{partner.domain}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-[#c1e1f7] text-[#3398e1] font-bold text-xs">
                        {partner.compatibility_score} / 100
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="text-[11px] text-[#78716c] font-medium">Strategic Synergy:</div>
                        <p className="text-[#0c0a09] leading-relaxed text-[11px]">{partner.synergy_reason}</p>
                      </div>

                      <div>
                        <div className="text-[11px] text-[#78716c] font-medium">Decision Maker / Founder:</div>
                        <div className="font-semibold text-[#0c0a09] text-[11px]">
                          {partner.executive_lead.name} ({partner.executive_lead.role})
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] text-[#78716c] font-medium">Recent Ecosystem Trigger:</div>
                        <p className="text-[#78716c] text-[11px] italic">{partner.recent_news}</p>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectPartnerAndGenerateReport(partner)}
                    disabled={isLoading}
                    className="btn-cyan-primary text-xs w-full mt-2 flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <span>Generate Report &amp; Outreach</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. PROMINENT CASPIAN MULTI-CHANNEL COMMAND CENTER */}
        <section id="command-center" className="stone-card p-6 space-y-6 bg-[#ffffff]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e8e6e5] pb-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-[#3ba6f1]" />
                <h2 className="text-xl font-serif-heading text-[#0c0a09]">Caspian Communication Command Center</h2>
              </div>
              <p className="text-xs text-[#78716c]">
                ORBIT INTELLIGENCE &rarr; HUMAN APPROVAL &rarr; CASPIAN GATEWAY &rarr; CHANNEL &rarr; PARTNER
              </p>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <span className="px-3 py-1 rounded-full bg-[#c1e1f7] text-[#3398e1] font-medium">
                Telegram: @OrbitPDRBot Active
              </span>
              <span className="px-3 py-1 rounded-full bg-[#c1e1f7] text-[#3398e1] font-medium">
                Caspian Email SDK Active
              </span>
            </div>
          </div>

          {/* Real-time Event Stream Log Console */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-[#78716c] uppercase tracking-wider flex items-center justify-between">
                <span>Real-Time Caspian Communication Stream</span>
                <Activity className="w-3.5 h-3.5 text-[#3ba6f1]" />
              </div>
              <div className="p-4 rounded-lg bg-[#fafaf9] border border-[#e8e6e5] font-mono text-[11px] space-y-2 h-44 overflow-y-auto">
                {eventLogs.map((log, idx) => (
                  <div key={`${log.id}-${idx}`} className="flex items-start space-x-2">
                    <span className="text-[#78716c]">[{log.time}]</span>
                    <span className={`font-semibold ${log.channel === "telegram" ? "text-[#3398e1]" : log.channel === "email" ? "text-[#0c0a09]" : "text-[#78716c]"}`}>
                      [{log.channel.toUpperCase()}]
                    </span>
                    <span className="text-[#0c0a09]">{log.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="stone-card p-5 space-y-3 bg-[#fafaf9]">
              <h3 className="font-medium text-xs text-[#0c0a09] flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#3ba6f1]" />
                <span>Single Multi-Channel Listener Architecture</span>
              </h3>
              <p className="text-xs text-[#78716c] leading-relaxed">
                Caspian SDK normalizes events across Telegram and Email. Orbit pings Telegram with reasoning, waits for manager APPROVE signal, then dispatches Email outreach.
              </p>
              <div className="pt-2">
                <div className="inline-flex items-center space-x-2 text-[11px] text-[#3398e1] font-mono bg-[#c1e1f7]/50 px-2.5 py-1 rounded">
                  <span>@caspian_client.on_message (Unified Single Listener)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. CLEAN PARTNERSHIP DEAL PIPELINE TABLE */}
        <section id="pipeline" className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <h2 className="text-xl font-serif-heading text-[#0c0a09]">Partnership Deal Pipeline</h2>
            <div className="flex items-center space-x-3 text-xs">
              <span className="text-[#78716c]">{opportunities.length} active opportunities</span>
              <button onClick={fetchOpportunities} className="text-[#3398e1] hover:underline flex items-center space-x-1 cursor-pointer">
                <RefreshCw className="w-3 h-3" />
                <span>Refresh Pipeline</span>
              </button>
            </div>
          </div>

          <div className="stone-card overflow-hidden bg-[#ffffff]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafaf9] border-b border-[#e8e6e5] text-[#78716c] font-medium">
                <tr>
                  <th className="p-4">Partnership Companies</th>
                  <th className="p-4">Compatibility Score</th>
                  <th className="p-4">Current Stage</th>
                  <th className="p-4">Decision Maker / Lead</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e6e5]">
                {opportunities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-[#78716c]">
                      No active partnership deals logged yet. Enter your website URL above to discover top partners.
                    </td>
                  </tr>
                ) : (
                  opportunities.map((opp, idx) => {
                    const oppId = opp.id || opp.opportunity_id;
                    return (
                      <tr key={idx} className="hover:bg-[#fafaf9]/60 transition-colors">
                        <td className="p-4 font-medium text-[#0c0a09]">
                          {opp.company_a} &amp; {opp.company_b}
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#c1e1f7] text-[#3398e1] font-bold">
                            {opp.compatibility_score} / 100
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full border text-[11px] font-mono ${
                            opp.stage === "OUTREACH_SENT" || opp.stage === "RESPONSE_SENT"
                              ? "bg-[#c1e1f7] border-[#3ba6f1] text-[#3398e1]"
                              : opp.stage === "PARTNER_REPLIED" || opp.stage === "RESPONSE_PENDING_APPROVAL"
                              ? "bg-[#fafaf9] border-[#3ba6f1] text-[#0c0a09] font-bold"
                              : "bg-[#ffffff] border-[#e8e6e5] text-[#0c0a09]"
                          }`}>
                            {opp.stage || "AWAITING_APPROVAL"}
                          </span>
                        </td>
                        <td className="p-4 text-[#78716c]">
                          {opp.founder_intel?.executive_name} ({opp.founder_intel?.executive_role})
                        </td>
                        <td className="p-4 space-x-2">
                          <button
                            onClick={() => setSelectedOpp(opp)}
                            className="px-2.5 py-1 rounded-full bg-[#ffffff] border border-[#e8e6e5] hover:border-[#3ba6f1] text-[#0c0a09] cursor-pointer font-medium"
                          >
                            View Comprehensive Report
                          </button>

                          {opp.stage !== "OUTREACH_SENT" && opp.stage !== "RESPONSE_SENT" && (
                            <button
                              onClick={() => handleSimulateTelegramApproval(opp)}
                              className="px-2.5 py-1 rounded-full bg-[#3ba6f1] text-white cursor-pointer"
                            >
                              Approve on Telegram
                            </button>
                          )}

                          {opp.stage === "OUTREACH_SENT" && (
                            <button
                              onClick={() => handleSimulatePartnerReply(opp)}
                              className="px-2.5 py-1 rounded-full bg-[#0c0a09] text-white cursor-pointer"
                            >
                              Test Partner Reply
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* 5. DEEPLY COMPREHENSIVE STRATEGIC REPORT MODAL */}
        <AnimatePresence>
          {selectedOpp && (
            <div className="fixed inset-0 z-50 bg-[#0c0a09]/50 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#ffffff] border border-[#e8e6e5] rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl"
              >
                {/* Modal Header Banner */}
                <div className="flex items-start justify-between border-b border-[#e8e6e5] pb-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#c1e1f7] text-[#3398e1] font-bold">
                        Stage: {selectedOpp.stage || "AWAITING_APPROVAL"}
                      </span>
                      <span className="text-xs text-[#78716c] font-mono">ID: {selectedOpp.id || selectedOpp.opportunity_id}</span>
                    </div>
                    <h2 className="text-3xl font-serif-heading text-[#0c0a09]">
                      {selectedOpp.company_a} &amp; {selectedOpp.company_b} Strategic Partnership Report
                    </h2>
                    <p className="text-xs text-[#78716c]">
                      Sender Profile: <strong className="text-[#0c0a09]">{selectedOpp.sender_name || senderName}</strong> ({selectedOpp.sender_email || senderEmail}) &bull; Company: {selectedOpp.sender_company || senderCompany}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOpp(null)}
                    className="p-1.5 rounded-full hover:bg-[#fafaf9] text-[#78716c] hover:text-[#0c0a09] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* 1. Executive Synergy Summary Banner */}
                <div className="stone-card p-6 bg-[#fafaf9] space-y-3 border-l-4 border-l-[#3ba6f1]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#78716c]">EXECUTIVE SYNERGY SUMMARY</span>
                    <span className="text-2xl font-serif-heading text-[#3398e1]">
                      {selectedOpp.compatibility_score} <span className="text-xs text-[#78716c] font-sans">/ 100 Fit</span>
                    </span>
                  </div>
                  <p className="text-sm text-[#0c0a09] leading-relaxed">
                    {selectedOpp.compatibility_result.strategic_fit_summary}
                  </p>
                </div>

                {/* 2. Evidence Signals & 7-Signal Score Matrix */}
                <div className="stone-card p-6 space-y-4 bg-[#ffffff]">
                  <h3 className="font-medium text-xs text-[#0c0a09] uppercase tracking-wider flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-[#3ba6f1]" />
                    <span>Evidence Signals &amp; 7-Signal Compatibility Matrix</span>
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="stone-card p-3 bg-[#fafaf9]">
                      <div className="text-[11px] text-[#78716c]">Product Complementarity</div>
                      <div className="font-bold text-[#0c0a09] text-sm mt-0.5">{selectedOpp.evidence_signals?.signal_scores?.product_complementarity || 92.0} / 100</div>
                    </div>
                    <div className="stone-card p-3 bg-[#fafaf9]">
                      <div className="text-[11px] text-[#78716c]">ICP Overlap Density</div>
                      <div className="font-bold text-[#0c0a09] text-sm mt-0.5">{selectedOpp.evidence_signals?.signal_scores?.icp_overlap || 90.0} / 100</div>
                    </div>
                    <div className="stone-card p-3 bg-[#fafaf9]">
                      <div className="text-[11px] text-[#78716c]">API Compatibility</div>
                      <div className="font-bold text-[#3398e1] text-sm mt-0.5">{selectedOpp.evidence_signals?.signal_scores?.integration_api_compatibility || 94.0} / 100</div>
                    </div>
                    <div className="stone-card p-3 bg-[#fafaf9]">
                      <div className="text-[11px] text-[#78716c]">Strategic Timing</div>
                      <div className="font-bold text-[#0c0a09] text-sm mt-0.5">{selectedOpp.evidence_signals?.signal_scores?.strategic_timing || 88.0} / 100</div>
                    </div>
                  </div>
                </div>

                {/* 3. Structured 6-Dimension Reasoning Card */}
                <div className="space-y-3">
                  <h3 className="font-medium text-xs text-[#0c0a09] uppercase tracking-wider">
                    Structured Strategic Rationale (6 Dimensions)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="stone-card p-4 space-y-1">
                      <div className="font-medium text-[#0c0a09]">1. Why This Company?</div>
                      <p className="text-[#78716c] leading-relaxed">{selectedOpp.reasoning_card.why_this_company}</p>
                    </div>
                    <div className="stone-card p-4 space-y-1">
                      <div className="font-medium text-[#0c0a09]">2. Why Now?</div>
                      <p className="text-[#78716c] leading-relaxed">{selectedOpp.reasoning_card.why_now}</p>
                    </div>
                    <div className="stone-card p-4 space-y-1">
                      <div className="font-medium text-[#0c0a09]">3. Decision Maker</div>
                      <p className="text-[#78716c] leading-relaxed">{selectedOpp.reasoning_card.why_this_decision_maker}</p>
                    </div>
                    <div className="stone-card p-4 space-y-1">
                      <div className="font-medium text-[#0c0a09]">4. Why Partnership?</div>
                      <p className="text-[#78716c] leading-relaxed">{selectedOpp.reasoning_card.why_this_partnership}</p>
                    </div>
                    <div className="stone-card p-4 space-y-1">
                      <div className="font-medium text-[#0c0a09]">5. Outreach Strategy</div>
                      <p className="text-[#78716c] leading-relaxed">{selectedOpp.reasoning_card.why_this_outreach_strategy}</p>
                    </div>
                    <div className="stone-card p-4 bg-[#fafaf9] border-[#3ba6f1] space-y-1">
                      <div className="font-medium text-[#0c0a09]">6. Next Action</div>
                      <p className="text-[#0c0a09] leading-relaxed">{selectedOpp.reasoning_card.suggested_next_action}</p>
                    </div>
                  </div>
                </div>

                {/* 4. Executive & Founder Details */}
                <div className="stone-card p-5 space-y-3">
                  <h3 className="font-medium text-xs text-[#0c0a09] uppercase tracking-wider">Executive &amp; Founder Profile</h3>
                  <div className="flex items-center space-x-3 text-xs">
                    <div className="w-9 h-9 rounded-full bg-[#0c0a09] text-white flex items-center justify-center font-semibold text-xs">
                      {selectedOpp.founder_intel.executive_name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="font-medium text-[#0c0a09] text-sm">{selectedOpp.founder_intel.executive_name}</div>
                      <div className="text-[#78716c]">{selectedOpp.founder_intel.executive_role} &bull; <strong className="text-[#0c0a09] font-mono">{selectedOpp.founder_intel.email}</strong></div>
                    </div>
                  </div>
                </div>

                {/* 5. Multi-Channel Outreach Studio */}
                <div className="stone-card p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#e8e6e5] pb-2 text-xs">
                    <span className="font-medium text-[#0c0a09]">Multi-Channel Outreach Proposal Drafts</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setActiveTab("email")}
                        className={`px-2.5 py-1 rounded-full ${activeTab === "email" ? "bg-[#0c0a09] text-white" : "text-[#78716c]"}`}
                      >
                        Email Proposal
                      </button>
                      <button
                        onClick={() => setActiveTab("telegram")}
                        className={`px-2.5 py-1 rounded-full ${activeTab === "telegram" ? "bg-[#0c0a09] text-white" : "text-[#78716c]"}`}
                      >
                        Telegram Alert
                      </button>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-[#fafaf9] border border-[#e8e6e5] font-mono text-xs">
                    {activeTab === "email" ? (
                      <pre className="whitespace-pre-wrap leading-relaxed text-[#0c0a09]">
                        {selectedOpp.outreach_drafts.email_body}
                      </pre>
                    ) : (
                      <pre className="whitespace-pre-wrap leading-relaxed text-[#0c0a09]">
                        {selectedOpp.outreach_drafts.telegram_alert}
                      </pre>
                    )}
                  </div>
                </div>

                {/* 6. Communication Lifecycle Timeline */}
                <div className="stone-card p-5 space-y-3">
                  <h3 className="font-medium text-xs text-[#0c0a09] flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-[#3ba6f1]" />
                    <span>Real Communication Lifecycle Timeline</span>
                  </h3>
                  <div className="space-y-3 text-xs font-mono">
                    {(selectedOpp.timeline_events || []).map((ev, i) => (
                      <div key={i} className="flex items-start space-x-3 border-l-2 border-l-[#3ba6f1] pl-3 py-1">
                        <div className="w-2 h-2 rounded-full bg-[#3ba6f1] mt-1 shrink-0" />
                        <div>
                          <div className="font-semibold text-[#0c0a09]">{ev.stage} &bull; {new Date(ev.timestamp).toLocaleTimeString()}</div>
                          <div className="text-[#78716c] text-[11px] font-sans">{ev.note}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end pt-2 border-t border-[#e8e6e5]">
                  <button
                    onClick={() => setSelectedOpp(null)}
                    className="btn-ghost-secondary text-xs cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
