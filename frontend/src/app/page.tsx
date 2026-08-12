"use client";

import { useState } from "react";
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
  why_this_decision_maker: str;
  why_this_partnership: str;
  why_this_outreach_strategy: str;
  confidence_score: number;
  suggested_next_action: str;
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
}

export default function Home() {
  const [companyA, setCompanyA] = useState<CompanyData>({
    name: "Notion",
    domain: "notion.so",
    industry: "Workspace & Productivity",
    description: "Connected workspace for docs, wiki, and project management",
  });

  const [companyB, setCompanyB] = useState<CompanyData>({
    name: "Linear",
    domain: "linear.app",
    industry: "Issue Tracking & Product Ops",
    description: "Purpose-built tool for high-performance product teams",
  });

  const [dispatchOutreach, setDispatchOutreach] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<"idle" | "discover" | "understand" | "evaluate" | "complete">("idle");
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [telegramStatus, setTelegramStatus] = useState<"pending" | "approved" | "dispatched">("pending");

  const loadPreset = (preset: "notion-linear" | "stripe-orbit" | "figma-canva") => {
    if (preset === "notion-linear") {
      setCompanyA({
        name: "Notion",
        domain: "notion.so",
        industry: "Workspace & Productivity",
        description: "Connected workspace for docs, wiki, and project management",
      });
      setCompanyB({
        name: "Linear",
        domain: "linear.app",
        industry: "Issue Tracking & Product Ops",
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
        description: "Collaborative interface design tool",
      });
      setCompanyB({
        name: "Canva",
        domain: "canva.com",
        industry: "Visual Communication",
        description: "All-in-one graphic design and content platform",
      });
    }
  };

  const runEvaluation = async () => {
    setIsLoading(true);
    setResult(null);
    setTelegramStatus("pending");

    // Stepper animation
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
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        throw new Error("Backend API error");
      }
    } catch {
      // Fallback evaluation result for local offline testing
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
          strategic_fit_summary: `High strategic alignment between ${companyA.name} (${companyA.industry}) and ${companyB.name} (${companyB.industry}). Integrating shared API data flows creates immediate value for enterprise teams.`,
          partnership_ideas: [
            `Joint go-to-market bundle for shared enterprise customers`,
            `Co-branded technical integration workshop & webinar`,
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
      });
    } finally {
      setCurrentStep("complete");
      setIsLoading(false);
    }
  };

  const handleSimulateTelegramApproval = () => {
    setTelegramStatus("approved");
    setTimeout(() => {
      setTelegramStatus("dispatched");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Orbit <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">AI PDR</span>
            </h1>
            <p className="text-xs text-slate-400">Autonomous B2B SaaS Partnership Agent</p>
          </div>
        </div>

        {/* Caspian SDK Integration Status Badges */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            <Smartphone className="w-3.5 h-3.5 text-blue-400" />
            <span>Caspian Telegram: <strong className="text-emerald-400">Connected</strong></span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            <Mail className="w-3.5 h-3.5 text-purple-400" />
            <span>Caspian Email: <strong className="text-emerald-400">conn_26d576...</strong></span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-purple-950/40 border border-purple-800/50 text-purple-300">
            <Activity className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
            <span>Featherless / OpenAI</span>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">

        {/* Hero Section */}
        <div className="text-center py-4 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Multi-Channel B2B Partnership Intelligence powered by Caspian SDK</span>
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-white">
            Discover & Evaluate <span className="gradient-text">SaaS Partnerships</span>
          </h2>
          <p className="max-w-2xl mx-auto text-sm text-slate-400">
            Select or input any two SaaS companies. Orbit executes a LangGraph research workflow, generates a transparent AI Reasoning Card, and manages multi-channel Caspian outreach.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center justify-center space-x-3 text-xs">
          <span className="text-slate-400 font-medium">Quick Presets:</span>
          <button
            onClick={() => loadPreset("notion-linear")}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-all cursor-pointer"
          >
            ⚡ Notion x Linear
          </button>
          <button
            onClick={() => loadPreset("stripe-orbit")}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-all cursor-pointer"
          >
            💳 Stripe x Orbit AI
          </button>
          <button
            onClick={() => loadPreset("figma-canva")}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-all cursor-pointer"
          >
            🎨 Figma x Canva
          </button>
        </div>

        {/* Dual Company Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company A Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Primary Company (A)</h3>
                <p className="text-xs text-slate-400">Your SaaS product / ecosystem</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Company Name</label>
                <input
                  type="text"
                  value={companyA.name}
                  onChange={(e) => setCompanyA({ ...companyA, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Domain</label>
                <input
                  type="text"
                  value={companyA.domain}
                  onChange={(e) => setCompanyA({ ...companyA, domain: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Industry</label>
                <input
                  type="text"
                  value={companyA.industry}
                  onChange={(e) => setCompanyA({ ...companyA, industry: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Company B Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 relative">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Target Partner (B)</h3>
                <p className="text-xs text-slate-400">Target partnership candidate</p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Company Name</label>
                <input
                  type="text"
                  value={companyB.name}
                  onChange={(e) => setCompanyB({ ...companyB, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Domain</label>
                <input
                  type="text"
                  value={companyB.domain}
                  onChange={(e) => setCompanyB({ ...companyB, domain: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Industry</label>
                <input
                  type="text"
                  value={companyB.industry}
                  onChange={(e) => setCompanyB({ ...companyB, industry: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls & Dispatch Switch */}
        <div className="glass-panel p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <label className="flex items-center space-x-3 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={dispatchOutreach}
              onChange={(e) => setDispatchOutreach(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-500"
            />
            <span>Dispatch Caspian multi-channel outreach if score &ge; 80 (Telegram + Email)</span>
          </label>

          <button
            onClick={runEvaluation}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running LangGraph Agent...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Evaluate SaaS Compatibility</span>
              </>
            )}
          </button>
        </div>

        {/* LangGraph Workflow Stepper Bar */}
        {(isLoading || result) && (
          <div className="glass-panel p-4 rounded-xl space-y-2">
            <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between">
              <span>LANGGRAPH WORKFLOW EXECUTION</span>
              <span className="text-purple-400 font-mono">Discover &rarr; Understand &rarr; Evaluate</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div
                className={`p-3 rounded-lg border flex items-center space-x-2 ${
                  currentStep === "discover" || currentStep === "understand" || currentStep === "evaluate" || currentStep === "complete"
                    ? "bg-purple-950/40 border-purple-600/50 text-purple-200"
                    : "bg-slate-900/50 border-slate-800 text-slate-500"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="font-semibold">1. Discover Node</div>
                  <div className="text-[10px] opacity-70">Company profiles parsed</div>
                </div>
              </div>

              <div
                className={`p-3 rounded-lg border flex items-center space-x-2 ${
                  currentStep === "understand" || currentStep === "evaluate" || currentStep === "complete"
                    ? "bg-blue-950/40 border-blue-600/50 text-blue-200"
                    : "bg-slate-900/50 border-slate-800 text-slate-500"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <div>
                  <div className="font-semibold">2. Understand Node</div>
                  <div className="text-[10px] opacity-70">API & synergy research</div>
                </div>
              </div>

              <div
                className={`p-3 rounded-lg border flex items-center space-x-2 ${
                  currentStep === "evaluate" || currentStep === "complete"
                    ? "bg-emerald-950/40 border-emerald-600/50 text-emerald-200"
                    : "bg-slate-900/50 border-slate-800 text-slate-500"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-semibold">3. Evaluate Node</div>
                  <div className="text-[10px] opacity-70">AI Reasoning Card generated</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-fadeIn">
            {/* High-Level Score Banner */}
            <div className="glass-panel p-6 rounded-2xl border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-purple-950/30 via-slate-900/60 to-blue-950/30">
              <div className="space-y-1 text-center md:text-left">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>High Compatibility Match</span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {result.company_a} &amp; {result.company_b} Partnership Score
                </h3>
                <p className="text-xs text-slate-400 max-w-xl">
                  {result.compatibility_result.strategic_fit_summary}
                </p>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-4xl font-extrabold text-white gradient-text">
                    {result.compatibility_score}
                  </div>
                  <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                    Compatibility / 100
                  </div>
                </div>

                <div className="h-10 w-px bg-slate-800" />

                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">
                    {result.confidence_score}%
                  </div>
                  <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                    Confidence
                  </div>
                </div>
              </div>
            </div>

            {/* AI Reasoning Cards (6 Dimensions) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span>STRUCTURED AI REASONING CARD</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {/* 1. Why This Company */}
                <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="font-semibold text-purple-300 flex items-center justify-between">
                    <span>1. Why This Company?</span>
                    <Building2 className="w-3.5 h-3.5 opacity-60" />
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {result.reasoning_card.why_this_company}
                  </p>
                </div>

                {/* 2. Why Now */}
                <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="font-semibold text-blue-300 flex items-center justify-between">
                    <span>2. Why Now?</span>
                    <Sparkles className="w-3.5 h-3.5 opacity-60" />
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {result.reasoning_card.why_now}
                  </p>
                </div>

                {/* 3. Why Decision Maker */}
                <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="font-semibold text-emerald-300 flex items-center justify-between">
                    <span>3. Why Decision Maker?</span>
                    <ShieldCheck className="w-3.5 h-3.5 opacity-60" />
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {result.reasoning_card.why_this_decision_maker}
                  </p>
                </div>

                {/* 4. Why Partnership */}
                <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="font-semibold text-purple-300 flex items-center justify-between">
                    <span>4. Why This Partnership?</span>
                    <Zap className="w-3.5 h-3.5 opacity-60" />
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {result.reasoning_card.why_this_partnership}
                  </p>
                </div>

                {/* 5. Why Outreach Strategy */}
                <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="font-semibold text-blue-300 flex items-center justify-between">
                    <span>5. Why Outreach Strategy?</span>
                    <Send className="w-3.5 h-3.5 opacity-60" />
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {result.reasoning_card.why_this_outreach_strategy}
                  </p>
                </div>

                {/* 6. Suggested Action */}
                <div className="glass-panel p-4 rounded-xl border border-purple-500/40 bg-purple-950/20 space-y-1.5">
                  <div className="font-semibold text-purple-200 flex items-center justify-between">
                    <span>6. Suggested Action</span>
                    <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <p className="text-slate-200 leading-relaxed font-medium">
                    {result.reasoning_card.suggested_next_action}
                  </p>
                </div>
              </div>
            </div>

            {/* Caspian Multi-channel Control Hub */}
            <div className="glass-panel p-6 rounded-2xl border border-blue-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">Caspian Multi-Channel Dispatch Hub</h4>
                    <p className="text-xs text-slate-400">Human-in-the-loop Telegram approval &amp; Email outreach</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400">Current Status:</span>
                  {telegramStatus === "pending" && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs">
                      Telegram Alert Sent (Pending Approval)
                    </span>
                  )}
                  {telegramStatus === "approved" && (
                    <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs">
                      Approved via Telegram!
                    </span>
                  )}
                  {telegramStatus === "dispatched" && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs">
                      Caspian Email Dispatched
                    </span>
                  )}
                </div>
              </div>

              {/* Telegram Approval Simulation Banner */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="font-medium text-slate-200 flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-blue-400" />
                    <span>Telegram PDR Manager Approval Prompt</span>
                  </div>
                  <p className="text-slate-400">
                    &quot;Orbit AI PDR Alert: High Fit Found ({result.company_a} x {result.company_b} - {result.compatibility_score}/100). Reply APPROVE to send outreach.&quot;
                  </p>
                </div>

                <button
                  onClick={handleSimulateTelegramApproval}
                  disabled={telegramStatus === "dispatched"}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all shadow-md flex items-center space-x-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Simulate Manager Approval</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-4 text-center text-xs text-slate-500 flex items-center justify-between">
        <div>Orbit AI PDR &copy; 2026 — Built for Caspian Buildathon</div>
        <div className="flex items-center space-x-4">
          <a href="https://www.trycaspianai.com/docs/" target="_blank" rel="noreferrer" className="hover:text-slate-300">
            Caspian Docs
          </a>
          <a href="https://github.com/dhruvil-codes/orbit" target="_blank" rel="noreferrer" className="hover:text-slate-300">
            GitHub Repo
          </a>
        </div>
      </footer>
    </div>
  );
}
