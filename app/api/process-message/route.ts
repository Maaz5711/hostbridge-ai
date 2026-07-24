import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
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
      channel: "SIMULATOR",
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

    // 2. Prepare property context
    const propertyContext = {
      property_name: property.property_name,
      wifi_name: property.wifi_name,
      wifi_password: property.wifi_password,
      checkin_instructions: property.checkin_instructions,
      checkout_time: property.checkout_time,
      parking_info: property.parking_info,
      house_rules: property.house_rules,
      nearby_restaurants: property.nearby_restaurants,
      lockbox_code: property.lockbox_code,
    };

    // 3. Gemini model
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-lite-latest",
    });

    // 4. AI system instructions
    const prompt = `
You are Airbot AI, an AI-powered guest communication assistant
for short-term rental properties.

Your job is to analyze a guest message and decide what Airbot AI
should do.

PROPERTY INFORMATION:
${JSON.stringify(propertyContext, null, 2)}

GUEST MESSAGE:
"${message}"

CLASSIFICATION RULES:

NORMAL:
Use NORMAL when the guest request can be safely answered using
the property information provided.

ESCALATE:
Use ESCALATE for:
- Emergencies
- Safety issues
- Security issues
- Lockouts
- Serious property damage
- Threats
- Dangerous situations
- Situations requiring human intervention
- Any situation where you are not confident enough to answer

INTENTS:
- INQUIRY
- RESERVATION
- AVAILABILITY
- CHECK_IN
- CHECKOUT
- WIFI
- PARKING
- MAINTENANCE
- LOCKOUT
- EMERGENCY
- UNKNOWN

PRIORITY:
- LOW
- MEDIUM
- HIGH
- URGENT

SENTIMENT:
- POSITIVE
- NEUTRAL
- NEGATIVE

CONFIDENCE:
Return a number between 0 and 1.

IMPORTANT:
If confidence is below 0.75, the route MUST be ESCALATE.

RESPONSE RULES:
- Only use information present in the property data.
- Never invent property information.
- Keep the response concise and helpful.
- If route is ESCALATE, do not attempt to solve the serious issue.
- Instead, tell the guest that the host/property manager has been alerted.

Return ONLY valid JSON.

The JSON must have exactly this structure:

{
  "route": "NORMAL or ESCALATE",
  "intent": "INQUIRY",
  "priority": "LOW",
  "sentiment": "NEUTRAL",
  "confidence": 0.95,
  "response": "Your response to the guest"
}
`;

    // 5. Call Gemini
    const result = await model.generateContent(prompt);

    const text = result.response.text();

    // 6. Clean possible markdown formatting
    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const aiResult = JSON.parse(cleanedText);

    // 7. Confidence-based escalation
    if (Number(aiResult.confidence) < 0.75) {
      aiResult.route = "ESCALATE";
      aiResult.priority = "HIGH";
      aiResult.response =
        "I'm sorry, but I've forwarded your request to the host or property manager so they can assist you directly.";
    }

    // 8. Generate conversation ID
    const conversationId = `demo_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    // 9. Determine status
    const status =
      aiResult.route === "ESCALATE"
        ? "ESCALATED"
        : "SENT";

    // 10. Save conversation to Supabase
    const { error: logError } = await supabase
      .from("conversation_logs")
      .insert({
        property_id: propertyId,
        guest_message: message,
        ai_reply: aiResult.response,
        route: aiResult.route,
        status: status,
        intent: aiResult.intent,
        priority: aiResult.priority,
        confidence: Number(aiResult.confidence),
        sentiment: aiResult.sentiment,
        channel: "INQUIRY",
        conversation_id: conversationId,
      });

    if (logError) {
      console.error(
        "Conversation log insert failed:",
        logError
      );
    }

    // 11. Return result to frontend
    return NextResponse.json({
      route: aiResult.route,
      intent: aiResult.intent,
      priority: aiResult.priority,
      sentiment: aiResult.sentiment,
      confidence: Number(aiResult.confidence),
      response: aiResult.response,
      propertyFound: true,
      conversationId,
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