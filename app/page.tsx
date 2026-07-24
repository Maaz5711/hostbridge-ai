import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#05070a] text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-black font-bold">
              A
            </div>

            <span className="text-lg font-semibold tracking-tight">
              AIRBOT AI
            </span>
          </div>

          <div className="hidden items-center gap-8 text-sm text-gray-400 md:flex">
            <a href="#how-it-works" className="hover:text-white">
              How It Works
            </a>

            <a href="#features" className="hover:text-white">
              Features
            </a>

            <a href="#technology" className="hover:text-white">
              Technology
            </a>
          </div>

          <Link
            href="/demo"
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-gray-200"
          >
            Try Live Demo
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.08),transparent_40%)]" />

        <div className="mx-auto grid min-h-[700px] max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2">
          <div>
         <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">
  <span className="h-2 w-2 rounded-full bg-green-400" />
  Sits on top of Hospitable · Decision automation, not just messaging
</div>

            <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Your AI-powered
              <span className="block text-gray-400">
                guest communication
              </span>
              engine.
            </h1>

          <p className="mt-8 max-w-xl text-lg leading-8 text-gray-400">
  Property management platforms like Hospitable give you the inbox.
  Airbot AI reads every guest message, decides what it means, checks
  your calendar, and responds — before you've even opened the app.
</p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/demo"
                className="rounded-xl bg-white px-6 py-3 font-medium text-black transition hover:bg-gray-200"
              >
                Try Interactive Demo
              </Link>

              <Link
                href="/dashboard"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-medium transition hover:bg-white/10"
              >
                View Dashboard
              </Link>
            </div>
          </div>

          {/* Automation Visual */}
          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Automation Pipeline</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Real-time workflow monitoring
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-green-400">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  Operational
                </div>
              </div>

              <div className="space-y-3">
                {[
                  "Guest Message",
                  "Property Identified",
                  "Gemini AI Analysis",
                  "Smart Routing",
                  "Automated Action",
                  "Supabase Logging",
                ].map((step, index) => (
                  <div
                    key={step}
                    className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-xs">
                      {index + 1}
                    </div>

                    <span className="text-sm text-gray-300">{step}</span>

                    <span className="ml-auto text-xs text-green-400">
                      ✓
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-t border-white/10 py-24"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-widest text-gray-500">
              How It Works
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight">
              From guest message to automated action.
            </h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3 lg:grid-cols-6">
            {[
              "Guest Message",
              "AI Understanding",
              "Smart Routing",
              "Automated Action",
              "Guest / Host Response",
              "Supabase Logging",
            ].map((step, index) => (
              <div key={step} className="relative">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <span className="text-sm text-gray-600">
                    0{index + 1}
                  </span>

                  <h3 className="mt-8 text-sm font-medium">
                    {step}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-sm font-medium uppercase tracking-widest text-gray-500">
            Platform
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            Automation built for modern property operations.
          </h2>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "AI Guest Messaging",
                description:
                  "Automatically understand and respond to routine guest questions.",
              },
              {
                title: "Intelligent Escalation",
                description:
                  "Identify urgent or sensitive situations and route them to humans.",
              },
              {
                title: "Availability Checking",
                description:
                  "Check property calendars and provide availability responses automatically.",
              },
              {
                title: "Automated Responses",
                description:
                  "Generate contextual responses using property-specific information.",
              },
              {
                title: "Error Handling",
                description:
                  "Track failed property lookups, APIs, calendars, and automation errors.",
              },
              {
                title: "Conversation Analytics",
                description:
                  "Monitor conversations, AI decisions, response performance, and system health.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition hover:bg-white/[0.05]"
              >
                <h3 className="text-lg font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-4 text-sm leading-6 text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology */}
      <section id="technology" className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-gray-500">
            Technology
          </p>

          <h2 className="mt-4 text-4xl font-bold">
            Built with modern infrastructure.
          </h2>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {[
              "Next.js",
              "Supabase",
              "Google Gemini",
              "Make.com",
              "Hospitable API",
              "Vercel",
            ].map((technology) => (
              <div
                key={technology}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-4 text-sm text-gray-300"
              >
                {technology}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold sm:text-5xl">
            See the automation in action.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-gray-400">
            Simulate a guest interaction and watch Airbot AI classify,
            route, respond, and log the conversation.
          </p>

          <Link
            href="/demo"
            className="mt-10 inline-flex rounded-xl bg-white px-7 py-3 font-medium text-black transition hover:bg-gray-200"
          >
            Launch Interactive Demo
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 text-sm text-gray-500">
          <span>© 2026 Airbot AI</span>
          <span>AI Guest Automation Platform</span>
        </div>
      </footer>
    </main>
  );
}