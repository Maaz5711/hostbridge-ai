import { createClient } from "@supabase/supabase-js";
import Sidebar from "@/components/workspace/Sidebar";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function PropertiesPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const { propertyId } = await params;

  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("property_id", propertyId)
    .single();

  return (
    <div className="min-h-screen bg-[#05070a] text-white">

      {/* Sidebar */}
      <Sidebar
        propertyId={propertyId}
        propertyName={
          property?.property_name || "Demo Property"
        }
      />

      {/* Main Content */}
      <main className="ml-64 min-h-screen p-6 md:p-10">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-blue-400">
              Property Management
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              Property Information
            </h1>

            <p className="mt-2 max-w-2xl text-gray-400">
              View the property information currently used by
              Airbot AI when responding to guest messages.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
              <p className="font-medium text-red-400">
                Failed to load property information.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                {error.message}
              </p>
            </div>
          )}

          {/* Property Not Found */}
          {!error && !property && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-12 text-center">
              <p className="text-lg font-semibold text-red-400">
                Property not found
              </p>

              <p className="mt-2 text-sm text-gray-500">
                No property information was found for this
                workspace.
              </p>
            </div>
          )}

          {/* Property Information */}
          {property && (
            <div className="space-y-6">

              {/* Property Overview */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                <div className="flex flex-wrap items-start justify-between gap-6">

                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-600">
                      Property
                    </p>

                    <h2 className="mt-3 text-2xl font-semibold">
                      {property.property_name ||
                        "Unnamed Property"}
                    </h2>

                    <p className="mt-2 font-mono text-xs text-gray-600">
                      {property.property_id}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-2">
                    <span className="h-2 w-2 rounded-full bg-green-400" />

                    <span className="text-xs font-medium text-green-400">
                      AI AUTOMATION ACTIVE
                    </span>
                  </div>

                </div>

              </div>

              {/* Guest Access */}
              <div>
                <p className="mb-4 text-xs uppercase tracking-widest text-gray-500">
                  Guest Access
                </p>

                <div className="grid gap-4 md:grid-cols-2">

                  <PropertyCard
                    label="WiFi Network"
                    value={
                      property.wifi_name ||
                      "Not configured"
                    }
                  />

                  <PropertyCard
                    label="WiFi Password"
                    value={
                      property.wifi_password ||
                      "Not configured"
                    }
                  />

                  <PropertyCard
                    label="Check-in Instructions"
                    value={
                      property.checkin_instructions ||
                      "Not configured"
                    }
                  />

                  <PropertyCard
                    label="Checkout Time"
                    value={
                      property.checkout_time ||
                      "Not configured"
                    }
                  />

                  <PropertyCard
                    label="Lockbox Code"
                    value={
                      property.lockbox_code ||
                      "Not configured"
                    }
                  />

                  <PropertyCard
                    label="Parking Information"
                    value={
                      property.parking_info ||
                      "Not configured"
                    }
                  />

                </div>
              </div>

              {/* Property Rules */}
              <div>
                <p className="mb-4 text-xs uppercase tracking-widest text-gray-500">
                  Property Information
                </p>

                <div className="grid gap-4 md:grid-cols-2">

                  <LargePropertyCard
                    label="House Rules"
                    value={
                      property.house_rules ||
                      "No house rules configured."
                    }
                  />

                  <LargePropertyCard
                    label="Nearby Restaurants"
                    value={
                      property.nearby_restaurants ||
                      "No nearby restaurants configured."
                    }
                  />

                </div>
              </div>

              {/* AI Usage Notice */}
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/[0.03] p-6">

                <p className="text-xs uppercase tracking-widest text-blue-400">
                  AI Knowledge Base
                </p>

                <h3 className="mt-3 text-lg font-semibold">
                  This information powers Airbot AI
                </h3>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
                  Airbot AI uses the property information stored
                  in Supabase to answer guest questions. The AI
                  is instructed to only use verified property
                  information and avoid inventing details.
                </p>

              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}

function PropertyCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

      <p className="text-xs uppercase tracking-widest text-gray-600">
        {label}
      </p>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-300">
        {value}
      </p>

    </div>
  );
}

function LargePropertyCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-h-[180px] rounded-2xl border border-white/10 bg-white/[0.03] p-6">

      <p className="text-xs uppercase tracking-widest text-gray-600">
        {label}
      </p>

      <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-gray-400">
        {value}
      </p>

    </div>
  );
}