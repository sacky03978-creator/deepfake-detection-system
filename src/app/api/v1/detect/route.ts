import { NextRequest, NextResponse } from "next/server";

// Lightweight proxy to the video-ingestion-service. Performs no processing.
// Accepts multipart/form-data (preferred) or JSON and forwards as-is.
// Configure ingestion service URL via env INGESTION_SERVICE_URL (defaults to http://video-ingestion-service:9000)

const INGESTION_URL = process.env.INGESTION_SERVICE_URL || "http://video-ingestion-service:9000";

export async function POST(request: NextRequest) {
  try {
    const url = `${INGESTION_URL}/api/v1/detect`;

    // Forward key auth headers only
    const headers = new Headers();
    const contentType = request.headers.get("content-type") || "";
    if (contentType) headers.set("content-type", contentType);

    const apiKey = request.headers.get("x-api-key");
    if (apiKey) headers.set("x-api-key", apiKey);

    const auth = request.headers.get("authorization");
    if (auth) headers.set("authorization", auth);

    const reqId = request.headers.get("x-request-id");
    if (reqId) headers.set("x-request-id", reqId);

    const res = await fetch(url, {
      method: "POST",
      headers,
      // Stream the body directly to the ingestion service without buffering
      body: request.body,
      // Avoid Next.js fetch caching
      cache: "no-store",
      // Increase timeout budgets handled by the upstream service
      // Note: Next.js fetch doesn't support timeout option; upstream must respond quickly (<1s)
    });

    const contentTypeResp = res.headers.get("content-type") || "application/json";
    const text = await res.text();

    return new NextResponse(text, {
      status: res.status,
      headers: {
        "content-type": contentTypeResp,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "ingestion_service_unavailable", message: (err as Error).message },
      { status: 502 }
    );
  }
}