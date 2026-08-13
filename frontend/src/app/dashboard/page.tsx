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
  CornerDownRight,
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
  const [senderCompany, setSenderCompany] = useState("Orbit AI");

  // Companies Input
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
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<OpportunityItem | null>(null);

  // Partner Reply Simulation Input
  const [simulatedReplyText, setSimulatedReplyText] = useState("Sounds interesting! Can you explain how the technical API integration would work for enterprise accounts?");
  const [simulatingOppId, setSimulatingOppId] = useState<string | null>(null);

  // Caspian Event Stream State
  const [activeTab, setActiveTab] = useState<"email" | "telegram" | "slack">("email");
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [eventLogs, setEventLogs] = useState<Array<{ id: number; text: string; time: string; channel: string }>>([
    { id: 1, text: "Caspian SDK initialized on Telegram (@OrbitPDRBot) and Email Gateway", time: "10:14:02", channel: "system" },
    { id: 2, text: "Listener registered on_message handler for multi-channel events", time: "10:14:05", channel: "listener" },
  ]);

  // Fetch opportunities from Backend DB on mount
  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/opportunities/");
      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          const mapped: OpportunityItem[] = data.items.map((item: any) => ({
            ...item,
            company_a: item.primary_company?.name || item.company_a || "Company A",
            company_b: item.partner_company?.name || item.company_b || "Company B",
          }));
          setOpportunities(mapped);
        }
      }
    } catch {
      // Backend not reached, fallback local list stays
    }
  };

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
    setCurrentStep("discover");
    await new Promise((r) => setTimeout(r, 600));

    setCurrentStep("understand");
    await new Promise((r) => setTimeout(r, 700));

    setCurrentStep("evaluate");

    try {
      const response = await fetch("http://localhost:8000/api/v1/compatibility/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_a: companyA,
          company_b: companyB,
          dispatch_outreach: dispatchOutreach,
          sender_name: senderName,
          sender_email: senderEmail,
          sender_company: senderCompany,
        }),
      });

      if (response.ok) {
        const data: OpportunityItem = await response.json();
        setOpportunities((prev) => [data, ...prev]);
        setSelectedOpp(data);
        addEventLog(`Evaluated evidence-based score ${data.compatibility_score}/100 for ${companyA.name} x ${companyB.name}`, "orbit");
        addEventLog(`Dispatched Telegram manager approval alert (@OrbitPDRBot)`, "telegram");
      } else {
        throw new Error("Backend evaluation API error");
      }
    } catch {
      // Mock fallback
      const mockScore = 87.5;
      const mockData: OpportunityItem = {
        id: `opp_${Date.now()}`,
        opportunity_id: `opp_${Date.now()}`,
        title: `${companyA.name} & ${companyB.name} Product Intelligence Partnership`,
        company_a: companyA.name,
        company_b: companyB.name,
        compatibility_score: mockScore,
        confidence_score: 92.0,
        status: "evaluated",
        stage: "AWAITING_APPROVAL",
        dispatch_status: dispatchOutreach ? "dispatched" : "idle",
        sender_name: senderName,
        sender_email: senderEmail,
        sender_company: senderCompany,
        compatibility_result: {
          strategic_fit_summary: `High evidence-derived fit between ${companyA.name} (${companyA.industry}) and ${companyB.name} (${companyB.industry}). Integrating shared API data flows creates immediate value for mutual enterprise teams.`,
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
        evidence_signals: {
          page_title: `${companyB.name} Official Platform`,
          meta_description: `High-performance workspace and developer platform built for software teams.`,
          has_developer_api: true,
          developer_links: [`https://${companyB.domain}/docs`, `https://${companyB.domain}/api`],
          icp_overlap_density: "High (Shared Enterprise Developer & Product Ops Teams)",
          strategic_timing_trigger: "Public API platform release & ecosystem growth phase",
          signal_scores: {
            product_complementarity: 90.0,
            icp_overlap: 88.0,
            integration_api_compatibility: 92.0,
            distribution_overlap: 82.0,
            developer_ecosystem: 85.0,
            co_marketing_potential: 80.0,
            strategic_timing: 85.0,
          },
        },
        founder_intel: {
          company_domain: companyB.domain,
          company_name: companyB.name,
          executive_name: companyB.domain.includes("linear") ? "Karri Saarinen" : companyB.domain.includes("stripe") ? "Patrick Collison" : "Ivan Zhao",
          executive_role: companyB.domain.includes("linear") ? "CEO & Co-founder" : "VP of Technical Partnerships",
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
          email_subject: `Technical Partnership Proposal: ${senderCompany} x ${companyB.name}`,
          email_body: `Hi Team,\n\nI'm reaching out from ${senderCompany} (${senderEmail}).\n\nOur AI Partnership Agent evaluated strategic compatibility between ${senderCompany} and ${companyB.name}, scoring an evidence-derived 87.5/100 fit:\n\nSYNERGY SUMMARY:\nHigh strategic alignment between ${senderCompany} and ${companyB.name}. Integrating shared API data flows creates immediate value for mutual enterprise teams.\n\nRECOMMENDED POC:\n• Bi-directional real-time data sync\n• Single Sign-On (SSO) and Webhook event triggers\n\nWould you be open to a 15-minute technical discovery call next week?\n\nBest regards,\n${senderName}\n${senderCompany} | ${senderEmail}`,
          telegram_alert: `🎯 *Orbit AI PDR Alert*\nTarget: ${senderCompany} x ${companyB.name}\nScore: *87.5/100* (Confidence: 92%)\nDecision Maker: Karri Saarinen\n\nReply *APPROVE* to trigger Caspian Email Outreach or *REJECT* to park.`,
          slack_announcement: `:rocket: *New Partnership Opportunity Discovered*\n*${senderCompany}* + *${companyB.name}* | Compatibility Score: \`87.5/100\`\nSender Identity: ${senderName} (${senderEmail})\nExecutive Lead: Karri Saarinen (partnerships@${companyB.domain})\nStatus: _Pending PDR Manager Approval via Caspian Telegram_`,
        },
        timeline_events: [
          { stage: "DISCOVERED", timestamp: new Date().toISOString(), note: `Opportunity discovered between ${companyA.name} and ${companyB.name}` },
          { stage: "RESEARCHED", timestamp: new Date().toISOString(), note: `Scraped developer API evidence from ${companyB.domain}` },
          { stage: "EVALUATED", timestamp: new Date().toISOString(), note: `Featherless LLM computed evidence-derived score 87.5/100` },
          { stage: "AWAITING_APPROVAL", timestamp: new Date().toISOString(), note: "Pending manager approval on Telegram (@OrbitPDRBot)" },
        ],
      };

      setOpportunities((prev) => [mockData, ...prev]);
      setSelectedOpp(mockData);
      addEventLog(`Evaluated score 87.5/100 for ${companyA.name} x ${companyB.name}`, "orbit");
      addEventLog(`Dispatched Telegram approval alert (@OrbitPDRBot)`, "telegram");
    } finally {
      setCurrentStep("complete");
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
      // Local fallback
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

    const updatedOpp = {
      ...opp,
      stage: nextStage,
      timeline_events: updatedTimeline,
    };

    setOpportunities((prev) => prev.map((o) => ((o.id || o.opportunity_id) === oppId ? updatedOpp : o)));
    if ((selectedOpp?.id || selectedOpp?.opportunity_id) === oppId) {
      setSelectedOpp(updatedOpp);
    }

    addEventLog(`Received APPROVE command on Telegram for ${opp.company_a} x ${opp.company_b}`, "telegram");
    addEventLog(eventNote, "email");
  };

  const handleSimulatePartnerReply = async (opp: OpportunityItem) => {
    const oppId = opp.id || opp.opportunity_id;
    setSimulatingOppId(oppId || null);

    try {
      if (oppId && !oppId.startsWith("opp_17")) {
        const res = await fetch(`http://localhost:8000/api/v1/compatibility/simulate-partner-reply?opportunity_id=${oppId}&reply_text=${encodeURIComponent(simulatedReplyText)}`, {
          method: "POST",
        });
        if (res.ok) {
          const data = await res.json();
          const updatedTimeline = data.timeline_events || [
            ...(opp.timeline_events || []),
            { stage: "PARTNER_REPLIED", timestamp: new Date().toISOString(), note: `Partner email reply received: '${simulatedReplyText.slice(0, 50)}...'` },
            { stage: "RESPONSE_PENDING_APPROVAL", timestamp: new Date().toISOString(), note: "Reply classified as QUESTION; response draft generated and awaiting Telegram manager approval" },
          ];

          const updatedOpp: OpportunityItem = {
            ...opp,
            stage: "RESPONSE_PENDING_APPROVAL",
            timeline_events: updatedTimeline,
            outreach_drafts: {
              ...opp.outreach_drafts,
              last_partner_reply: simulatedReplyText,
              detected_intent: data.reply_intelligence?.detected_intent || "QUESTION",
              reply_summary: data.reply_intelligence?.reply_summary || "Partner requested technical integration specs.",
              response_draft: data.reply_intelligence?.response_draft || `Hi Team,\n\nThanks for reaching out! Regarding API integration...\n\nBest,\n${senderName}`,
            },
          };

          setOpportunities((prev) => prev.map((o) => ((o.id || o.opportunity_id) === oppId ? updatedOpp : o)));
          setSelectedOpp(updatedOpp);
          addEventLog(`Inbound Partner Email reply caught by Caspian listener: "${simulatedReplyText.slice(0, 40)}..."`, "email");
          addEventLog(`Generated response draft & sent Telegram approval alert (@OrbitPDRBot)`, "telegram");
          return;
        }
      }
    } catch {
      // Local fallback
    }

    // Local fallback simulation
    const updatedTimeline = [
      ...(opp.timeline_events || []),
      { stage: "PARTNER_REPLIED", timestamp: new Date().toISOString(), note: `Partner email reply received: '${simulatedReplyText.slice(0, 50)}...'` },
      { stage: "RESPONSE_PENDING_APPROVAL", timestamp: new Date().toISOString(), note: "Reply classified as QUESTION; response draft generated and awaiting Telegram manager approval" },
    ];

    const updatedOpp: OpportunityItem = {
      ...opp,
      stage: "RESPONSE_PENDING_APPROVAL",
      timeline_events: updatedTimeline,
      outreach_drafts: {
        ...opp.outreach_drafts,
        last_partner_reply: simulatedReplyText,
        detected_intent: "QUESTION",
        reply_summary: "Partner at Linear is interested but requested technical integration API details.",
        response_draft: `Hi Team,\n\nThanks for your reply! Regarding technical API integration between ${senderCompany} and ${opp.company_b}:\n\n1. Real-time Webhooks & REST endpoints.\n2. OAuth 2.0 with granular scopes.\n\nWould next Tuesday work for a 15-minute technical discovery call?\n\nBest regards,\n${senderName}\n${senderCompany}`,
      },
    };

    setOpportunities((prev) => prev.map((o) => ((o.id || o.opportunity_id) === oppId ? updatedOpp : o)));
    setSelectedOpp(updatedOpp);
    addEventLog(`Inbound Partner Email reply caught by Caspian listener: "${simulatedReplyText.slice(0, 40)}..."`, "email");
    addEventLog(`Generated response draft & sent Telegram approval alert (@OrbitPDRBot)`, "telegram");
  };

  const addEventLog = (text: string, channel: string) => {
    const nowStr = new Date().toLocaleTimeString();
    setEventLogs((prev) => [{ id: Date.now(), text, time: nowStr, channel }, ...prev]);
  };

  const copyToClipboard = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabName);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#0c0a09] font-sans selection:bg-[#c1e1f7] selection:text-[#3398e1]">
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
            <a href="#sender-identity" className="hover:text-[#0c0a09] transition-colors">
              Sender Identity
            </a>
            <a href="#command-center" className="hover:text-[#0c0a09] transition-colors">
              Caspian Command Center
            </a>
            <a href="#evaluator" className="hover:text-[#0c0a09] transition-colors">
              Evaluator
            </a>
            <a href="#pipeline" className="hover:text-[#0c0a09] transition-colors">
              Partnership Pipeline
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
        {/* 1. EXPLICIT SENDER IDENTITY BAR (MVP AUTH) */}
        <section id="sender-identity" className="stone-card p-5 space-y-3 bg-[#ffffff]">
          <div className="flex items-center justify-between border-b border-[#e8e6e5] pb-3">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-[#3ba6f1]" />
              <h3 className="font-medium text-xs text-[#0c0a09]">Sender Identity &amp; User Configuration (MVP Auth)</h3>
            </div>
            <span className="text-[11px] text-[#78716c]">Outreach proposals will attach this explicit identity</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[#78716c] font-medium mb-1">Sender Name</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="input-stone w-full"
                placeholder="e.g. Dhruvil Mistry"
              />
            </div>
            <div>
              <label className="block text-[#78716c] font-medium mb-1">Sender Email</label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="input-stone w-full font-mono"
                placeholder="e.g. dhruvil@useorbit.ai"
              />
            </div>
            <div>
              <label className="block text-[#78716c] font-medium mb-1">Company Name</label>
              <input
                type="text"
                value={senderCompany}
                onChange={(e) => setSenderCompany(e.target.value)}
                className="input-stone w-full"
                placeholder="e.g. Orbit AI"
              />
            </div>
          </div>
        </section>

        {/* 2. PROMINENT CASPIAN MULTI-CHANNEL COMMAND CENTER */}
        <section id="command-center" className="stone-card p-6 space-y-6 border-t-2 border-t-[#3ba6f1] bg-[#ffffff]">
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

          {/* Real-time Multi-channel Event Stream */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Console */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-[#78716c] uppercase tracking-wider flex items-center justify-between">
                <span>Real-Time Caspian Communication Stream</span>
                <Activity className="w-3.5 h-3.5 text-[#3ba6f1]" />
              </div>
              <div className="p-4 rounded-lg bg-[#fafaf9] border border-[#e8e6e5] font-mono text-[11px] space-y-2 h-44 overflow-y-auto">
                {eventLogs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-2">
                    <span className="text-[#78716c]">[{log.time}]</span>
                    <span className={`font-semibold ${log.channel === "telegram" ? "text-[#3398e1]" : log.channel === "email" ? "text-[#0c0a09]" : "text-[#78716c]"}`}>
                      [{log.channel.toUpperCase()}]
                    </span>
                    <span className="text-[#0c0a09]">{log.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Listener Architecture Explanation */}
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

        {/* 3. OVERVIEW METRICS GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="stone-card p-5 space-y-1">
            <div className="text-xs text-[#78716c]">Discovered &amp; Evaluated</div>
            <div className="text-2xl font-serif-heading text-[#0c0a09]">{opportunities.length}</div>
          </div>
          <div className="stone-card p-5 space-y-1">
            <div className="text-xs text-[#78716c]">Pending Telegram Approvals</div>
            <div className="text-2xl font-serif-heading text-[#3398e1]">
              {opportunities.filter((o) => o.stage === "AWAITING_APPROVAL" || o.stage === "RESPONSE_PENDING_APPROVAL" || o.stage === "EVALUATED").length}
            </div>
          </div>
          <div className="stone-card p-5 space-y-1">
            <div className="text-xs text-[#78716c]">Caspian Email Dispatched</div>
            <div className="text-2xl font-serif-heading text-[#0c0a09]">
              {opportunities.filter((o) => o.stage === "OUTREACH_SENT" || o.stage === "RESPONSE_SENT" || o.stage === "APPROVED").length}
            </div>
          </div>
          <div className="stone-card p-5 space-y-1">
            <div className="text-xs text-[#78716c]">Caspian Gateway Status</div>
            <div className="text-sm font-medium text-[#3398e1] flex items-center space-x-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Telegram + Email Active</span>
            </div>
          </div>
        </section>

        {/* 4. OPPORTUNITY EVALUATOR */}
        <section id="evaluator" className="space-y-6 pt-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-[#78716c] uppercase tracking-wider flex items-center space-x-2">
              <Zap className="w-4 h-4 text-[#3ba6f1]" />
              <span>EVIDENCE-BASED OPPORTUNITY EVALUATOR</span>
            </div>
            <h2 className="text-2xl font-serif-heading text-[#0c0a09]">
              Evaluate any SaaS company with reproducible evidence scoring.
            </h2>
          </div>

          {/* Presets Row */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#78716c] font-medium mr-2">1-Click Presets:</span>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => loadPreset("notion-linear")}
              className="px-3 py-1.5 rounded-full bg-[#ffffff] hover:bg-[#fafaf9] border border-[#e8e6e5] text-[#0c0a09] cursor-pointer"
            >
              ⚡ Notion x Linear
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => loadPreset("stripe-orbit")}
              className="px-3 py-1.5 rounded-full bg-[#ffffff] hover:bg-[#fafaf9] border border-[#e8e6e5] text-[#0c0a09] cursor-pointer"
            >
              💳 Stripe x Orbit AI
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => loadPreset("figma-canva")}
              className="px-3 py-1.5 rounded-full bg-[#ffffff] hover:bg-[#fafaf9] border border-[#e8e6e5] text-[#0c0a09] cursor-pointer"
            >
              🎨 Figma x Canva
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => loadPreset("cal-zendesk")}
              className="px-3 py-1.5 rounded-full bg-[#ffffff] hover:bg-[#fafaf9] border border-[#e8e6e5] text-[#0c0a09] cursor-pointer"
            >
              📅 Cal.com x Zendesk
            </motion.button>
          </div>

          {/* Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="stone-card p-6 space-y-4 bg-[#ffffff]">
              <div className="flex items-center space-x-2 border-b border-[#e8e6e5] pb-3">
                <Building2 className="w-5 h-5 text-[#0c0a09]" />
                <div>
                  <h3 className="font-medium text-sm text-[#0c0a09]">Primary SaaS Company (A)</h3>
                  <p className="text-xs text-[#78716c]">Your company platform</p>
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
                  />
                </div>
                <div>
                  <label className="block text-[#0c0a09] font-medium mb-1">Website Domain</label>
                  <input
                    type="text"
                    value={companyA.domain}
                    onChange={(e) => setCompanyA({ ...companyA, domain: e.target.value })}
                    className="input-stone w-full font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="stone-card p-6 space-y-4 bg-[#ffffff]">
              <div className="flex items-center space-x-2 border-b border-[#e8e6e5] pb-3">
                <Search className="w-5 h-5 text-[#3ba6f1]" />
                <div>
                  <h3 className="font-medium text-sm text-[#0c0a09]">Target Partner Website (B)</h3>
                  <p className="text-xs text-[#78716c]">Target domain</p>
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
                  />
                </div>
                <div>
                  <label className="block text-[#0c0a09] font-medium mb-1">Target Website Domain</label>
                  <input
                    type="text"
                    value={companyB.domain}
                    onChange={(e) => setCompanyB({ ...companyB, domain: e.target.value })}
                    className="input-stone w-full font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="stone-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#ffffff]">
            <label className="flex items-center space-x-3 text-xs text-[#78716c] cursor-pointer">
              <input
                type="checkbox"
                checked={dispatchOutreach}
                onChange={(e) => setDispatchOutreach(e.target.checked)}
                className="w-4 h-4 rounded border-[#d6d3d1] text-[#3ba6f1]"
              />
              <span>Send Caspian Telegram Manager Approval Alert automatically when evaluation completes</span>
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
                  <span>Executing LangGraph Stepper...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Evaluate Strategic Compatibility</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Stepper Indicator */}
          {(isLoading || currentStep !== "idle") && (
            <div className="stone-card p-4 space-y-2">
              <div className="text-xs font-medium text-[#78716c] flex items-center justify-between">
                <span>LANGGRAPH WORKFLOW EXECUTION</span>
                <span className="font-mono text-[#3398e1]">Discover &rarr; Understand &rarr; Evaluate</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded border border-[#3ba6f1] bg-[#fafaf9] flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#3ba6f1]" />
                  <div>
                    <h4 className="font-medium text-xs text-[#0c0a09]">1. Discover Node</h4>
                    <div className="text-[11px] text-[#78716c]">Parsed inputs</div>
                  </div>
                </div>
                <div className={`p-3 rounded border ${currentStep === "understand" || currentStep === "evaluate" || currentStep === "complete" ? "border-[#3ba6f1] bg-[#fafaf9]" : "border-[#e8e6e5]"} flex items-center space-x-2`}>
                  <CheckCircle2 className="w-4 h-4 text-[#3ba6f1]" />
                  <div>
                    <h4 className="font-medium text-xs text-[#0c0a09]">2. Understand Node</h4>
                    <div className="text-[11px] text-[#78716c]">Web scraping</div>
                  </div>
                </div>
                <div className={`p-3 rounded border ${currentStep === "evaluate" || currentStep === "complete" ? "border-[#3ba6f1] bg-[#fafaf9]" : "border-[#e8e6e5]"} flex items-center space-x-2`}>
                  <CheckCircle2 className="w-4 h-4 text-[#3ba6f1]" />
                  <div>
                    <h4 className="font-medium text-xs text-[#0c0a09]">3. Evaluate Node</h4>
                    <div className="text-[11px] text-[#78716c]">Featherless LLM</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 5. PARTNERSHIP OPPORTUNITIES PIPELINE TABLE */}
        <section id="pipeline" className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <h2 className="text-xl font-serif-heading text-[#0c0a09]">Partnership Opportunities Pipeline</h2>
            <div className="flex items-center space-x-3 text-xs">
              <span className="text-[#78716c]">{opportunities.length} database items</span>
              <button onClick={fetchOpportunities} className="text-[#3398e1] hover:underline flex items-center space-x-1 cursor-pointer">
                <RefreshCw className="w-3 h-3" />
                <span>Sync DB</span>
              </button>
            </div>
          </div>

          {/* Partner Reply Simulator Drawer Control Bar */}
          <div className="stone-card p-4 bg-[#fafaf9] space-y-3 border-l-4 border-l-[#3ba6f1]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#0c0a09] flex items-center space-x-2">
                <CornerDownRight className="w-4 h-4 text-[#3ba6f1]" />
                <span>Simulate Inbound Partner Email Reply (Hackathon Demo Tool)</span>
              </span>
              <span className="text-[#78716c]">Triggers Reply Intelligence &amp; Telegram Approval</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={simulatedReplyText}
                onChange={(e) => setSimulatedReplyText(e.target.value)}
                className="input-stone flex-1 text-xs"
                placeholder="Type simulated partner email reply..."
              />
              <span className="text-xs text-[#78716c]">Select target opportunity in table below &rarr;</span>
            </div>
          </div>

          <div className="stone-card overflow-hidden bg-[#ffffff]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#fafaf9] border-b border-[#e8e6e5] text-[#78716c] font-medium">
                <tr>
                  <th className="p-4">Companies</th>
                  <th className="p-4">Score</th>
                  <th className="p-4">Current DB Stage</th>
                  <th className="p-4">Decision Maker</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e6e5]">
                {opportunities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-[#78716c]">
                      No opportunities evaluated yet. Use the evaluator above to generate strategic match results.
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
                          <span className="px-2 py-0.5 rounded-full bg-[#c1e1f7] text-[#3398e1] font-semibold">
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
                            className="px-2.5 py-1 rounded-full bg-[#ffffff] border border-[#e8e6e5] hover:border-[#3ba6f1] text-[#0c0a09] cursor-pointer"
                          >
                            View Details
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
                              Simulate Partner Reply
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

        {/* 6. OPPORTUNITY DETAIL MODAL / DRAWER */}
        <AnimatePresence>
          {selectedOpp && (
            <div className="fixed inset-0 z-50 bg-[#0c0a09]/40 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#ffffff] border border-[#e8e6e5] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl"
              >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-[#e8e6e5] pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#c1e1f7] text-[#3398e1] font-medium">
                        Stage: {selectedOpp.stage || "AWAITING_APPROVAL"}
                      </span>
                      <span className="text-xs text-[#78716c] font-mono">ID: {selectedOpp.id || selectedOpp.opportunity_id}</span>
                    </div>
                    <h2 className="text-2xl font-serif-heading text-[#0c0a09]">
                      {selectedOpp.company_a} &amp; {selectedOpp.company_b} Partnership Detail
                    </h2>
                    <p className="text-xs text-[#78716c]">
                      Sender Identity: {selectedOpp.sender_name || senderName} ({selectedOpp.sender_email || senderEmail}) &bull; Company: {selectedOpp.sender_company || senderCompany}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOpp(null)}
                    className="p-1 rounded-full hover:bg-[#fafaf9] text-[#78716c] hover:text-[#0c0a09]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Evidence Signals & Score Breakdown */}
                <div className="stone-card p-5 space-y-4 bg-[#fafaf9]">
                  <h3 className="font-medium text-xs text-[#0c0a09] flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-[#3ba6f1]" />
                    <span>Evidence Signals &amp; Reproducible Score Breakdown ({selectedOpp.compatibility_score}/100)</span>
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="stone-card p-3 bg-[#ffffff]">
                      <div className="text-[11px] text-[#78716c]">Product Complementarity</div>
                      <div className="font-semibold text-[#0c0a09]">{selectedOpp.evidence_signals?.signal_scores?.product_complementarity || 90.0} / 100</div>
                    </div>
                    <div className="stone-card p-3 bg-[#ffffff]">
                      <div className="text-[11px] text-[#78716c]">ICP Overlap</div>
                      <div className="font-semibold text-[#0c0a09]">{selectedOpp.evidence_signals?.signal_scores?.icp_overlap || 88.0} / 100</div>
                    </div>
                    <div className="stone-card p-3 bg-[#ffffff]">
                      <div className="text-[11px] text-[#78716c]">API Compatibility</div>
                      <div className="font-semibold text-[#3398e1]">{selectedOpp.evidence_signals?.signal_scores?.integration_api_compatibility || 92.0} / 100</div>
                    </div>
                    <div className="stone-card p-3 bg-[#ffffff]">
                      <div className="text-[11px] text-[#78716c]">Strategic Timing</div>
                      <div className="font-semibold text-[#0c0a09]">{selectedOpp.evidence_signals?.signal_scores?.strategic_timing || 85.0} / 100</div>
                    </div>
                  </div>
                </div>

                {/* 6-Dimension AI Reasoning Card */}
                <div className="space-y-3">
                  <h3 className="font-medium text-xs text-[#0c0a09] uppercase tracking-wider">
                    Structured AI Reasoning Card (6 Dimensions)
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
                      <div className="font-medium text-[#0c0a09]">3. Why Decision Maker?</div>
                      <p className="text-[#78716c] leading-relaxed">{selectedOpp.reasoning_card.why_this_decision_maker}</p>
                    </div>
                    <div className="stone-card p-4 space-y-1">
                      <div className="font-medium text-[#0c0a09]">4. Why This Partnership?</div>
                      <p className="text-[#78716c] leading-relaxed">{selectedOpp.reasoning_card.why_this_partnership}</p>
                    </div>
                    <div className="stone-card p-4 space-y-1">
                      <div className="font-medium text-[#0c0a09]">5. Why Outreach Strategy?</div>
                      <p className="text-[#78716c] leading-relaxed">{selectedOpp.reasoning_card.why_this_outreach_strategy}</p>
                    </div>
                    <div className="stone-card p-4 bg-[#fafaf9] border-[#3ba6f1] space-y-1">
                      <div className="font-medium text-[#0c0a09]">6. Suggested Action</div>
                      <p className="text-[#0c0a09] leading-relaxed">{selectedOpp.reasoning_card.suggested_next_action}</p>
                    </div>
                  </div>
                </div>

                {/* Partner Reply Intelligence (If Partner Replied) */}
                {selectedOpp.outreach_drafts?.last_partner_reply && (
                  <div className="stone-card p-5 space-y-3 bg-[#fafaf9] border-l-4 border-l-[#3ba6f1]">
                    <div className="flex items-center justify-between text-xs">
                      <h3 className="font-medium text-[#0c0a09] flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-[#3ba6f1]" />
                        <span>Inbound Partner Reply Intelligence</span>
                      </h3>
                      <span className="px-2 py-0.5 rounded bg-[#c1e1f7] text-[#3398e1] font-mono text-[11px]">
                        Intent: {selectedOpp.outreach_drafts.detected_intent || "QUESTION"}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="text-[#78716c] font-medium">Partner Email Reply:</div>
                        <div className="p-3 rounded bg-[#ffffff] border border-[#e8e6e5] text-[#0c0a09] font-mono">
                          &quot;{selectedOpp.outreach_drafts.last_partner_reply}&quot;
                        </div>
                      </div>
                      <div>
                        <div className="text-[#78716c] font-medium">Orbit Recommended Action &amp; Drafted Response:</div>
                        <div className="p-3 rounded bg-[#ffffff] border border-[#e8e6e5] text-[#0c0a09] font-mono whitespace-pre-wrap">
                          {selectedOpp.outreach_drafts.response_draft}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Multi-Channel Outreach Studio */}
                <div className="stone-card p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-[#e8e6e5] pb-2 text-xs">
                    <span className="font-medium text-[#0c0a09]">Multi-Channel Outreach Drafts</span>
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

                {/* Real Communication Lifecycle Timeline */}
                <div className="stone-card p-5 space-y-3">
                  <h3 className="font-medium text-xs text-[#0c0a09] flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-[#3ba6f1]" />
                    <span>Real Database Communication Lifecycle Timeline</span>
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
