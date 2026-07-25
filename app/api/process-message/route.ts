import { NextResponse } from "next/server";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);



export async function POST(request: Request) {
  try {
    const body = await request.json();

    const message = String(body.message || "").trim();
    const propertyId = String(body.propertyId || "").trim();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (!propertyId) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    // 1. Find property in Supabase
    const { data: property, error: propertyError } =
      await supabase
        .from("properties")
        .select("*")
        .eq("property_id", propertyId)
        .single();

  if (propertyError || !property) {
  console.error("Property not found:", propertyId);

  // Log the system error
  const { error: logError } = await supabase
    .from("conversation_logs")
    .insert({
      property_id:  propertyId,
      reservation_id: null,
      guest_name: "Unknown Guest",
      guest_message: message,
      ai_reply:
        "We could not identify the property associated with this request.",
      route: "PROPERTY_NOT_FOUND",
      response_time: null,
      status: "ERROR",
      intent: "UNKNOWN",
      priority: "MEDIUM",
      confidence: 1,
      sentiment: "NEUTRAL",
      channel: "AIRBNB",
      conversation_id: null,
    });

  if (logError) {
    console.error("System error log insert failed:", logError);
  }

  return NextResponse.json({
    route: "PROPERTY_NOT_FOUND",
    intent: "UNKNOWN",
    priority: "MEDIUM",
    sentiment: "NEUTRAL",
    confidence: 1,
    response:
      "We could not identify the property associated with this request.",
    propertyFound: false,
    error: {
      type: "PROPERTY_NOT_FOUND",
      message:
        "No property record was found for the provided property ID.",
    },
  });
}

  

  return NextResponse.json({
  propertyFound: true,
  propertyId: propertyId,
  propertyName: property.property_name,
});
  } catch (error) {
    console.error(
      "========== AIRBOT AI ERROR =========="
    );
    console.error(error);
    console.error(
      "====================================="
    );

    return NextResponse.json(
      {
        error: "Failed to process message",
        details:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}