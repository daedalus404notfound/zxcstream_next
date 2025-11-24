import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const streamUrl = searchParams.get("url");
    const referer = searchParams.get("referer");
    const origin = searchParams.get("origin");

    // Validate required parameters
    if (!streamUrl) {
      return NextResponse.json(
        { error: "Missing required parameter: url" },
        { status: 400 }
      );
    }

    // Decode the URL if it's encoded
    let decodedUrl: string;
    try {
      decodedUrl = decodeURIComponent(streamUrl);
    } catch {
      decodedUrl = streamUrl;
    }

    // Build headers with custom origin/referer
    const headers: HeadersInit = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    };

    // Add Referer if provided
    if (referer) {
      headers["Referer"] = decodeURIComponent(referer);
    }

    // Add Origin if provided
    if (origin) {
      headers["Origin"] = decodeURIComponent(origin);
    }

    console.log("[v0] Proxy request:", {
      url: decodedUrl,
      referer: headers["Referer"],
      origin: headers["Origin"],
    });

    // Fetch the stream
    const response = await fetch(decodedUrl, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      console.log("[v0] Upstream error:", {
        status: response.status,
        statusText: response.statusText,
      });
      return NextResponse.json(
        { error: `Upstream error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    // Get the content
    const content = await response.text();

    // Return with appropriate headers for m3u8
    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("[v0] Proxy error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
