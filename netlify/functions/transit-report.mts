import type { Context } from "@netlify/functions"

export default async (req: Request, context: Context) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const body = await req.text()
    const params = new URLSearchParams(body)

    const report = {
      cutId: params.get("cutId"),
      cutName: params.get("cutName"),
      transitTime: params.get("transitTime"),
      direction: params.get("direction"),
      currentStrength: params.get("currentStrength"),
      currentDirection: params.get("currentDirection"),
      slackObserved: params.get("slackObserved"),
      depth: params.get("depth"),
      windConditions: params.get("windConditions"),
      seaConditions: params.get("seaConditions"),
      notes: params.get("notes"),
      submittedAt: new Date().toISOString(),
    }

    // Log the report (visible in Netlify function logs)
    console.log("Transit Report Received:", JSON.stringify(report, null, 2))

    return new Response(JSON.stringify({ success: true, report }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
  } catch (err) {
    console.error("Error processing transit report:", err)
    return new Response(JSON.stringify({ error: "Failed to process report" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
