import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function SystemErrorsPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;

const { data: errors, error } = await supabase
  .from("conversation_logs")
  .select(
    "id, property_id, guest_message, ai_reply, route, intent, priority, confidence, sentiment, status, created_at"
  )
  .eq("route", "PROPERTY_NOT_FOUND")
  .order("created_at", { ascending: false });

  console.log("========== SYSTEM ERRORS ==========");
  console.log("Property ID:", propertyId);
  console.log("Errors:", errors);
  console.log("Query Error:", error);
  console.log("===================================");

  return (
    <div className="min-h-screen bg-[#05070a] p-6 text-white md:p-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-red-400">
            System Monitoring
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            System Errors
          </h1>

          <p className="mt-2 max-w-2xl text-gray-400">
            Property lookup and automation errors detected for this property.
          </p>
        </div>

        {/* Database Error */}
        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
            <p className="text-sm font-medium text-red-400">
              Failed to load system errors.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {error.message}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!error && (!errors || errors.length === 0) && (
          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-12 text-center">
            <p className="text-lg font-semibold text-green-400">
              System operating normally
            </p>

            <p className="mt-2 text-sm text-gray-500">
              No property lookup errors have been detected for this property.
            </p>
          </div>
        )}

        {/* Error List */}
        {errors && errors.length > 0 && (
          <div className="space-y-5">

            <div className="mb-6">
              <p className="text-sm text-gray-500">
                {errors.length} system error
                {errors.length !== 1 ? "s" : ""} detected
              </p>
            </div>

            {errors.map((errorItem) => (
              <div
                key={errorItem.id}
                className="rounded-2xl border border-red-500/20 bg-white/[0.03] p-6"
              >

                {/* Top */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">

                    <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                      SYSTEM ERROR
                    </span>

                    <span className="text-xs uppercase tracking-widest text-gray-500">
                      {errorItem.route}
                    </span>

                  </div>

                  <span className="text-xs text-gray-600">
                    {errorItem.created_at
                      ? new Date(errorItem.created_at).toLocaleString()
                      : ""}
                  </span>
                </div>

                {/* Property ID */}
                <div className="mt-6">
                  <p className="text-xs uppercase tracking-widest text-gray-600">
                    Requested Property ID
                  </p>

                  <p className="mt-2 break-all font-mono text-sm text-gray-400">
                    {errorItem.property_id || "Unknown"}
                  </p>
                </div>

                {/* Guest Message */}
                <div className="mt-6">
                  <p className="text-xs uppercase tracking-widest text-gray-600">
                    Triggering Message
                  </p>

                  <p className="mt-2 text-gray-200">
                    {errorItem.guest_message || "No message recorded."}
                  </p>
                </div>

                {/* System Response */}
                <div className="mt-6 border-t border-white/10 pt-6">
                  <p className="text-xs uppercase tracking-widest text-gray-600">
                    System Response
                  </p>

                  <p className="mt-2 leading-7 text-gray-400">
                    {errorItem.ai_reply || "No response recorded."}
                  </p>
                </div>

                {/* Metadata */}
                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-4">

                  <Info
                    label="Status"
                    value={errorItem.status || "—"}
                  />

                  <Info
                    label="Intent"
                    value={errorItem.intent || "—"}
                  />

                  <Info
                    label="Priority"
                    value={errorItem.priority || "—"}
                  />

                  <Info
                    label="Confidence"
                    value={
                      errorItem.confidence !== null
                        ? `${Math.round(
                            Number(errorItem.confidence) * 100
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