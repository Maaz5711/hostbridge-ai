import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function ConversationsPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;

  const { data: conversations, error } = await supabase
    .from("conversation_logs")
    .select(
      "id, guest_name, guest_message, ai_reply, route, intent, priority, confidence, sentiment, status, channel, created_at"
    )
    .eq("property_id", propertyId)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#05070a] p-6 text-white md:p-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-blue-400">
            Guest Communication
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            Conversations
          </h1>

          <p className="mt-2 max-w-2xl text-gray-400">
            View all guest conversations processed by HostBridge AI,
            including automated responses and escalations.
          </p>
        </div>

        {/* Database Error */}
        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
            <p className="font-medium text-red-400">
              Failed to load conversations.
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
                No conversations yet
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Guest conversations processed by HostBridge AI
                will appear here.
              </p>
            </div>
          )}

        {/* Conversations */}
        {conversations && conversations.length > 0 && (
          <div className="space-y-5">

            {/* Count */}
            <p className="text-sm text-gray-500">
              {conversations.length} conversation
              {conversations.length !== 1 ? "s" : ""} processed
            </p>

            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >

                {/* Top Row */}
                <div className="flex flex-wrap items-center justify-between gap-4">

                  <div className="flex flex-wrap items-center gap-3">

                    {/* Route */}
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        conversation.route === "ESCALATE"
                          ? "bg-orange-500/10 text-orange-400"
                          : conversation.route === "PROPERTY_NOT_FOUND"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-green-500/10 text-green-400"
                      }`}
                    >
                      {conversation.route}
                    </span>

                    {/* Status */}
                    <span className="text-xs uppercase tracking-widest text-gray-500">
                      {conversation.status || "—"}
                    </span>

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
                <div className="mt-6">
                  <p className="text-xs uppercase tracking-widest text-gray-600">
                    Guest Message
                  </p>

                  <p className="mt-2 text-lg text-gray-200">
                    {conversation.guest_message}
                  </p>
                </div>

                {/* AI Response */}
                <div className="mt-6 border-t border-white/10 pt-6">
                  <p className="text-xs uppercase tracking-widest text-gray-600">
                    HostBridge AI Response
                  </p>

                  <p className="mt-2 leading-7 text-gray-400">
                    {conversation.ai_reply ||
                      "No response recorded."}
                  </p>
                </div>

                {/* Metadata */}
                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-5">

                  <Info
                    label="Intent"
                    value={conversation.intent || "—"}
                  />

                  <Info
                    label="Priority"
                    value={conversation.priority || "—"}
                  />

                  <Info
                    label="Sentiment"
                    value={conversation.sentiment || "—"}
                  />

                  <Info
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

                  <Info
                    label="Channel"
                    value={conversation.channel || "—"}
                  />

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-gray-600">
        {label}
      </p>

      <p className="mt-2 text-sm text-gray-300">
        {value}
      </p>
    </div>
  );
}