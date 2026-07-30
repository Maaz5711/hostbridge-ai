"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// ============================================
// LIVE PREVIEW (inline component, no separate file)
// ============================================

const SCENARIOS = [
  {
    guest: "What's the WiFi password?",
    intent: "WIFI",
    priority: "LOW",
    confidence: 99,
    response:
      "The WiFi network is Lahore_Guest and the password is StayComfy2026. Let me know if you need anything else!",
    route: "NORMAL",
  },
  {
    guest: "Is Aug 10–15 available?",
    intent: "AVAILABILITY",
    priority: "MEDIUM",
    confidence: 96,
    response:
      "Yes — those dates are open. Would you like me to help with the booking?",
    route: "NORMAL",
  },
  {
    guest: "There's a gas smell in the kitchen, I'm worried.",
    intent: "MAINTENANCE",
    priority: "URGENT",
    confidence: 91,
    response:
      "I've alerted the host immediately — they'll reach out to you within minutes.",
    route: "ESCALATE",
  },
];

const PHASE_DURATIONS = [400, 900, 1100, 700, 2600];

function LivePreview() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (phase < PHASE_DURATIONS.length) {
        setPhase((p) => p + 1);
      } else {
        setPhase(0);
        setScenarioIndex((i) => (i + 1) % SCENARIOS.length);
      }
    }, PHASE_DURATIONS[phase] ?? 400);

    return () => clearTimeout(timeout);
  }, [phase]);

  const s = SCENARIOS[scenarioIndex];
  const isEscalate = s.route === "ESCALATE";

  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_60px_-15px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
          </span>
          <span className="text-xs text-gray-500">Watching a live guest thread</span>
        </div>
        <span className="text-xs text-gray-600">Lahore Downtown Apartment</span>
      </div>

      <div
        className={`mt-6 transition-all duration-500 ${
          phase >= 1 ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <p className="text-[11px] uppercase tracking-widest text-gray-600">Guest</p>
        <div className="mt-2 inline-block max-w-[85%] rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-gray-200">
          {s.guest}
        </div>
      </div>

      <div
        className={`mt-5 flex flex-wrap gap-2 transition-all duration-500 ${
          phase >= 2 ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <PreviewBadge label="Intent" value={s.intent} />
        <PreviewBadge
          label="Priority"
          value={s.priority}
          tone={s.priority === "URGENT" ? "orange" : "default"}
        />
        <PreviewBadge label="Confidence" value={`${s.confidence}%`} />
        <PreviewBadge label="Route" value={s.route} tone={isEscalate ? "orange" : "green"} />
      </div>

      <div
        className={`mt-5 flex justify-end transition-all duration-500 ${
          phase >= 4 ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <div className="max-w-[85%] text-right">
          <p className="text-[11px] uppercase tracking-widest text-gray-600">
             HostBridge AI · replied in 1.4s
          </p>
          <div
            className={`mt-2 inline-block rounded-2xl rounded-tr-sm border px-4 py-2.5 text-left text-sm ${
              isEscalate
                ? "border-orange-500/20 bg-orange-500/[0.06] text-orange-100"
                : "border-green-500/20 bg-green-500/[0.06] text-green-50"
            }`}
          >
            {s.response}
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
  tone?: "default" | "green" | "orange";
}) {
  const toneClasses =
    tone === "green"
      ? "border-green-500/20 bg-green-500/5 text-green-400"
      : tone === "orange"
      ? "border-orange-500/20 bg-orange-500/5 text-orange-400"
      : "border-white/10 bg-white/[0.03] text-gray-300";

  return (
    <div className={`rounded-lg border px-3 py-1.5 text-xs ${toneClasses}`}>
      <span className="text-gray-500">{label} </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

// ============================================
// STEP CARD (inline component)
// ============================================

function StepCard({
  number,
  title,
  description,
  accent = false,
}: {
  number: string;
  title: string;
  description: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-6 ${
        accent ? "border-orange-500/20 bg-orange-500/[0.04]" : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <span className={`text-sm ${accent ? "text-orange-400" : "text-gray-600"}`}>{number}</span>
      <h3 className="mt-6 font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-gray-400">{description}</p>
    </div>
  );
}

// ============================================
// PAGE
// ============================================
// ============================================
// PIPELINE VISUALIZATION
// ============================================

type StageCategory = "trigger" | "data" | "ai" | "decision" | "action" | "log";

const CATEGORY_STYLES: Record<
  StageCategory,
  { dot: string; text: string; border: string; bg: string }
> = {
  trigger: {
    dot: "bg-blue-400",
    text: "text-blue-400",
    border: "border-blue-500/20",
    bg: "bg-blue-500/[0.05]",
  },
  data: {
    dot: "bg-purple-400",
    text: "text-purple-400",
    border: "border-purple-500/20",
    bg: "bg-purple-500/[0.05]",
  },
  ai: {
    dot: "bg-amber-400",
    text: "text-amber-400",
    border: "border-amber-500/20",
    bg: "bg-amber-500/[0.05]",
  },
  decision: {
    dot: "bg-orange-400",
    text: "text-orange-400",
    border: "border-orange-500/30",
    bg: "bg-orange-500/[0.08]",
  },
  action: {
    dot: "bg-cyan-400",
    text: "text-cyan-400",
    border: "border-cyan-500/20",
    bg: "bg-cyan-500/[0.05]",
  },
  log: {
    dot: "bg-gray-500",
    text: "text-gray-400",
    border: "border-white/10",
    bg: "bg-white/[0.02]",
  },
};

const PIPELINE_STAGES: {
  label: string;
  description: string;
  category: StageCategory;
  signature?: boolean;
}[] = [
  {
    label: "Guest message hits Hospitable",
    description: "A real guest sends a message through Airbnb's inbox.",
    category: "trigger",
  },
  {
    label: "Make.com webhook fires",
    description: "The event is caught the instant it happens — no polling, no delay.",
    category: "trigger",
  },
  {
    label: "Real property ID extracted",
    description: "The exact listing this message belongs to is identified from the payload.",
    category: "data",
  },
  {
    label: "Supabase property lookup",
    description: "That property's real WiFi, check-in, rules, and calendar context is pulled — never guessed.",
    category: "data",
  },
  {
    label: "Gemini reads message + context",
    description: "The model classifies intent, priority, sentiment — and rates its own confidence.",
    category: "ai",
  },
  {
    label: "NORMAL or ESCALATE",
    description:
  "The AI decision determines whether the message is handled automatically or routed for human intervention, with confidence, intent, priority, and sentiment captured for transparency.",
    category: "decision",
    signature: true,
  },
{
  label: "Route to the correct automation",
  description:
    "Normal messages are answered using property data, while availability requests are routed through the calendar workflow before a response is sent.",
  category: "action",
},
{
  label: "Every failure is caught",
  description: "A failed send doesn't vanish silently — it's logged and alerts the host directly.",
  category: "action",
},
  {
    label: "Supabase conversation log",
    description: "Message, decision, and outcome are recorded — a full audit trail, not a black box.",
    category: "log",
  },
  {
    label: "Visible in the  HostBridge Inbox",
    description: "The host can see exactly what was said, why, and how confident the system was.",
    category: "log",
  },
];

function PipelineViz() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStage((s) => (s + 1) % PIPELINE_STAGES.length);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-16 grid gap-12 lg:grid-cols-[auto_1fr]">
      {/* Legend */}
      <div className="flex gap-6 lg:hidden">
        {(["trigger", "data", "ai", "decision", "action", "log"] as StageCategory[]).map(
          (cat) => (
            <div key={cat} className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${CATEGORY_STYLES[cat].dot}`} />
              <span className="text-[10px] uppercase tracking-widest text-gray-600">
                {cat}
              </span>
            </div>
          )
        )}
      </div>

      <div className="relative">
        {/* connecting line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10" />

        <div className="space-y-3">
          {PIPELINE_STAGES.map((stage, i) => {
            const style = CATEGORY_STYLES[stage.category];
            const isActive = i === activeStage;

            return (
              <div key={stage.label} className="relative flex gap-5 pl-0">
                {/* node */}
                <div className="relative z-10 flex h-4 w-4 flex-shrink-0 items-center justify-center">
                  <span
                    className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${style.dot} ${
                      isActive ? "scale-[1.8] shadow-[0_0_12px_currentColor]" : "scale-100"
                    }`}
                    style={{ color: isActive ? undefined : "transparent" }}
                  />
                  {isActive && (
                    <span
                      className={`absolute h-4 w-4 animate-ping rounded-full ${style.dot} opacity-40`}
                    />
                  )}
                </div>

                {/* card */}
                <div
                  className={`flex-1 rounded-xl border p-4 transition-all duration-500 ${
                    isActive
                      ? `${style.border} ${style.bg}`
                      : "border-white/[0.06] bg-transparent"
                  } ${stage.signature ? "ring-1 ring-orange-500/20" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-medium uppercase tracking-widest ${
                        isActive ? style.text : "text-gray-600"
                      }`}
                    >
                      {stage.category}
                    </span>
                    {stage.signature && (
                      <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[10px] font-medium text-orange-400">
                        The critical step
                      </span>
                    )}
                  </div>
                  <p
                    className={`mt-1.5 text-sm font-medium transition-colors duration-500 ${
                      isActive ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {stage.label}
                  </p>
                  <p
                    className={`mt-1 text-xs leading-relaxed transition-colors duration-500 ${
                      isActive ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {stage.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#05070a] text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white font-bold text-black">
              A
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">HostBridge AI</p>
              <p className="text-xs text-gray-500">AI Guest Automation</p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-sm text-gray-400 md:flex">
            <a href="#how-it-works" className="hover:text-white">How It Works</a>
            <a href="#capabilities" className="hover:text-white">Capabilities</a>
            <a href="#positioning" className="hover:text-white">Why HostBridge AI</a>
          </div>

          <Link
            href="/setup"
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
          >
            Open Workspace
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.06),transparent_45%)]" />

        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-[1.1fr_1fr] lg:py-32">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-gray-300">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
             Works with Hospitable · The automation layer between your PMS and guest communication
            </div>

            <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl">
              Your PMS shows you the message.
              <span className="block text-gray-500">HostBridge AI already answered it.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400">
              HostBridge AI reads every guest message, understands what they need,
              checks your property details and calendar, and replies —
              automatically, in seconds, 24 hours a day. Urgent issues still
              reach you.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/setup"
                className="rounded-xl bg-white px-6 py-3 font-medium text-black transition hover:bg-gray-200"
              >
                Try Interactive Demo
              </Link>
              <Link
                href="/setup"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-medium transition hover:bg-white/10"
              >
                Open Dashboard
              </Link>
            </div>

            <p className="mt-4 text-xs text-gray-600">
              No signup required — runs on a live demo property.
            </p>
          </div>

          <LivePreview />
        </div>
      </section>

     {/* How it works — real pipeline */}
      <section id="how-it-works" className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-medium uppercase tracking-widest text-gray-500">
            The actual pipeline
          </p>
          <h2 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight">
            Not a prompt-and-reply wrapper. A decision pipeline with a
            safety net at every stage.
          </h2>
          <p className="mt-6 max-w-2xl text-gray-400">
         Ten stages form the automation pipeline — with messages
classified and routed through the appropriate workflow based
on what the guest needs.
          </p>

          <PipelineViz />
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-medium uppercase tracking-widest text-gray-500">
            Capabilities
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-tight">
            Built for what actually happens in a guest inbox.
          </h2>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Property-aware answers",
                description:
                  "Every reply pulls from that property's real WiFi, check-in, parking, and house rules — never generic.",
              },
              {
                title: "Confidence-gated escalation",
                description:
                  "If the AI isn't confident, it hands off to a human instead of guessing. Certainty, not keywords, decides.",
              },
              {
  title: "Availability checks",
  description:
    "Availability requests are routed through the automation workflow, checked against the property's real calendar, and logged in Supabase before the guest receives a response.",
},
              {
                title: "Full conversation logging",
                description:
                  "Every message, decision, and reply is recorded — nothing happens in a black box.",
              },
              {
                title: "Error handling that shows its work",
                description:
                  "Missing properties and failed sends are caught and logged, not silently dropped on the guest.",
              },
              {
                title: "Sentiment & priority aware",
                description:
                  "A frustrated guest and a curious one get read differently — priority reflects urgency, not just intent.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition hover:bg-white/[0.05]"
              >
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-4 text-sm leading-6 text-gray-400">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
{/* Positioning */}
      <section id="positioning" className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-medium uppercase tracking-widest text-gray-500">
            Isn't this what Hospitable's AI already does?
          </p>
          <h2 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight">
            Auto-replies are useful. But what happens when you need to know why the AI responded?
          </h2>
          <p className="mt-6 max-w-2xl text-gray-400">
         Hospitable and similar platforms provide the connection to
the guest inbox. HostBridge AI adds a transparent decision and
automation layer on top — classifying messages, routing them
through the right workflow, checking property and availability
data, and recording the outcome.
          </p>

          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2">
            <div className="bg-[#05070a] p-8">
              <p className="text-xs uppercase tracking-widest text-gray-600">
                A typical PMS "AI Auto Reply"
              </p>
              <ul className="mt-6 space-y-4 text-sm text-gray-400">
                <li>→ Replies or doesn't — you don't see why</li>
                <li>→ No visible confidence, intent, or priority</li>
                <li>→ Escalation rules are fixed by the vendor</li>
                <li>→ Data and logic stay locked inside their platform</li>
                <li>→ Switch PMS tools, lose everything you tuned</li>
              </ul>
            </div>
            <div className="bg-[#05070a] p-8">
              <p className="text-xs uppercase tracking-widest text-green-400">
                HostBridge AI
              </p>
              <ul className="mt-6 space-y-4 text-sm text-gray-200">
                <li>→ Every reply shows its intent, priority, and confidence</li>
                <li>→ Confidence-aware routing helps determine when human intervention is needed</li>
               
                <li>→ Full conversation history lives in your own database</li>
                <li>→ Designed as an automation layer that can integrate with PMS platforms</li>
                <li>→ The prompt, the rules, the data — all yours</li>
              </ul>
            </div>
          </div>

          <p className="mt-8 max-w-2xl text-sm text-gray-500">
             HostBridge AI uses a PMS like Hospitable to connect with Airbnb's
guest inbox, then adds an automation and decision layer on top.
It processes the incoming message, retrieves the right property
context, routes it through the appropriate workflow, and records
the outcome.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold sm:text-5xl">Watch it read a message right now.</h2>
          <p className="mx-auto mt-6 max-w-xl text-gray-400">
            No signup, no setup. Send a simulated guest message and watch
             HostBridge AI classify, route, respond, and log it in real time.
          </p>
          <Link
            href="/setup"
            className="mt-10 inline-flex rounded-xl bg-white px-7 py-3 font-medium text-black transition hover:bg-gray-200"
          >
            Launch Interactive Demo
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026  HostBridge AI — AI-powered guest communication automation</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300">GitHub</a>
            <a href="#" className="hover:text-gray-300">LinkedIn</a>
          </div>
        </div>
      </footer>
    </main>
  );
}