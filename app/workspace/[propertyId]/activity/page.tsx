import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;

  const { data: activities, error } = await supabase
    .from("conversation_logs")
    .select(
      "id, guest_name, guest_message, ai_reply, route, intent, priority, confidence, sentiment, status, channel, conversation_id, created_at"
    )
    .eq("property_id", propertyId)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#05070a] p-6 text-white md:p-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-purple-400">
            Automation Monitoring
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            Automation Activity
          </h1>

          <p className="mt-2 max-w-2xl text-gray-400">
            A chronological record of how Airbot AI processes
            guest conversations and executes automation workflows.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
            <p className="font-medium text-red-400">
              Failed to load automation activity.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {error.message}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!error &&
          (!activities || activities.length === 0) && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
              <p className="text-lg font-semibold">
                No automation activity yet
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Activity will appear here when Airbot AI
                processes guest conversations.
              </p>
            </div>
          )}

        {/* Activity Timeline */}
        {activities && activities.length > 0 && (
          <div className="relative">

            {/* Timeline Line */}
            <div className="absolute left-[19px] top-0 hidden h-full w-px bg-white/10 md:block" />

            <div className="space-y-8">

              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="relative md:pl-14"
                >

                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-3 top-6 hidden h-3 w-3 rounded-full border-2 border-[#05070a] md:block ${
                      activity.route === "ESCALATE"
                        ? "bg-orange-400"
                        : activity.route ===
                            "PROPERTY_NOT_FOUND"
                          ? "bg-red-400"
                          : "bg-green-400"
                    }`}
                  />

                  {/* Activity Card */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                    {/* Top */}
                    <div className="flex flex-wrap items-center justify-between gap-4">

                      <div className="flex flex-wrap items-center gap-3">

                        <ActivityBadge
                          route={activity.route}
                        />

                        <span className="text-xs uppercase tracking-widest text-gray-600">
                          {activity.intent || "UNKNOWN"}
                        </span>

                        <span className="text-xs text-gray-600">
                          {activity.channel || "UNKNOWN"}
                        </span>

                      </div>

                      <span className="text-xs text-gray-600">
                        {activity.created_at
                          ? new Date(
                              activity.created_at
                            ).toLocaleString()
                          : ""}
                      </span>

                    </div>

                    {/* Guest Message */}
                    <div className="mt-6">

                      <p className="text-xs uppercase tracking-widest text-gray-600">
                        Guest Message
                      </p>

                      <p className="mt-2 text-gray-200">
                        {activity.guest_message ||
                          "No message recorded."}
                      </p>

                    </div>

                    {/* AI Action */}
                    <div className="mt-6 border-t border-white/10 pt-6">

                      <p className="text-xs uppercase tracking-widest text-gray-600">
                        Airbot AI Action
                      </p>

                      <p className="mt-2 leading-7 text-gray-400">
                        {activity.ai_reply ||
                          "No AI response recorded."}
                      </p>

                    </div>

                    {/* Automation Metadata */}
                    <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-4">

                      <Info
                        label="Route"
                        value={
                          activity.route || "—"
                        }
                      />

                      <Info
                        label="Status"
                        value={
                          activity.status || "—"
                        }
                      />

                      <Info
                        label="Priority"
                        value={
                          activity.priority || "—"
                        }
                      />

                      <Info
                        label="Confidence"
                        value={
                          activity.confidence !== null
                            ? `${Math.round(
                                Number(
                                  activity.confidence
                                ) * 100
                              )}%`
                            : "—"
                        }
                      />

                    </div>

                  </div>
                </div>
              ))}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function ActivityBadge({
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