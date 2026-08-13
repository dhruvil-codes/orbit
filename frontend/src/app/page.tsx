"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Flame,
  Star,
  Zap,
  ArrowRight,
  ShieldCheck,
  Brain,
  Building2,
  UserCheck,
  Smartphone,
  Mail,
  ArrowUpRight,
  Layers,
  Sparkles,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#0c0a09] font-sans selection:bg-[#c1e1f7] selection:text-[#3398e1]">
      {/* ─────────────────────────────────────────────────────────────────────────────
          TOP NAVIGATION BAR (Seline Landing Aesthetic)
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
            <a href="#vision" className="hover:text-[#0c0a09] transition-colors">
              Vision &amp; Philosophy
            </a>
            <a href="#how-it-works" className="hover:text-[#0c0a09] transition-colors">
              How Orbit Thinks
            </a>
            <a href="#caspian-architecture" className="hover:text-[#0c0a09] transition-colors">
              Caspian Engine
            </a>
            <a href="#features" className="hover:text-[#0c0a09] transition-colors">
              Capabilities
            </a>
          </div>

          {/* Primary CTA button navigating to /dashboard */}
          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="btn-cyan-primary text-xs inline-flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Open Partnership Workspace</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ─────────────────────────────────────────────────────────────────────────────
          EDITORIAL LANDING HERO SECTION
         ───────────────────────────────────────────────────────────────────────────── */}
      <section id="vision" className="pt-20 pb-16 px-6 max-w-[1200px] mx-auto text-left space-y-12">
        {/* Eyebrow & Display Headline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 max-w-3xl"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#ffffff] border border-[#e8e6e5] text-xs text-[#78716c]">
            <Star className="w-3.5 h-3.5 text-[#0c0a09] fill-[#0c0a09]" />
            <span>Autonomous AI Employee for B2B SaaS Partnerships &bull; Caspian SDK</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-[56px] font-serif-heading leading-[1.08] tracking-[-0.02em] text-[#0c0a09]">
            The autonomous AI employee for B2B SaaS technology partnerships with{" "}
            <span className="highlight-span">whispered precision</span>.
          </h1>

          <p className="text-base text-[#78716c] leading-[1.69] max-w-2xl font-normal">
            Orbit is not a cold email sender. Orbit is an autonomous Partnership Development Representative (PDR) that discovers strategic SaaS synergies, computes transparent AI Reasoning Cards, extracts founder intel, and executes human-in-the-loop multi-channel deal lifecycles over Telegram &amp; Email.
          </p>
        </motion.div>

        {/* Action Button Pair */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap items-center gap-4 pt-2"
        >
          <Link
            href="/dashboard"
            className="btn-cyan-primary flex items-center space-x-2 text-sm cursor-pointer"
          >
            <span>Open Partnership Workspace</span>
            <Zap className="w-4 h-4" />
          </Link>
          <a href="#how-it-works" className="btn-ghost-secondary flex items-center space-x-2 text-sm cursor-pointer">
            <span>Explore Architecture</span>
            <ArrowRight className="w-4 h-4 text-[#78716c]" />
          </a>
        </motion.div>

        {/* Hero Dashboard Preview Card */}
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
              <span className="ml-2 font-mono text-[11px]">orbit.ai/partnership-workspace</span>
            </div>
            <span className="text-[11px] text-[#3398e1] font-mono">LIVE CONCEPT</span>
          </div>

          <div className="stone-card p-6 bg-[#fafaf9] dashboard-muted-filter space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e8e6e5] pb-4">
              <div>
                <span className="text-[11px] font-semibold text-[#78716c] uppercase tracking-wider">CORE PHILOSOPHY</span>
                <div className="text-2xl font-serif-heading text-[#0c0a09] tracking-tight mt-1">
                  Orbit THINKS. Caspian COMMUNICATES. The human CONTROLS.
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs">
                <div className="text-right">
                  <div className="text-xs text-[#78716c]">Caspian Gateway</div>
                  <div className="font-semibold text-[#3398e1]">Telegram + Email Active</div>
                </div>
              </div>
            </div>

            {/* 3-Step Flow Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="stone-card p-4 space-y-1">
                <h3 className="font-medium text-xs text-[#0c0a09]">1. Evidence &amp; Synergy Scraped</h3>
                <p className="text-[#78716c] leading-relaxed">
                  Live web research extracts API endpoints, ICP density, and strategic timing triggers.
                </p>
              </div>

              <div className="stone-card p-4 space-y-1">
                <h3 className="font-medium text-xs text-[#0c0a09]">2. Human Approval Requested</h3>
                <p className="text-[#78716c] leading-relaxed">
                  Orbit pings the PDR manager on Telegram with structured reasoning before sending.
                </p>
              </div>

              <div className="stone-card p-4 space-y-1">
                <h3 className="font-medium text-xs text-[#0c0a09]">3. Multi-Channel Deal Execution</h3>
                <p className="text-[#78716c] leading-relaxed">
                  Caspian SDK handles inbound partner email replies and advances deal lifecycle.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          HOW IT WORKS / ARCHITECTURE SECTION
         ───────────────────────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 px-6 max-w-[1200px] mx-auto space-y-12 border-t border-[#e8e6e5]">
        <div className="space-y-3 max-w-2xl">
          <div className="text-xs font-semibold text-[#78716c] uppercase tracking-wider flex items-center space-x-2">
            <Layers className="w-4 h-4 text-[#3ba6f1]" />
            <span>THE 3-STEP AUTONOMOUS WORKFLOW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-heading text-[#0c0a09]">
            How Orbit transforms cold outreach into strategic deal flow.
          </h2>
        </div>

        {/* 3-Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div whileHover={{ y: -3 }} className="stone-card p-6 space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#0c0a09] text-white flex items-center justify-center font-semibold text-xs">
              1
            </div>
            <h3 className="font-medium text-base text-[#0c0a09]">Discover &amp; Evaluate Fit</h3>
            <p className="text-xs text-[#78716c] leading-relaxed">
              LangGraph nodes execute web research, extract API docs evidence, and use Featherless LLM inference to compute compatibility scores and 6-dimension AI Reasoning Cards.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -3 }} className="stone-card p-6 space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#3ba6f1] text-white flex items-center justify-center font-semibold text-xs">
              2
            </div>
            <h3 className="font-medium text-base text-[#0c0a09]">Telegram Manager Approval</h3>
            <p className="text-xs text-[#78716c] leading-relaxed">
              Orbit sends an interactive approval request to the manager over Telegram via Caspian SDK. The manager reviews the AI reasoning and replies <strong className="text-[#0c0a09]">APPROVE</strong> or <strong className="text-[#0c0a09]">REJECT</strong>.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -3 }} className="stone-card p-6 space-y-3">
            <div className="w-8 h-8 rounded-full bg-[#0c0a09] text-white flex items-center justify-center font-semibold text-xs">
              3
            </div>
            <h3 className="font-medium text-base text-[#0c0a09]">Caspian Deal Escalation</h3>
            <p className="text-xs text-[#78716c] leading-relaxed">
              Upon approval, Caspian dispatches the proposal email to the partner executive. When the partner replies, Caspian catches the message, Orbit interprets the intent, and pings Telegram for response approval.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          CASPIAN SDK ARCHITECTURE DIAGRAM SECTION
         ───────────────────────────────────────────────────────────────────────────── */}
      <section id="caspian-architecture" className="py-16 px-6 max-w-[1200px] mx-auto space-y-8 border-t border-[#e8e6e5]">
        <div className="stone-card p-8 space-y-6 bg-[#ffffff]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#e8e6e5] pb-4">
            <div className="space-y-1">
              <h3 className="font-medium text-lg text-[#0c0a09] flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-[#3ba6f1]" />
                <span>Caspian SDK Unified Communication Layer</span>
              </h3>
              <p className="text-xs text-[#78716c]">
                One single handler model orchestrating Telegram, Email, Slack, and Discord.
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-[#c1e1f7] text-[#3398e1] font-medium">
                Caspian SDK 0.6.4 Connected
              </span>
            </div>
          </div>

          {/* Visual Architecture Diagram */}
          <div className="p-6 rounded-lg bg-[#fafaf9] border border-[#e8e6e5] space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center text-xs">
              <div className="stone-card p-3 font-medium text-[#0c0a09]">
                <Brain className="w-4 h-4 mx-auto text-[#0c0a09] mb-1" />
                Orbit Intelligence
              </div>
              <div className="flex items-center justify-center text-[#78716c] font-mono text-[10px]">
                &rarr; Approval &rarr;
              </div>
              <div className="stone-card p-3 font-medium text-[#3398e1] border-[#3ba6f1]">
                <Smartphone className="w-4 h-4 mx-auto text-[#3ba6f1] mb-1" />
                Telegram (@OrbitPDRBot)
              </div>
              <div className="flex items-center justify-center text-[#78716c] font-mono text-[10px]">
                &rarr; Caspian SDK &rarr;
              </div>
              <div className="stone-card p-3 font-medium text-[#0c0a09]">
                <Mail className="w-4 h-4 mx-auto text-[#0c0a09] mb-1" />
                Partner Email
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────────────
          FOOTER (Seline Editorial Footer)
         ───────────────────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#e8e6e5] bg-[#fafaf9] px-6 py-10 text-xs text-[#78716c]">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[#0c0a09] font-medium">
              <Flame className="w-4 h-4 text-[#3ba6f1]" />
              <span>Orbit AI PDR &bull; Caspian Buildathon</span>
            </div>
            <p className="text-[#78716c] text-[11px]">
              Autonomous AI employee for SaaS technology partnerships.
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="btn-cyan-primary text-xs inline-flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Open Partnership Workspace</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
