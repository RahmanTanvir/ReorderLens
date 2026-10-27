import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getBackendBaseUrl(): string {
  const boundUrl = process.env.BACKEND_URL?.trim();
  if (boundUrl) {
    return boundUrl.endsWith("/") ? boundUrl : `${boundUrl}/`;
  }
  return "http://127.0.0.1:8000/";
}

async function proxyToBackend(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
): Promise<Response> {
  const { path } = await context.params;
  const relativePath = path.join("/");
  const targetUrl = new URL(relativePath, getBackendBaseUrl());
  targetUrl.search = request.nextUrl.search;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("content-type", contentType);
  }
  const accept = request.headers.get("accept");
  if (accept) {
    headers.set("accept", accept);
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  try {
    const upstream = await fetch(targetUrl, init);
    const responseHeaders = new Headers();
    const upstreamContentType = upstream.headers.get("content-type");
    if (upstreamContentType) {
      responseHeaders.set("content-type", upstreamContentType);
    }

    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: {
          code: "UPSTREAM_UNAVAILABLE",
          message:
            err instanceof Error
              ? `Failed to reach backend service via BACKEND_URL: ${err.message}`
              : "Failed to reach backend service via BACKEND_URL.",
          details: [],
        },
      },
      { status: 502 }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
): Promise<Response> {
  return proxyToBackend(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
): Promise<Response> {
  return proxyToBackend(request, context);
}
