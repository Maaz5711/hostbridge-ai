import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function EscalationsPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;

  const { data: escalations, error } = await supabase
    .from("conversation_logs")
    .select(
      "id, guest_message, ai_reply, route, intent, priority, confidence, sentiment, status, created_at"
    )
    .eq("property_id", propertyId)
    .eq("route", "ESCALATE")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#05070a] p-6 text-white md:p-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-orange-400">
            Human Intervention Required
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            Escalations
          </h1>

          <p className="mt-2 max-w-2xl text-gray-400">
            Guest conversations that Airbot AI identified as
            requiring human attention.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
            <p className="text-sm text-red-400">
              Failed to load escalations.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {error.message}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!error &&
          (!escalations || escalations.length === 0) && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
              <p className="text-lg font-semibold">
                No escalations
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Airbot AI has not identified any conversations
                requiring human intervention.
              </p>
            </div>
          )}

        {/* Escalation List */}
        {escalations && escalations.length > 0 && (
          <div className="space-y-5">
            {escalations.map((conversation) => (
              <div
                key={conversation.id}
                className="rounded-2xl border border-orange-500/20 bg-white/[0.03] p-6"
              >
                {/* Top */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-400">
                      ESCALATED
                    </span>

                    <span className="text-xs uppercase tracking-widest text-gray-500">
                      {conversation.priority || "HIGH"} PRIORITY
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
                    Airbot AI Action
                  </p>

                  <p className="mt-2 leading-7 text-gray-400">
                    {conversation.ai_reply}
                  </p>
                </div>

                {/* Metadata */}
                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-4">
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
                            Number(conversation.confidence) * 100
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