import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;

  // Get property
  const { data: property } = await supabase
    .from("properties")
    .select("property_name")
    .eq("property_id", propertyId)
    .single();

  // Get conversations
  const { data: conversations } = await supabase
    .from("conversation_logs")
    .select(
      "id, route, status, intent, priority, confidence, created_at"
    )
    .eq("property_id", propertyId);

  const totalMessages = conversations?.length || 0;

  const aiResolved =
    conversations?.filter(
      (conversation) =>
        conversation.route === "NORMAL"
    ).length || 0;

  const escalations =
    conversations?.filter(
      (conversation) =>
        conversation.route === "ESCALATE"
    ).length || 0;

  const systemErrors =
    conversations?.filter(
      (conversation) =>
        conversation.route === "PROPERTY_NOT_FOUND"
    ).length || 0;

  return (
    <div className="min-h-screen bg-[#05070a] text-white">

      {/* Main Content */}
    <main className="min-h-screen p-6 md:p-10">

        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-10">

            <p className="text-xs uppercase tracking-widest text-gray-500">
              Property Workspace
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              {property?.property_name ||
                "Your Property"}
            </h1>

            <p className="mt-2 text-gray-400">
              Monitor and manage your AI-powered guest
              communication.
            </p>

          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <StatCard
              label="Messages Handled"
              value={String(totalMessages)}
            />

            <StatCard
              label="AI Resolved"
              value={String(aiResolved)}
            />

            <StatCard
              label="Escalations"
              value={String(escalations)}
            />

            <StatCard
              label="System Errors"
              value={String(systemErrors)}
            />

          </div>

          {/* Automation Status */}
          <div className="mt-8 rounded-2xl border border-green-500/20 bg-green-500/[0.03] p-6">

            <div className="flex flex-wrap items-center justify-between gap-4">

              <div>

                <p className="text-xs uppercase tracking-widest text-green-400">
                  Automation Status
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Airbot AI is operating normally
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Guest messages are being analyzed,
                  classified, routed, and logged.
                </p>

              </div>

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-green-400" />

                <span className="text-sm text-green-400">
                  Online
                </span>

              </div>

            </div>

          </div>

          {/* Main Automation Card */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8">

            <p className="text-xs uppercase tracking-widest text-gray-500">
              Airbot AI Automation
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              Your AI guest communication layer
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-gray-400">
              Simulate a guest conversation and watch
              Airbot AI understand the request, classify
              the intent, select the correct automation
              route, generate a response, and log the
              interaction.
            </p>

            <a
              href={`/workspace/${propertyId}/simulator`}
              className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-gray-200"
            >
              Open AI Simulator
            </a>

          </div>

          {/* Automation Flow */}
          <div className="mt-8">

            <p className="text-xs uppercase tracking-widest text-gray-500">
              Automation Flow
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <FlowCard
                number="01"
                title="Guest Message"
                description="Guest sends a question or request."
              />

              <FlowCard
                number="02"
                title="AI Understanding"
                description="Gemini analyzes the message and identifies intent."
              />

              <FlowCard
                number="03"
                title="Smart Routing"
                description="Airbot AI selects the correct automation route."
              />

              <FlowCard
                number="04"
                title="Automated Action"
                description="Response is generated and the interaction is logged."
              />

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

      <p className="text-xs uppercase tracking-widest text-gray-500">
        {label}
      </p>

      <p className="mt-4 text-3xl font-bold">
        {value}
      </p>

    </div>
  );
}

function FlowCard({
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