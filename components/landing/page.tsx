import Link from "next/link";

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
              <p className="text-sm font-semibold tracking-tight">
                AIRBOT AI
              </p>

              <p className="text-xs text-gray-500">
                AI Guest Automation
              </p>
            </div>
          </Link>

          <Link
            href="/setup"
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
          >
            Open Workspace
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-6 py-20">
        <div className="max-w-4xl">
          <p className="text-sm uppercase tracking-[0.25em] text-gray-500">
            AI Guest Communication Automation
          </p>

          <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Automate guest communication.
            <span className="block text-gray-500">
              Keep control of every interaction.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
            Airbot AI analyzes guest messages, understands intent,
            automatically responds to routine requests, checks
            availability, escalates important issues, and logs every
            interaction in one centralized workspace.
          </p>

          {/* CTA Buttons */}
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

          {/* Automation Flow */}
          <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              number="01"
              title="Guest Message"
              description="A guest sends a question or request."
            />

            <FeatureCard
              number="02"
              title="AI Understanding"
              description="Gemini analyzes the message and identifies the intent."
            />

            <FeatureCard
              number="03"
              title="Smart Routing"
              description="Airbot AI sends the request to the correct automation workflow."
            />

            <FeatureCard
              number="04"
              title="Automated Action"
              description="The guest receives a response and the interaction is logged."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <span className="text-sm text-gray-600">
        {number}
      </span>

      <h3 className="mt-6 font-semibold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-gray-400">
        {description}
      </p>
    </div>
  );
}