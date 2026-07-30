"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function SetupPage() {
  const router = useRouter();

  const [propertyName, setPropertyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function createProperty() {
    if (!propertyName.trim()) {
      setError("Please enter a property name.");
      return;
    }

    setLoading(true);
    setError("");

    const propertyId = crypto.randomUUID();

    const { data, error } = await supabase
      .from("properties")
      .insert({
        property_id: propertyId,
        property_name: propertyName.trim(),
        wifi_name: "HostBridge_Guest",
        wifi_password: "DemoPassword123",
        checkin_instructions:
          "Check-in starts at 3:00 PM. Use the lockbox at the entrance.",
        checkout_time: "11:00 AM",
        parking_info:
          "Free parking is available in the driveway.",
        house_rules:
          "No smoking. No parties. Please respect quiet hours.",
        nearby_restaurants:
          "Several restaurants are available within a 10-minute drive.",
        lockbox_code: "1234",
        escalation_email: "demo@hostbridge.ai",
      })
      .select("property_id")
      .single();

    if (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(`/workspace/${data.property_id}`);
  }

  return (
    <main className="min-h-screen bg-[#05070a] text-white">
      <div className="mx-auto flex min-h-screen max-w-xl items-center px-6">
        <div className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-gray-500">
              HostBridge AI Demo
            </p>

            <h1 className="mt-3 text-3xl font-bold">
              Set up your property
            </h1>

            <p className="mt-3 text-gray-400">
              Create a demo property and experience how HostBridge AI
              handles guest communication automatically.
            </p>
          </div>

          <label className="text-sm text-gray-400">
            Property Name
          </label>

          <input
            value={propertyName}
            onChange={(e) => setPropertyName(e.target.value)}
            placeholder="e.g. Lahore Downtown Apartment"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-gray-600 focus:border-white/30"
          />

          {error && (
            <p className="mt-3 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            onClick={createProperty}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:bg-gray-200 disabled:opacity-50"
          >
            {loading ? "Creating Property..." : "Create Demo Property"}
          </button>
        </div>
      </div>
    </main>
  );
}