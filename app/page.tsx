"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// ============================================
// SHARED: reduced-motion awareness
// ============================================

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    setReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);

    mq.addEventListener("change", handler);

    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

// ============================================
// LIVE PREVIEW (hero)
// ============================================

const DEMO_SCENARIOS = [
  {
    guest: "What's the WiFi password?",
    intent: "WIFI",
    priority: "LOW",
    confidence: 99,
    route: "INQUIRY",
    action: "Answer from verified property data",
    response:
      "The WiFi network is Lahore_Guest and the password is StayComfy2026. Let me know if you need anything else!",
  },
  {
    guest: "Is Aug 10–15 available?",
    intent: "DATE_AVAILABILITY",
    priority: "LOW",
    confidence: 99,
    route: "AVAILABILITY",
    action: "Send through the calendar workflow",
    response:
      "Those dates are being checked against the property's booking calendar before a reply is sent.",
  },
  {
    guest: "There's a gas smell in the kitchen, I'm worried.",
    intent: "EMERGENCY",
    priority: "URGENT",
    confidence: 99,
    route: "ESCALATE",
    action: "Alert a human instead of guessing",
    response:
      "This issue has been escalated for immediate host attention.",
  },
];

const PHASE_DURATIONS = [500, 850, 900, 1050, 2800];

function LivePreview() {
  const reducedMotion = usePrefersReducedMotion();
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      setPhase(PHASE_DURATIONS.length - 1);
      return;
    }

    const timer = setTimeout(() => {
      if (phase < PHASE_DURATIONS.length - 1) {
        setPhase((p) => p + 1);
      } else {
        setPhase(0);
        setScenarioIndex((i) => (i + 1) % DEMO_SCENARIOS.length);
      }
    }, PHASE_DURATIONS[phase]);

    return () => clearTimeout(timer);
  }, [phase, reducedMotion]);

  const scenario = DEMO_SCENARIOS[scenarioIndex];

  const isEscalate = scenario.route === "ESCALATE";
  const isAvailability = scenario.route === "AVAILABILITY";

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0e13]/95 p-5 shadow-[0_30px_120px_-50px_rgba(0,0,0,0.95)] backdrop-blur-xl md:p-6">
      <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-emerald-400/[0.08] blur-[90px]" />
      <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-cyan-400/[0.06] blur-[90px]" />

      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>

          <span className="text-xs text-gray-400">
            Automation preview
          </span>
        </div>

        <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-gray-500">
          Simulated guest message
        </span>
      </div>

      <div
        className={`relative mt-7 transition-all duration-500 ${
          phase >= 0
            ? "translate-y-0 opacity-100"
            : "translate-y-2 opacity-0"
        }`}
      >
        <p className="text-[10px] uppercase tracking-[0.22em] text-gray-600">
          Guest message
        </p>

        <div className="mt-2 max-w-[90%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.045] px-4 py-3 text-sm leading-6 text-gray-200">
          {scenario.guest}
        </div>
      </div>

      <div
        className={`relative mt-6 grid grid-cols-2 gap-2 transition-all duration-500 sm:grid-cols-4 ${
          phase >= 1
            ? "translate-y-0 opacity-100"
            : "translate-y-2 opacity-0"
        }`}
      >
        <PreviewBadge label="Intent" value={scenario.intent} />

        <PreviewBadge
          label="Priority"
          value={scenario.priority}
          tone={isEscalate ? "orange" : "default"}
        />

        <PreviewBadge
          label="Confidence"
          value={`${scenario.confidence}%`}
        />

        <PreviewBadge
          label="Route"
          value={scenario.route}
          tone={
            isEscalate
              ? "orange"
              : isAvailability
              ? "blue"
              : "green"
          }
        />
      </div>

      <div
        className={`relative mt-5 rounded-2xl border border-white/10 bg-black/25 p-4 transition-all duration-500 ${
          phase >= 2
            ? "translate-y-0 opacity-100"
            : "translate-y-2 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.22em] text-gray-600">
            Decision
          </span>

          <span className="text-[10px] text-gray-600">
            HostBridge AI
          </span>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[10px] font-semibold text-white">
            AI
          </div>

          <div>
            <p className="text-sm font-medium text-white">
              {scenario.action}
            </p>

            <p className="mt-0.5 text-xs text-gray-500">
              The decision is visible before the workflow acts.
            </p>
          </div>
        </div>
      </div>

      <div
        className={`relative mt-5 flex justify-end transition-all duration-500 ${
          phase >= 3
            ? "translate-y-0 opacity-100"
            : "translate-y-2 opacity-0"
        }`}
      >
        <div className="max-w-[90%] text-right">
          <p className="text-[10px] uppercase tracking-[0.22em] text-gray-600">
            Workflow outcome
          </p>

          <div
            className={`mt-2 inline-block rounded-2xl rounded-tr-sm border px-4 py-3 text-left text-sm leading-6 ${
              isEscalate
                ? "border-orange-500/20 bg-orange-500/[0.06] text-orange-100"
                : isAvailability
                ? "border-cyan-500/20 bg-cyan-500/[0.06] text-cyan-50"
                : "border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-50"
            }`}
          >
            {scenario.response}
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewBadge({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "green" | "orange" | "blue";
}) {
  const toneClasses =
    tone === "green"
      ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
      : tone === "orange"
      ? "border-orange-500/20 bg-orange-500/5 text-orange-400"
      : tone === "blue"
      ? "border-cyan-500/20 bg-cyan-500/5 text-cyan-400"
      : "border-white/10 bg-white/[0.03] text-gray-300";

  return (
    <div
      className={`rounded-xl border px-3 py-2 text-[10px] ${toneClasses}`}
    >
      <span className="block text-gray-600">{label}</span>

      <span className="mt-0.5 block truncate font-medium">
        {value}
      </span>
    </div>
  );
}

// ============================================
// BRIDGE VISUALIZATION
// ============================================

const BRIDGE_STAGE_COUNT = 4;

function BridgeVisualization() {
  const reducedMotion = usePrefersReducedMotion();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      setStage(BRIDGE_STAGE_COUNT - 1);
      return;
    }

    const interval = setInterval(() => {
      setStage((s) => (s + 1) % BRIDGE_STAGE_COUNT);
    }, 1300);

    return () => clearInterval(interval);
  }, [reducedMotion]);

  return (
    <div className="relative mx-auto mt-14 max-w-4xl">
      <style>{`
        @keyframes flowDown {
          0% {
            transform: translateY(-6px);
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
          100% {
            transform: translateY(46px);
            opacity: 0;
          }
        }

        .flow-dot {
          animation: flowDown 1.3s linear infinite;
        }
      `}</style>

      <div className="grid grid-cols-2 gap-4 sm:gap-8">
        <BridgeNode
          active={stage >= 0}
          color="blue"
          label="Guest message"
          sub="Arrives through the channel"
        />

        <BridgeNode
          active={stage >= 0}
          color="purple"
          label="Property / PMS data"
          sub="Verified context for this listing"
        />
      </div>

      <div className="relative mx-auto h-14 w-px">
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-white/15 to-emerald-400/40" />

        {!reducedMotion && (
          <span className="flow-dot absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-emerald-400" />
        )}
      </div>

      <div className="mx-auto w-fit">
        <div
          className={`relative rounded-2xl border px-8 py-5 text-center transition-all duration-500 ${
            stage >= 1
              ? "border-emerald-400/40 bg-emerald-500/[0.08] shadow-[0_0_40px_-10px_rgba(52,211,153,0.4)]"
              : "border-white/10 bg-white/[0.03]"
          }`}
        >
          <p className="text-sm font-semibold tracking-tight text-white">
            HostBridge AI
          </p>

          <p className="mt-1 text-[11px] text-gray-500">
            Understands, then decides
          </p>
        </div>
      </div>

      <div className="relative mx-auto mt-0 h-14">
        <svg
          viewBox="0 0 300 56"
          className="mx-auto h-full w-full max-w-xs"
          preserveAspectRatio="none"
        >
          <path
            d="M150 0 L150 20 L40 20 L40 56"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />

          <path
            d="M150 0 L150 56"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />

          <path
            d="M150 0 L150 20 L260 20 L260 56"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-6">
        <BridgeNode
          active={stage >= 2}
          color="green"
          label="Inquiry"
          sub="Direct reply"
          compact
        />

        <BridgeNode
          active={stage >= 2}
          color="cyan"
          label="Availability"
          sub="Calendar checked"
          compact
        />

        <BridgeNode
          active={stage >= 3}
          color="orange"
          label="Escalate"
          sub="Host alerted"
          compact
        />
      </div>
    </div>
  );
}

function BridgeNode({
  active,
  color,
  label,
  sub,
  compact = false,
}: {
  active: boolean;
  color: "blue" | "purple" | "green" | "cyan" | "orange";
  label: string;
  sub: string;
  compact?: boolean;
}) {
  const colorMap: Record<
    string,
    { border: string; bg: string; text: string }
  > = {
    blue: {
      border: "border-cyan-400/30",
      bg: "bg-cyan-500/[0.06]",
      text: "text-cyan-300",
    },
    purple: {
      border: "border-purple-400/30",
      bg: "bg-purple-500/[0.06]",
      text: "text-purple-300",
    },
    green: {
      border: "border-emerald-400/30",
      bg: "bg-emerald-500/[0.06]",
      text: "text-emerald-300",
    },
    cyan: {
      border: "border-cyan-400/30",
      bg: "bg-cyan-500/[0.06]",
      text: "text-cyan-300",
    },
    orange: {
      border: "border-orange-400/30",
      bg: "bg-orange-500/[0.06]",
      text: "text-orange-300",
    },
  };

  const c = colorMap[color];

  return (
    <div
      className={`rounded-xl border text-center transition-all duration-500 ${
        compact ? "px-3 py-3" : "px-5 py-4"
      } ${
        active
          ? `${c.border} ${c.bg}`
          : "border-white/10 bg-white/[0.02]"
      }`}
    >
      <p
        className={`text-xs font-medium ${
          active ? c.text : "text-gray-400"
        }`}
      >
        {label}
      </p>

      <p className="mt-0.5 text-[10px] text-gray-600">{sub}</p>
    </div>
  );
}

// ============================================
// VALUE / COMPARISON POSITIONING
// ============================================

const VALUE_CARDS = [
  {
    title: "Transparent",
    text: "See why a message was classified, where it was routed, and what happened next.",
  },
  {
    title: "Property-aware",
    text: "Use verified information from the correct property instead of generic answers.",
  },
  {
    title: "Workflow-driven",
    text: "Availability, reservations, inquiries, and escalations can follow different paths.",
  },
  {
    title: "Designed for efficiency",
    text: "A lightweight automation layer is being built to reduce the cost of repetitive guest communication.",
  },
];

function ValuePositioning() {
  return (
    <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-gray-600">
          Why this product
        </p>

        <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          More control. A workflow you can actually see.
        </h2>

        <p className="mt-6 max-w-xl text-base leading-7 text-gray-400">
          Many property platforms already offer messaging automation.
          HostBridge AI is being developed as a configurable alternative
          focused on transparent decisions, property-aware workflows, and a
          lower-cost operating model.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {VALUE_CARDS.map((v) => (
          <div
            key={v.title}
            className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.045]"
          >
            <h3 className="text-lg font-semibold">{v.title}</h3>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              {v.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// DECISION PREVIEW
// ============================================

const DECISION_MESSAGE =
  "Is the apartment available from August 10 to August 15?";

const DECISION_FIELDS = [
  { label: "Intent", value: "DATE_AVAILABILITY" },
  { label: "Priority", value: "LOW" },
  { label: "Sentiment", value: "NEUTRAL" },
  { label: "Confidence", value: "99%" },
];

const DECISION_FLOW = [
  "Decision: AVAILABILITY",
  "Calendar workflow",
  "Availability result",
  "Guest response",
];

const DECISION_PHASES = 3;

function DecisionPreview() {
  const reducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      setPhase(DECISION_PHASES - 1);
      return;
    }

    const interval = setInterval(() => {
      setPhase((p) => (p + 1) % DECISION_PHASES);
    }, 1800);

    return () => clearInterval(interval);
  }, [reducedMotion]);

  return (
    <div className="mt-12 overflow-hidden rounded-[28px] border border-white/10 bg-[#080b10] p-5 md:p-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-gray-600">
            Decision preview
          </p>

          <p className="mt-2 text-sm text-gray-300">
            HostBridge doesn't just generate a reply — it makes an explicit,
            visible decision first.
          </p>
        </div>

        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-[10px] uppercase tracking-widest text-emerald-400">
          Traceable
        </span>
      </div>

      <div
        className={`mt-6 max-w-lg rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-200 transition-opacity duration-500 ${
          phase >= 0 ? "opacity-100" : "opacity-0"
        }`}
      >
        "{DECISION_MESSAGE}"
      </div>

      <div
        className={`mt-4 grid gap-3 transition-all duration-500 sm:grid-cols-4 ${
          phase >= 1
            ? "translate-y-0 opacity-100"
            : "translate-y-2 opacity-0"
        }`}
      >
        {DECISION_FIELDS.map((f) => (
          <div
            key={f.label}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
          >
            <p className="text-[9px] uppercase tracking-[0.18em] text-gray-600">
              {f.label}
            </p>

            <p className="mt-2 text-xs font-medium text-gray-200">
              {f.value}
            </p>
          </div>
        ))}
      </div>

      <div
        className={`mt-5 flex flex-wrap items-center gap-2 text-xs transition-all duration-500 ${
          phase >= 2
            ? "translate-y-0 opacity-100"
            : "translate-y-2 opacity-0"
        }`}
      >
        {DECISION_FLOW.map((step, i) => (
          <span key={step} className="flex items-center gap-2">
            <span
              className={`rounded-full border px-3 py-1.5 ${
                i === 0
                  ? "border-cyan-500/20 bg-cyan-500/[0.05] text-cyan-300"
                  : "border-white/10 bg-white/[0.02] text-gray-400"
              }`}
            >
              {step}
            </span>

            {i < DECISION_FLOW.length - 1 && (
              <span className="text-gray-700">→</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================================
// CAPABILITIES
// ============================================

const CAPABILITIES = [
  {
    title: "Property-aware replies",
    description:
      "Answers routine questions from that property's verified data — not generic AI knowledge.",
  },
  {
    title: "Availability automation",
    description:
      "Date questions are routed into the calendar workflow instead of being guessed.",
  },
  {
    title: "Reservation workflows",
    description:
      "Booking intent is identified and handed into the reservation path.",
  },
  {
    title: "Safety-first escalation",
    description:
      "Emergencies, lockouts, damage, and refunds are recognized and handed to a person.",
  },
  {
    title: "Conversation logging",
    description:
      "Every message, decision, and outcome is recorded — nothing is lost.",
  },
  {
    title: "Operational visibility",
    description:
      "See exactly what the automation decided and where a workflow failed.",
  },
];

function Capabilities() {
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const userHovering = useRef(false);

  useEffect(() => {
    if (reducedMotion) return;

    const interval = setInterval(() => {
      if (!userHovering.current) {
        setActive((a) => (a + 1) % CAPABILITIES.length);
      }
    }, 2600);

    return () => clearInterval(interval);
  }, [reducedMotion]);

  return (
    <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
      <div className="space-y-2">
        {CAPABILITIES.map((cap, i) => (
          <button
            key={cap.title}
            onMouseEnter={() => {
              userHovering.current = true;
              setActive(i);
            }}
            onMouseLeave={() => {
              userHovering.current = false;
            }}
            onFocus={() => setActive(i)}
            className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all duration-300 ${
              active === i
                ? "border-emerald-400/25 bg-emerald-500/[0.05]"
                : "border-white/10 bg-white/[0.015] hover:bg-white/[0.03]"
            }`}
          >
            <span
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border text-xs font-semibold ${
                active === i
                  ? "border-emerald-400/30 text-emerald-300"
                  : "border-white/10 text-gray-500"
              }`}
            >
              0{i + 1}
            </span>

            <span
              className={`text-sm font-medium ${
                active === i ? "text-white" : "text-gray-400"
              }`}
            >
              {cap.title}
            </span>
          </button>
        ))}
      </div>

      <div className="rounded-[28px] border border-white/10 bg-[#080b10] p-8 lg:sticky lg:top-24">
        <span className="text-[10px] uppercase tracking-[0.22em] text-gray-600">
          Capability detail
        </span>

        <h3 className="mt-4 text-2xl font-semibold text-white">
          {CAPABILITIES[active].title}
        </h3>

        <p className="mt-4 text-sm leading-7 text-gray-400">
          {CAPABILITIES[active].description}
        </p>
      </div>
    </div>
  );
}

// ============================================
// PRODUCT VISION
// ============================================

const VISION_STEPS = [
  "Connect a property management platform or channel",
  "Connect properties",
  "Configure rules and property data",
  "Activate automated workflows",
  "Monitor conversations and outcomes",
];

function ProductVision() {
  return (
    <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-gray-600">
          The product vision
        </p>

        <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          The dashboard is where the automation becomes usable.
        </h2>

        <p className="mt-6 max-w-xl text-base leading-7 text-gray-400">
          The current demo shows the decision engine and workflow. The
          product is being developed toward a SaaS where property managers
          can connect their property-management platform, bring their
          properties into the workspace, and run these automations without
          rebuilding the system themselves.
        </p>

        <div className="mt-8 space-y-3 text-sm text-gray-300">
          {VISION_STEPS.map((item) => (
            <div key={item} className="flex items-center gap-3">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[9px] text-emerald-400">
                ✓
              </span>

              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative rounded-[28px] border border-white/10 bg-[#080b10] p-4 shadow-[0_30px_100px_-55px_rgba(0,0,0,0.95)] md:p-5">
        <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative rounded-2xl border border-white/10 bg-[#06080b] p-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-sm font-semibold">HostBridge Workspace</p>

              <p className="mt-1 text-xs text-gray-600">
                Property operations
              </p>
            </div>

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] text-gray-500">
              Automation active
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              "12 Conversations",
              "3 Availability checks",
              "1 Escalation",
            ].map((value) => (
              <div
                key={value}
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-center"
              >
                <p className="text-xs font-medium text-gray-200">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-gray-600">
                  Latest decision
                </p>

                <p className="mt-2 text-sm font-medium text-white">
                  DATE_AVAILABILITY
                </p>
              </div>

              <span className="rounded-full border border-cyan-500/20 bg-cyan-500/5 px-2.5 py-1 text-[10px] text-cyan-400">
                AVAILABILITY
              </span>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
              <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" />
            </div>

            <p className="mt-2 text-right text-[10px] text-gray-600">
              92% workflow confidence
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-[9px] uppercase tracking-[0.18em] text-gray-600">
                Data
              </p>

              <p className="mt-2 text-xs text-gray-300">
                Supabase activity log
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-[9px] uppercase tracking-[0.18em] text-gray-600">
                Routing
              </p>

              <p className="mt-2 text-xs text-gray-300">
                Make automation workflow
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ROADMAP + INTEGRATIONS
// ============================================

const ROADMAP_STEPS = ["Connect", "Configure", "Activate", "Monitor"];

function Roadmap() {
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      setActive(ROADMAP_STEPS.length - 1);
      return;
    }

    const interval = setInterval(() => {
      setActive((a) => (a + 1) % ROADMAP_STEPS.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [reducedMotion]);

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-widest text-gray-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Currently in development
        </span>

        <h3 className="mt-5 text-2xl font-semibold text-white">
          Connect your stack, keep the decisions visible
        </h3>

        <p className="mt-4 text-sm leading-7 text-gray-400">
          The demo shows the automation engine today. The product is being
          built toward letting property managers connect their own
          property-management platform and properties without rebuilding any
          of this.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {ROADMAP_STEPS.map((step, i) => (
            <span key={step} className="flex items-center gap-2">
              <span
                className={`rounded-full border px-4 py-2 text-xs font-medium transition-all duration-500 ${
                  active === i
                    ? "border-emerald-400/30 bg-emerald-500/[0.08] text-emerald-300"
                    : "border-white/10 bg-white/[0.02] text-gray-500"
                }`}
              >
                {step}
              </span>

              {i < ROADMAP_STEPS.length - 1 && (
                <span className="text-gray-700">→</span>
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] border border-white/10 bg-[#080b10] p-8">
        <p className="text-[10px] uppercase tracking-[0.22em] text-gray-600">
          Integration roadmap
        </p>

        <p className="mt-2 text-xs text-gray-600">
          Coming as HostBridge AI expands
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {["Airbnb", "Booking.com", "Vrbo", "Hospitable"].map((name) => (
            <span
              key={name}
              className="rounded-xl border border-white/10 bg-white/[0.025] px-4 py-2.5 text-xs font-medium text-gray-300"
            >
              {name}
            </span>
          ))}
        </div>

        <div className="mx-auto mt-6 h-8 w-px bg-gradient-to-b from-white/15 to-emerald-400/40" />

        <div className="mx-auto w-fit rounded-2xl border border-emerald-400/30 bg-emerald-500/[0.06] px-6 py-3 text-center">
          <p className="text-sm font-semibold text-white">
            HostBridge AI
          </p>

          <p className="mt-1 text-[10px] text-gray-500">
            Automation engine
          </p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PAGE
// ============================================

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05070a] text-white">
      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#05070a]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-bold text-black">
              H
            </div>

            <div>
              <p className="text-sm font-semibold tracking-tight">
                HostBridge AI
              </p>

              <p className="text-[11px] text-gray-500">
                The automation layer for guest communication
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-7 text-sm text-gray-400 md:flex">
            <a
              href="#how-it-works"
              className="transition hover:text-white"
            >
              How it works
            </a>

            <a
              href="#capabilities"
              className="transition hover:text-white"
            >
              Capabilities
            </a>

            <a
              href="#product"
              className="transition hover:text-white"
            >
              Product
            </a>

            <a
              href="#roadmap"
              className="transition hover:text-white"
            >
              Roadmap
            </a>
          </div>

          <Link
            href="/setup"
            className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-white/[0.08]"
          >
            Open Workspace
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute left-[15%] top-[-5rem] -z-10 h-[32rem] w-[32rem] rounded-full bg-emerald-400/[0.07] blur-[120px]" />

        <div className="absolute right-[-5rem] top-[8rem] -z-10 h-[28rem] w-[28rem] rounded-full bg-cyan-400/[0.05] blur-[110px]" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 pb-20 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3.5 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-gray-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              AI automation for property operations
            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-semibold tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              Your property platform receives the message.
              <span className="block bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
                HostBridge AI decides what happens next.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-400 sm:text-xl">
              HostBridge AI is the automation layer between your property
              management platform and guest communication. It reads the
              message, understands the request, uses the right property data,
              and sends it into the workflow that should handle it.
            </p>

            <div className="mt-8 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.035] p-5 text-sm leading-6 text-gray-300">
              <span className="font-medium text-emerald-400">
                The difference:
              </span>{" "}
              many PMS auto-reply tools simply send a response or stay silent.
              HostBridge AI makes the decision visible by capturing
              confidence, intent, priority, and sentiment — then routes
              situations that require human intervention into the appropriate
              escalation workflow.
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/setup"
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
              >
                See the Interactive Demo
              </Link>

              <a
                href="#how-it-works"
                className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-medium text-gray-200 transition hover:bg-white/[0.07]"
              >
                See How It Works
              </a>
            </div>

            <p className="mt-4 text-xs text-gray-600">
              The demo simulates the guest message so you can see the
              automation before connecting a live channel.
            </p>
          </div>

          <LivePreview />
        </div>
      </section>

      {/* WHAT HOSTBRIDGE ACTUALLY DOES */}
      <section className="border-y border-white/10 bg-white/[0.012] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-gray-600">
              What HostBridge actually does
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              It bridges a message, property data, and the right action.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-gray-500">
              The channel delivers the message. Your property platform
              provides operational context. HostBridge AI turns that into an
              explicit, auditable decision — then routes it.
            </p>
          </div>

          <BridgeVisualization />
        </div>
      </section>

      {/* VALUE / COMPARISON POSITIONING */}
      <section className="border-b border-white/10 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <ValuePositioning />
        </div>
      </section>

      {/* HOW IT WORKS + DECISION PREVIEW */}
      <section
        id="how-it-works"
        className="border-b border-white/10 py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-gray-600">
              The automation
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              One message. One decision. One accountable outcome.
            </h2>

            <p className="mt-6 text-base leading-7 text-gray-400">
              HostBridge separates understanding from action so the system
              can make decisions, route work, and keep a record of what
              happened.
            </p>
          </div>

          <DecisionPreview />
        </div>
      </section>

      {/* CAPABILITIES */}
      <section
        id="capabilities"
        className="border-b border-white/10 py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-gray-600">
              Capabilities
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Built around the problems hosts actually face.
            </h2>
          </div>

          <Capabilities />
        </div>
      </section>

      {/* PRODUCT VISION */}
      <section
        id="product"
        className="border-b border-white/10 py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          <ProductVision />
        </div>
      </section>

      {/* ROADMAP */}
      <section
        id="roadmap"
        className="border-b border-white/10 py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          <Roadmap />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute left-1/2 top-1/2 -z-10 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/[0.05] blur-[120px]" />

        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            The demo shows the automation. The product will make it yours.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-400">
            The interactive demo shows how a connected guest message would
            be processed by HostBridge AI.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/setup"
              className="rounded-xl bg-white px-7 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
            >
              See the Interactive Demo
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span>© 2026 HostBridge AI</span>

            <span className="ml-3 text-gray-700">
              AI automation for modern property operations
            </span>
          </div>

          <div className="flex gap-5">
            <a
              href="#"
              className="transition hover:text-gray-300"
            >
              GitHub
            </a>

            <a
              href="#"
              className="transition hover:text-gray-300"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}