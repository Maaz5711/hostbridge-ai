"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

type Result = {
  classification?: string;
  route?: string;
  intent: string;
  priority: string;
  sentiment: string;
  confidence: number;
  reply?: string;
  response?: string;
  propertyFound: boolean;
  conversationId?: string;
  error?: {
    type: string;
    message: string;
  };
};

export default function SimulatorPage() {
  const params = useParams();
  const propertyId = params.propertyId as string;

  const [message, setMessage] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  async function processMessage() {
    if (!message.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/process-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message.trim(),
          propertyId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to process message"
        );
      }

      setResult(data);

      // Save result for Inbox
      const existing = JSON.parse(
        localStorage.getItem("hostbridge_demo_inbox") || "[]"
      );

      existing.unshift({
        id: Date.now(),
        message,
        propertyId,
        ...data,
        createdAt: new Date().toISOString(),
      });

      localStorage.setItem(
        "hostbridge_demo_inbox",
        JSON.stringify(existing)
      );
    } catch (error) {
      console.error(error);

      setResult({
        route: "ERROR",
        intent: "UNKNOWN",
        priority: "HIGH",
        sentiment: "NEUTRAL",
        confidence: 0,
        response:
          error instanceof Error
            ? error.message
            : "Failed to process message",
        propertyFound: false,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#05070a] p-6 text-white md:p-10">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-500">
            AI Simulator
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            Test HostBridge AI
          </h1>

          <p className="mt-2 text-gray-400">
            Send a simulated guest message and watch HostBridge AI
            analyze and respond to it.
          </p>

          {/* Current Property */}
          <p className="mt-4 font-mono text-xs text-gray-600">
            Property ID: {propertyId}
          </p>
        </div>

        {/* Message Input */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

          <label className="text-xs uppercase tracking-widest text-gray-500">
            Guest Message
          </label>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Example: What is the WiFi password?"
            className="mt-4 min-h-[140px] w-full resize-none rounded-xl border border-white/10 bg-black/30 p-4 text-white outline-none placeholder:text-gray-600 focus:border-white/20"
          />

          <button
            onClick={processMessage}
            disabled={loading || !message.trim()}
            className="mt-4 rounded-xl bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "HostBridge AI Processing..."
              : "Process Guest Message"}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">

            <p className="text-xs uppercase tracking-widest text-gray-500">
              HostBridge AI Decision
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              Automation Complete
            </h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <ResultCard
                label="Route"
                value={
  result.route ||
  result.classification ||
  "UNKNOWN"
}
              />

              <ResultCard
                label="Intent"
                value={result.intent}
              />

              <ResultCard
                label="Priority"
                value={result.priority}
              />

              <ResultCard
                label="Sentiment"
                value={result.sentiment}
              />

            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-widest text-gray-500">
                AI Confidence
              </p>

              <p className="mt-2 text-2xl font-bold text-green-400">
                {Math.round(result.confidence * 100)}%
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-widest text-gray-500">
                AI Generated Response
              </p>

              <p className="mt-3 leading-7 text-gray-300">
                {result.reply ||
                  result.response ||
                  "No HostBridge AI response recorded."}
              </p>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}

function ResultCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-5">
      <p className="text-xs uppercase tracking-widest text-gray-500">
        {label}
      </p>

      <p className="mt-3 font-semibold">
        {value}
      </p>
    </div>
  );
}