// app/api/hls/proxy/route.ts
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) return new Response("Missing url", { status: 400 });

  let targetUrl: URL;
  try {
    targetUrl = new URL(url);
  } catch {
    return new Response("Invalid URL", { status: 400 });
  }

  // Optional: still block obviously bad domains
  const allowed = [
    "queenselti.me",
    "turbovid.eu",
    "tvcdn.eu",
    "premilkyway.com",
    "streamwish.to",
  ];
  if (!allowed.some((h) => targetUrl.hostname.includes(h))) {
    return new Response("Host not allowed", { status: 403 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        Referer: "https://turbovid.eu/",
        Origin: "https://turbovid.eu",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) return new Response("Stream blocked", { status: 403 });

    let text = await response.text();

    // Only rewrite if it's a playlist
    if (text.includes("#EXTM3U") || targetUrl.pathname.endsWith(".m3u8")) {
      const baseUrl = url.endsWith("/")
        ? url
        : url.substring(0, url.lastIndexOf("/") + 1);

      text = text
        .split("\n")
        .map((line) => {
          line = line.trim();
          if (line && !line.startsWith("#") && !line.startsWith("http")) {
            // Turn relative → absolute
            return new URL(line, baseUrl).href;
          }
          return line;
        })
        .join("\n");
    }

    return new Response(text, {
      headers: {
        "Content-Type": "application/vnd.apple.mpegurl",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (err) {
    console.error(err);
    return new Response("Proxy failed", { status: 502 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    },
  });
}
