import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type Classification = "NORMAL" | "ESCALATE";
type IntentType = "INQUIRY" | "RESERVATION" | "AVAILABILITY";
type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
type Sentiment = "POSITIVE" | "NEUTRAL" | "NEGATIVE";
type Route = "NORMAL" | "ESCALATE" | "AVAILABILITY";

function normalizeClassification(value: unknown): Classification {
  return value === "ESCALATE" ? "ESCALATE" : "NORMAL";
}

function normalizeIntentType(value: unknown): IntentType {
  if (value === "RESERVATION") return "RESERVATION";
  if (value === "AVAILABILITY") return "AVAILABILITY";
  return "INQUIRY";
}

function normalizePriority(value: unknown): Priority {
  if (value === "URGENT") return "URGENT";
  if (value === "HIGH") return "HIGH";
  if (value === "MEDIUM") return "MEDIUM";
  return "LOW";
}

function normalizeSentiment(value: unknown): Sentiment {
  if (value === "POSITIVE") return "POSITIVE";
  if (value === "NEGATIVE") return "NEGATIVE";
  return "NEUTRAL";
}

function normalizeDate(value: unknown): string {
  if (typeof value !== "string") return "";
  const date = value.trim();

  if (!date) return "";

  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : "";
}

function deriveRoute(
  classification: Classification,
  intentType: IntentType
): Route {
  if (classification === "ESCALATE") return "ESCALATE";
  if (intentType === "AVAILABILITY") return "AVAILABILITY";
  return "NORMAL";
}

export async function POST(request: Request) {
  try {
    // --------------------------------------------------
    // 1. Read incoming request
    // --------------------------------------------------

    const body = await request.json();

    const message = String(body.message || "").trim();
    const propertyId = String(body.propertyId || body.property_id || "").trim();

    const guestName = String(
      body.guestName || body.guest_name || "Guest"
    ).trim();

    const conversationId = body.conversationId || body.conversation_id
      ? String(body.conversationId || body.conversation_id)
      : null;

    const reservationId = body.reservationId || body.reservation_id
      ? String(body.reservationId || body.reservation_id)
      : null;

    const channel = String(body.channel || "AIRBNB").trim();

    // --------------------------------------------------
    // 2. Validate required fields
    // --------------------------------------------------

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

    // --------------------------------------------------
    // 3. Find property in Supabase
    // --------------------------------------------------

    const { data: property, error: propertyError } = await supabase
      .from("properties")
      .select("*")
      .eq("property_id", propertyId)
      .single();

    // --------------------------------------------------
    // 4. Property not found
    // --------------------------------------------------

    if (propertyError || !property) {
      console.error("Property not found:", propertyId, propertyError);

      const systemResponse =
        "We could not identify the property associated with this request.";

      const { error: logError } = await supabase
        .from("conversation_logs")
        .insert({
          property_id: propertyId,
          reservation_id: reservationId,
          guest_name: guestName,
          guest_message: message,
          ai_reply: systemResponse,
          route: "PROPERTY_NOT_FOUND",
          response_time: null,
          status: "ERROR",
          intent: "UNKNOWN",
          priority: "MEDIUM",
          confidence: 1,
          sentiment: "NEUTRAL",
          channel,
          conversation_id: conversationId,
        });

      if (logError) {
        console.error("System error log insert failed:", logError);
      }

      return NextResponse.json({
        propertyFound: false,
        propertyId,
        propertyName: null,
        route: "PROPERTY_NOT_FOUND",
        classification: "ESCALATE",
        intentType: "INQUIRY",
        intent: "UNKNOWN",
        priority: "MEDIUM",
        sentiment: "NEUTRAL",
        confidence: 1,
        check_in_date: "",
        check_out_date: "",
        reply: systemResponse,
        response: systemResponse,
        conversationId,
        reservationId,
        error: {
          type: "PROPERTY_NOT_FOUND",
          message: "No property record was found for the provided property ID.",
        },
      });
    }

    // --------------------------------------------------
    // 5. Build property knowledge for AI
    // --------------------------------------------------

    const propertyKnowledge = `
PROPERTY INFORMATION

Property Name:
${property.property_name || "Not provided"}

WiFi Network:
${property.wifi_name || "Not provided"}

WiFi Password:
${property.wifi_password || "Not provided"}

Check-in Instructions:
${property.checkin_instructions || "Not provided"}

Checkout Time:
${property.checkout_time || "Not provided"}

Parking Information:
${property.parking_info || "Not provided"}

House Rules:
${property.house_rules || "Not provided"}

Nearby Restaurants:
${property.nearby_restaurants || "Not provided"}

Lockbox Code:
${property.lockbox_code || "Not provided"}
`;

    // --------------------------------------------------
    // 6. AI system prompt
    // --------------------------------------------------

    const systemPrompt = `
You are Airbot AI, an AI guest communication assistant for an Airbnb or short-term rental property.

Your job is to:
1. Understand the guest's message.
2. Determine the specific intent.
3. Determine whether the request can be safely handled automatically.
4. Determine priority and sentiment.
5. Determine intent_type for downstream routing.
6. Extract dates when relevant.
7. Generate a concise guest-facing response when appropriate.

PROPERTY CONTEXT RULE:

The property information below belongs ONLY to the property identified here.
Use only this information.
Never invent property information.
Never use information from another property.
Never assume missing information.

CLASSIFICATION:

Use NORMAL when the request can be safely handled by the existing automation workflow.

Use ESCALATE when the request genuinely requires human intervention or cannot be safely handled automatically.

NORMAL includes:
- Routine property questions.
- Inquiry questions.
- Reservation or booking requests.
- Availability requests.
- Requests that can be processed by downstream automation.

ESCALATE includes:
- Safety concerns.
- Medical emergencies.
- Security issues.
- Current active lockouts.
- Property damage.
- Flooding.
- Fire.
- Gas leaks.
- Broken essential utilities.
- Serious maintenance problems.
- Serious noise complaints.
- Legal issues.
- Refund demands.
- Threats.
- Dangerous situations.
- Angry guests requesting a manager or host.
- Any situation requiring human judgment that cannot be handled by an existing workflow.

IMPORTANT:
Do NOT escalate a reservation or availability request merely because a downstream workflow must process it.

INTENT_TYPE:

Use exactly one:
- INQUIRY
- RESERVATION
- AVAILABILITY

INQUIRY:
Routine guest questions such as:
- WiFi
- Check-in
- Checkout
- Parking
- House rules
- Restaurants
- Property information
- Access instructions
- General guest questions
- Routine maintenance questions

RESERVATION:
Use when the guest wants to make, request, confirm, or receive assistance with a reservation or booking.
Examples:
- I want to book this property.
- Can I reserve this apartment?
- I'd like to make a reservation.
- Can you help me with my booking?

AVAILABILITY:
Use when the guest asks whether the property is available for specific dates or asks about booking availability.
Examples:
- Is it available from August 10 to August 15?
- Is the apartment free next weekend?
- Do you have availability for these dates?

Do NOT determine actual availability from the property information.
The downstream Availability workflow checks the actual booking calendar.
Do NOT claim that the property is available or unavailable.
For availability requests, reply MUST be an empty string.

INTENT:

The intent field is the specific topic or situation, not the routing field.
Use concise values such as:
INQUIRY, CHECK_IN, CHECKOUT, WIFI, PARKING, HOUSE_RULES, RESTAURANTS, PROPERTY_INFO, MAINTENANCE, LOCKOUT, EMERGENCY, PROPERTY_DAMAGE, REFUND_REQUEST, SECURITY, LEGAL, BOOKING_REQUEST, RESERVATION_ASSISTANCE, DATE_AVAILABILITY, UNKNOWN.

Examples:
WiFi question → intent_type INQUIRY, intent WIFI
Booking request → intent_type RESERVATION, intent BOOKING_REQUEST
Date availability → intent_type AVAILABILITY, intent DATE_AVAILABILITY
Current lockout → classification ESCALATE, intent_type INQUIRY, intent LOCKOUT

CHECK-IN:
Questions asking how access works are normal INQUIRY / CHECK_IN questions.
Examples:
- How do I access the property?
- How do I get in?
- Where is the lockbox?

These are NOT lockouts.

Only use LOCKOUT when the guest reports a current active problem entering:
- I can't get in.
- I'm locked out.
- The code isn't working.
- The door won't open.
- The key doesn't fit.

Current lockout:
classification = ESCALATE
intent_type = INQUIRY
intent = LOCKOUT
priority = URGENT

EARLY/LATE CHECK-IN:
Do not approve or deny unless the property information explicitly allows or prohibits it.
Do not invent policy.
If human confirmation is required, use ESCALATE with intent_type INQUIRY and intent CHECK_IN.

MULTIPLE QUESTIONS:
Identify the primary intent_type.
Answer all routine questions that can be answered from the property information.
If any part genuinely requires human intervention, use ESCALATE.

PRIORITY:
Use exactly one:
- LOW
- MEDIUM
- HIGH
- URGENT

LOW:
Routine questions, WiFi, parking, house rules, check-in/out, availability, reservation requests, compliments.

MEDIUM:
Non-urgent issues requiring host attention or minor maintenance.

HIGH:
Significant maintenance problems, serious complaints, serious issues affecting the stay.

URGENT:
Current lockouts, safety/security issues, fire, flooding, gas leaks, medical emergencies, dangerous situations, immediate threats.

SENTIMENT:
Use exactly one:
- POSITIVE
- NEUTRAL
- NEGATIVE

CONFIDENCE:
Return a number from 0 to 1 representing confidence in classification, intent_type, intent, and workflow selection.

DATE EXTRACTION:
When relevant, return check_in_date and check_out_date in YYYY-MM-DD format.

For availability requests:
- Extract both dates when available.
- If only one date is given, leave the other empty.
- If dates cannot be reliably determined, leave them empty.
- reply MUST be "".

Do not invent dates.

RESPONSE RULES:

If NORMAL:
- Use only verified property information.
- Never invent information.
- Keep the response concise and professional.
- Do not expose internal fields.
- For AVAILABILITY, reply MUST be "".
- For RESERVATION, do not claim that a reservation was successfully created unless a downstream workflow actually completed the booking.

If ESCALATE:
- Provide a short holding response.
- Do not invent that a person, team, or host was contacted unless the workflow actually performed that action.
- The workflow will alert the host.

STANDARD ESCALATION RESPONSE:
"I'm sorry to hear about the issue. I've alerted the host, and they will assist you shortly."

URGENT ESCALATION RESPONSE:
Acknowledge the urgency and state that the issue has been escalated for immediate attention, without inventing actions that did not happen.

Return ONLY valid JSON. No markdown. No code fences. No explanation.

Return exactly:
{
  "classification": "NORMAL",
  "intent_type": "INQUIRY",
  "intent": "WIFI",
  "priority": "LOW",
  "sentiment": "NEUTRAL",
  "confidence": 0.95,
  "check_in_date": "",
  "check_out_date": "",
  "reply": ""
}

${propertyKnowledge}

Guest Message:
${message}
`;

    // --------------------------------------------------
    // 7. Call Gemini
    // --------------------------------------------------

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-lite-latest",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const startTime = Date.now();

    const aiResult = await model.generateContent(systemPrompt);

    const responseText = aiResult.response.text().trim();

    const responseTime = Date.now() - startTime;

    // --------------------------------------------------
    // 8. Parse Gemini JSON
    // --------------------------------------------------

    const cleanedResponse = responseText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    type AIResult = {
      classification?: unknown;
      intent_type?: unknown;
      intent?: unknown;
      priority?: unknown;
      sentiment?: unknown;
      confidence?: unknown;
      check_in_date?: unknown;
      check_out_date?: unknown;
      reply?: unknown;
    };

    let aiData: AIResult;

    try {
      aiData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", responseText, parseError);

      return NextResponse.json(
        {
          error: "AI returned an invalid response format.",
          details: responseText,
        },
        { status: 500 }
      );
    }

    // --------------------------------------------------
    // 9. Normalize AI result and derive route
    // --------------------------------------------------

    const classification = normalizeClassification(aiData.classification);
    const intentType = normalizeIntentType(aiData.intent_type);

    const intent =
      typeof aiData.intent === "string" && aiData.intent.trim()
        ? aiData.intent.trim()
        : "UNKNOWN";

    const priority = normalizePriority(aiData.priority);
    const sentiment = normalizeSentiment(aiData.sentiment);

    const confidence = Math.max(
      0,
      Math.min(1, Number(aiData.confidence) || 0)
    );

    const checkInDate = normalizeDate(aiData.check_in_date);
    const checkOutDate = normalizeDate(aiData.check_out_date);

    // Availability must never send an automatic guest reply here.
    const reply =
      intentType === "AVAILABILITY"
        ? ""
        : typeof aiData.reply === "string" && aiData.reply.trim()
        ? aiData.reply.trim()
        : classification === "ESCALATE"
        ? "I'm sorry to hear about the issue. I've alerted the host, and they will assist you shortly."
        : "Thank you for your message. We will assist you shortly.";

    const route = deriveRoute(classification, intentType);

    // --------------------------------------------------
    // 10. Save conversation to Supabase
    // --------------------------------------------------

    const { data: conversation, error: conversationError } = await supabase
      .from("conversation_logs")
      .insert({
        property_id: propertyId,
        reservation_id: reservationId,
        guest_name: guestName,
        guest_message: message,
        ai_reply: reply,
        route,
        response_time: responseTime,
        status:
          route === "ESCALATE" ? "ESCALATED" : "RESOLVED",
        intent,
        priority,
        confidence,
        sentiment,
        channel,
        conversation_id: conversationId,
      })
      .select("id, conversation_id")
      .single();

    if (conversationError) {
      console.error("Conversation log insert failed:", conversationError);
    }

    // --------------------------------------------------
    // 11. Send result to Make and wait for final response
    // --------------------------------------------------

    let makeResult: Record<string, unknown> | null = null;

    try {
      const makeResponse = await fetch(
        "https://hook.us2.make.com/nyxp2ras38wrc79drt4ff637w98npmyh",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            property_id: propertyId,
            conversation_id:
              conversationId || conversation?.conversation_id || null,
            reservation_id: reservationId,
            guest_name: guestName,
            guest_message: message,
            classification,
            intent_type: intentType,
            route,
            intent,
            priority,
            sentiment,
            confidence,
            check_in_date: checkInDate,
            check_out_date: checkOutDate,
            ai_reply: reply,
            reply,
            property_name: property.property_name,
          }),
        }
      );

      const makeText = await makeResponse.text();

      if (!makeResponse.ok) {
        console.error(
          "Make webhook returned non-2xx:",
          makeResponse.status,
          makeText
        );
      } else if (makeText.trim()) {
        try {
          makeResult = JSON.parse(makeText) as Record<string, unknown>;
        } catch {
          makeResult = { reply: makeText };
        }
      }
    } catch (err) {
      console.error("Failed to call Make webhook:", err);
    }

    // --------------------------------------------------
    // 12. Return final result to Simulator
    // --------------------------------------------------

    const finalReply =
      typeof makeResult?.reply === "string"
        ? makeResult.reply
        : typeof makeResult?.response === "string"
        ? makeResult.response
        : typeof makeResult?.ai_reply === "string"
        ? makeResult.ai_reply
        : reply;

    return NextResponse.json({
      propertyFound: true,
      propertyId,
      propertyName: property.property_name,
      classification:
        typeof makeResult?.classification === "string"
          ? makeResult.classification
          : classification,
      intent_type:
        typeof makeResult?.intent_type === "string"
          ? makeResult.intent_type
          : intentType,
      route:
        typeof makeResult?.route === "string"
          ? makeResult.route
          : route,
      intent:
        typeof makeResult?.intent === "string"
          ? makeResult.intent
          : intent,
      priority:
        typeof makeResult?.priority === "string"
          ? makeResult.priority
          : priority,
      sentiment:
        typeof makeResult?.sentiment === "string"
          ? makeResult.sentiment
          : sentiment,
      confidence:
        typeof makeResult?.confidence === "number"
          ? makeResult.confidence
          : confidence,
      check_in_date:
        typeof makeResult?.check_in_date === "string"
          ? makeResult.check_in_date
          : checkInDate,
      check_out_date:
        typeof makeResult?.check_out_date === "string"
          ? makeResult.check_out_date
          : checkOutDate,
      reply: finalReply,
      response: finalReply,
      available:
        typeof makeResult?.available === "boolean"
          ? makeResult.available
          : undefined,
      conversationId:
        conversationId || conversation?.conversation_id || null,
      reservationId,
      conversationLogId: conversation?.id || null,
      responseTime,
      status:
        route === "ESCALATE" ? "ESCALATED" : "RESOLVED",
    });
    // --------------------------------------------------

    return NextResponse.json({
      propertyFound: true,
      propertyId,
      propertyName: property.property_name,

      classification,
      intent_type: intentType,
      route,
      intent,
      priority,
      sentiment,
      confidence,

      check_in_date: checkInDate,
      check_out_date: checkOutDate,

      reply,
      response: reply,

      conversationId:
        conversationId || conversation?.conversation_id || null,
      reservationId,

      conversationLogId: conversation?.id || null,

      responseTime,

      status:
        route === "ESCALATE" ? "ESCALATED" : "RESOLVED",
    });
  } catch (error) {
    console.error("========== AIRBOT AI ERROR ==========");
    console.error(error);
    console.error("=====================================");

    return NextResponse.json(
      {
        error: "Failed to process message",
        details:
          error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
