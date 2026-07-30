import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function InboxPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;

 

  // Fetch conversations
  const { data: conversations, error } = await supabase
    .from("conversation_logs")
    .select(
      "id, guest_name, guest_message, ai_reply, route, intent, priority, confidence, sentiment, status, channel, conversation_id, created_at"
    )
    .eq("property_id", propertyId)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#05070a] text-white">
      <main className="p-6 md:p-10">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-blue-400">
              Guest Communication
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              AI Inbox
            </h1>

            <p className="mt-2 max-w-2xl text-gray-400">
              Monitor guest conversations and see how Airbot AI
              is handling each request.
            </p>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">

            <InboxStat
              label="Total Conversations"
              value={String(conversations?.length || 0)}
            />

            <InboxStat
              label="AI Resolved"
              value={String(
                conversations?.filter(
                  (conversation) =>
                    conversation.route === "NORMAL"
                ).length || 0
              )}
            />

            <InboxStat
              label="Needs Attention"
              value={String(
                conversations?.filter(
                  (conversation) =>
                    conversation.route === "ESCALATE"
                ).length || 0
              )}
            />

          </div>

          {/* Database Error */}
          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
              <p className="font-medium text-red-400">
                Failed to load inbox.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                {error.message}
              </p>
            </div>
          )}

          {/* Empty State */}
          {!error &&
            (!conversations || conversations.length === 0) && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
                <p className="text-lg font-semibold">
                  Inbox is empty
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  Guest conversations processed by Airbot AI
                  will appear here.
                </p>
              </div>
            )}

          {/* Conversation List */}
          {conversations && conversations.length > 0 && (
            <div className="space-y-4">

              <p className="mb-4 text-sm text-gray-500">
                {conversations.length} conversation
                {conversations.length !== 1 ? "s" : ""}
              </p>

              {conversations.map((conversation) => (

                <div
                  key={conversation.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20"
                >

                  {/* Top Row */}
                  <div className="flex flex-wrap items-start justify-between gap-4">

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <span className="font-semibold">
                          {conversation.guest_name ||
                            "Guest"}
                        </span>

                        <StatusBadge
                          route={conversation.route}
                        />

                        <span className="text-xs uppercase tracking-widest text-gray-600">
                          {conversation.status ||
                            "UNKNOWN"}
                        </span>

                      </div>

                      <p className="mt-1 text-xs text-gray-600">
                        {conversation.channel ||
                          "Unknown Channel"}
                      </p>

                    </div>

                    <span className="text-xs text-gray-600">
                      {conversation.created_at
                        ? new Date(
                            conversation.created_at
                          ).toLocaleString()
                        : ""}
                    </span>

                  </div>

                  {/* Guest Message */}
                  <div className="mt-6 rounded-xl border border-white/5 bg-black/20 p-4">

                    <p className="text-xs uppercase tracking-widest text-gray-600">
                      Guest
                    </p>

                    <p className="mt-2 text-gray-200">
                      {conversation.guest_message}
                    </p>

                  </div>

                  {/* AI Response */}
                  <div className="mt-3 rounded-xl border border-blue-500/10 bg-blue-500/[0.03] p-4">

                    <div className="flex items-center justify-between">

                      <p className="text-xs uppercase tracking-widest text-blue-400">
                        Airbot AI
                      </p>

                      {conversation.route ===
                        "NORMAL" && (
                        <span className="text-xs text-green-400">
                          AI Resolved
                        </span>
                      )}

                      {conversation.route ===
                        "ESCALATE" && (
                        <span className="text-xs text-orange-400">
                          Human Attention
                        </span>
                      )}

                    </div>

                    <p className="mt-2 leading-7 text-gray-400">
                      {conversation.ai_reply ||
                        "No AI response recorded."}
                    </p>

                  </div>

                  {/* Metadata */}
                  <div className="mt-5 flex flex-wrap gap-2">

                    <MetadataBadge
                      label="Intent"
                      value={
                        conversation.intent ||
                        "UNKNOWN"
                      }
                    />

                    <MetadataBadge
                      label="Priority"
                      value={
                        conversation.priority ||
                        "—"
                      }
                    />

                    <MetadataBadge
                      label="Sentiment"
                      value={
                        conversation.sentiment ||
                        "—"
                      }
                    />

                    <MetadataBadge
                      label="Confidence"
                      value={
                        conversation.confidence !== null
                          ? `${Math.round(
                              Number(
                                conversation.confidence
                              ) * 100
                            )}%`
                          : "—"
                      }
                    />

                  </div>

                </div>

              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

function StatusBadge({
  route,
}: {
  route: string | null;
}) {
  if (route === "ESCALATE") {
    return (
      <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-400">
        ESCALATED
      </span>
    );
  }

  if (route === "PROPERTY_NOT_FOUND") {
    return (
      <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
        SYSTEM ERROR
      </span>
    );
  }

  return (
    <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
      AI HANDLED
    </span>
  );
}

function MetadataBadge({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
      <span className="text-xs text-gray-600">
        {label}
      </span>

      <span className="ml-2 text-xs text-gray-300">
        {value}
      </span>
    </div>
  );
}

function InboxStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs uppercase tracking-widest text-gray-600">
        {label}
      </p>

      <p className="mt-3 text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}