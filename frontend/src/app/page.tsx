"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Brain,
  CheckCircle2,
  ChevronDown,
  Flame,
  Layers,
  Mail,
  MessageSquare,
  Radio,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Zap,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const partners = ["Magic UI", "Resend", "Mintlify", "Senja", "Dub"];

const proofCards = [
  {
    quote:
      "Orbit gives us the exact reason a partnership makes sense before anything gets sent. It feels like having a calm operator beside the founder.",
    name: "Dhruvil Mistry",
    role: "Founder, Magic UI",
  },
  {
    quote:
      "The human approval step makes the automation feel trustworthy. We can move fast without losing the founder-to-founder tone.",
    name: "Avery Stone",
    role: "Partnerships Lead",
  },
];

const workflow = [
  {
    icon: Search,
    label: "Discover",
    title: "Find niche-aligned SaaS partners",
    body:
      "Orbit reads your website, identifies ICP overlap, and ranks companies by strategic fit instead of shallow firmographics.",
  },
  {
    icon: Brain,
    label: "Reason",
    title: "Generate evidence-backed fit cards",
    body:
      "Each recommendation explains why this company, why now, why this founder, and which collaboration angle should lead.",
  },
  {
    icon: MessageSquare,
    label: "Coordinate",
    title: "Route approval through Caspian",
    body:
      "Telegram approval, email dispatch, partner replies, and response drafts all stay in one observable communication loop.",
  },
];

const featureRows = [
  {
    title: "Transparent reasoning before outreach",
    body:
      "Orbit turns partner discovery into a structured review surface: market timing, ICP overlap, distribution upside, integration potential, and confidence are visible before a founder ever receives a message.",
    stats: ["7 signal matrix", "6 rationale prompts", "1 human approval"],
  },
  {
    title: "Caspian keeps every channel accountable",
    body:
      "Founder email, Telegram manager approvals, and inbound partner replies are treated as one deal lifecycle. The dashboard shows what happened, who approved it, and what should happen next.",
    stats: ["Telegram", "Email gateway", "Reply listener"],
  },
];

function OrbitMascot() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 160 150"
      className="mascot-sticker"
      fill="none"
    >
      <path d="M42 119c-9-18-7-45 6-66 13-20 34-31 55-23 20 8 30 30 29 52-1 24-13 45-34 54-21 8-46 4-56-17Z" />
      <path d="M55 84c8-16 18-24 33-24 15 0 26 9 32 25" />
      <path d="M67 89c5 10 14 15 25 15s20-5 26-15" />
      <path d="M73 77h.5M106 77h.5" strokeLinecap="round" />
      <path d="M61 49 43 32M113 45l19-15" />
      <path d="M38 121c21 14 60 18 88 1" />
    </svg>
  );
}

function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.25 }}
      className="floating-preview-card hero-preview"
    >
      <div className="preview-chrome">
        <div className="chrome-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span>orbit.ai/workspace</span>
        <strong>Live preview</strong>
      </div>

      <div className="dashboard-shell dashboard-muted-filter">
        <aside className="preview-sidebar">
          <div className="preview-logo">
            <Flame size={14} />
            Orbit
          </div>
          {["Discovery", "Reasoning", "Approvals", "Pipeline"].map((item, index) => (
            <div className={index === 1 ? "preview-nav active" : "preview-nav"} key={item}>
              {item}
            </div>
          ))}
        </aside>

        <div className="preview-main">
          <div className="preview-header">
            <div>
              <span className="eyebrow">AI reasoning card</span>
              <h3>Magic UI x Mintlify</h3>
            </div>
            <span className="score-pill">94 / 100</span>
          </div>

          <div className="metric-grid">
            {["ICP overlap", "API fit", "Timing", "Co-market"].map((metric, index) => (
              <div className="metric-card" key={metric}>
                <span>{metric}</span>
                <strong>{[93, 96, 92, 97][index]}</strong>
              </div>
            ))}
          </div>

          <div className="reasoning-panel">
            <div className="reasoning-line wide" />
            <div className="reasoning-line" />
            <div className="reasoning-line short" />
          </div>

          <div className="timeline-list">
            {[
              ["Telegram approval", "Pending"],
              ["Founder email", "Drafted"],
              ["Partner reply", "Listening"],
            ].map(([name, state]) => (
              <div className="timeline-row" key={name}>
                <span>{name}</span>
                <strong>{state}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tab-pill-group" aria-label="Preview tabs">
        {["Dashboard", "Partners", "Reasoning", "Pipeline"].map((tab, index) => (
          <span className={index === 0 ? "active" : ""} key={tab}>
            {tab}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <main className="site-shell">
      <nav className="top-nav">
        <Link href="/" className="brand-mark" aria-label="Orbit home">
          <span className="brand-glyph">
            <Flame size={15} />
          </span>
          <span>Orbit</span>
        </Link>

        <div className="nav-links">
          <a href="#workflow">Platform</a>
          <a href="#features">Resources</a>
          <a href="#proof">Proof</a>
          <a href="#faq">About us</a>
          <ChevronDown size={14} />
        </div>

        <div className="nav-actions">
          <Link href="/dashboard" className="nav-login">
            Sign in
          </Link>
          <Link href="/dashboard" className="btn-cyan-primary">
            Open workspace
          </Link>
        </div>
      </nav>

      <section className="hero-section">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.55 }}
          className="hero-copy"
        >
          <div className="avatar-proof" aria-label="Trusted by SaaS founders">
            <span>DM</span>
            <span>AS</span>
            <span>MK</span>
            <span>RL</span>
          </div>
          <h1>
            Autonomous partnership development, made{" "}
            <span className="highlight-span">simple & actionable</span>.
          </h1>
          <p>
            Orbit discovers strategic SaaS partners, explains the fit with transparent AI reasoning, and routes every outreach step through human approval before Caspian sends.
          </p>
          <div className="hero-actions">
            <Link href="/dashboard" className="btn-cyan-primary">
              Start with your SaaS
              <ArrowUpRight size={16} />
            </Link>
            <a href="#workflow" className="btn-ghost-secondary">
              View workflow
              <ArrowRight size={16} />
            </a>
          </div>
        </motion.div>

        <div className="partner-strip" aria-label="Example partner ecosystem">
          {partners.map((partner) => (
            <span key={partner}>{partner}</span>
          ))}
        </div>

        <div className="rating-line">
          <span aria-hidden="true">*****</span>
          <p>Founder-ready partnership intelligence, routed through Caspian.</p>
        </div>

        <DashboardPreview />
      </section>

      <section id="proof" className="testimonial-grid">
        {proofCards.map((card) => (
          <motion.article
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
            className="testimonial-card"
            key={card.name}
          >
            <div className="stars">*****</div>
            <p>&quot;{card.quote}&quot;</p>
            <div className="person-row">
              <span>{card.name.split(" ").map((name) => name[0]).join("")}</span>
              <div>
                <strong>{card.name}</strong>
                <small>{card.role}</small>
              </div>
            </div>
          </motion.article>
        ))}
      </section>

      <section id="workflow" className="section-stack">
        <div className="section-heading">
          <span className="eyebrow">
            <Layers size={16} />
            The workflow
          </span>
          <h2>
            Orbit thinks, Caspian communicates, the{" "}
            <span className="highlight-span">human controls</span>.
          </h2>
          <p>
            The product experience is intentionally narrow: discover the right companies, prove the strategic fit, and coordinate the message without hiding the decision from the founder.
          </p>
        </div>

        <div className="workflow-grid">
          {workflow.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="stone-card feature-card"
                key={item.title}
              >
                <div className="step-icon">
                  <Icon size={17} />
                  <span>{index + 1}</span>
                </div>
                <span className="eyebrow">{item.label}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section id="features" className="feature-showcase">
        <OrbitMascot />
        {featureRows.map((feature) => (
          <motion.article
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45 }}
            className="feature-row"
            key={feature.title}
          >
            <div>
              <h2>
                {feature.title.includes("reasoning") ? (
                  <>
                    Transparent <span className="highlight-span">reasoning</span> before outreach
                  </>
                ) : (
                  <>
                    Caspian keeps every <span className="highlight-span">channel</span> accountable
                  </>
                )}
              </h2>
              <p>{feature.body}</p>
            </div>
            <div className="mini-dashboard">
              {feature.stats.map((stat) => (
                <div key={stat}>
                  <CheckCircle2 size={16} />
                  <span>{stat}</span>
                </div>
              ))}
            </div>
          </motion.article>
        ))}
      </section>

      <section id="faq" className="quiet-grid">
        {[
          ["Privacy-first outreach", ShieldCheck],
          ["Caspian approval loop", Radio],
          ["Founder intelligence", UserCheck],
          ["Message drafting", Mail],
          ["Strategic signals", Sparkles],
          ["Deal lifecycle", Zap],
        ].map(([label, Icon]) => {
          const CardIcon = Icon as typeof ShieldCheck;
          return (
            <div className="quiet-item" key={label as string}>
              <CardIcon size={17} />
              <span>{label as string}</span>
            </div>
          );
        })}
      </section>

      <section className="final-cta">
        <h2>
          Build your partner pipeline with <span className="highlight-span">less noise</span>.
        </h2>
        <p>Start from a SaaS URL, review the reasoning, approve the message, and let Orbit keep the deal state visible.</p>
        <div className="hero-actions">
          <Link href="/dashboard" className="btn-cyan-primary">
            Open partnership workspace
            <ArrowUpRight size={16} />
          </Link>
          <a href="#workflow" className="btn-ghost-secondary">
            See the system
          </a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="brand-mark">
          <span className="brand-glyph">
            <Flame size={15} />
          </span>
          <span>Orbit AI PDR</span>
        </div>
        <span>Autonomous SaaS partnership development with human approval.</span>
      </footer>
    </main>
  );
}
