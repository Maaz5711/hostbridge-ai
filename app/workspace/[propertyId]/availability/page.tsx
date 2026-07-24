import { createClient } from "@supabase/supabase-js";
import Sidebar from "@/components/workspace/Sidebar";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AvailabilityPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;

  // Get property
  const { data: property, error: propertyError } =
    await supabase
      .from("properties")
      .select("property_name")
      .eq("property_id", propertyId)
      .single();

  // Get availability records
  const { data: availability, error: availabilityError } =
    await supabase
      .from("availability_logs")
      .select("*")
      .eq("property_id", propertyId)
      .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-[#05070a] text-white">

      {/* Sidebar */}
      <Sidebar
        propertyId={propertyId}
        propertyName={
          property?.property_name || "Demo Property"
        }
      />

      {/* Main */}
      <main className="ml-64 min-h-screen p-6 md:p-10">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-10">

            <p className="text-xs uppercase tracking-widest text-blue-400">
              Property Operations
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              Availability
            </h1>

            <p className="mt-2 max-w-2xl text-gray-400">
              Monitor property availability and recent
              availability checks performed by Airbot AI.
            </p>

          </div>

          {/* Database Error */}
          {availabilityError && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">

              <p className="font-medium text-red-400">
                Failed to load availability data.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                {availabilityError.message}
              </p>

            </div>
          )}

          {/* No Records */}
          {!availabilityError &&
            (!availability ||
              availability.length === 0) && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">

                <p className="text-lg font-semibold">
                  No availability checks yet
                </p>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500">
                  Airbot AI has not performed any availability
                  checks for this property yet.
                </p>

              </div>
            )}

          {/* Availability Records */}
          {availability &&
            availability.length > 0 && (
              <div className="space-y-5">

                {/* Count */}
                <div>
                  <p className="text-sm text-gray-500">
                    {availability.length} availability
                    {availability.length !== 1
                      ? " checks"
                      : " check"}{" "}
                    recorded
                  </p>
                </div>

                {availability.map((record) => (
                  <div
                    key={record.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                  >

                    {/* Top */}
                    <div className="flex flex-wrap items-center justify-between gap-4">

                      <div className="flex items-center gap-3">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            record.status === "AVAILABLE"
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {record.status || "UNKNOWN"}
                        </span>

                        <span className="text-xs uppercase tracking-widest text-gray-500">
                          Availability Check
                        </span>

                      </div>

                      <span className="text-xs text-gray-600">
                        {record.created_at
                          ? new Date(
                              record.created_at
                            ).toLocaleString()
                          : ""}
                      </span>

                    </div>

                    {/* Dates */}
                    <div className="mt-6 grid gap-6 sm:grid-cols-2">

                      <Info
                        label="Check-in"
                        value={
                          record.start_date || "—"
                        }
                      />

                      <Info
                        label="Check-out"
                        value={
                          record.end_date || "—"
                        }
                      />

                    </div>

                    {/* Property ID */}
                    <div className="mt-6 border-t border-white/10 pt-6">

                      <Info
                        label="Property ID"
                        value={
                          record.property_id || "—"
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