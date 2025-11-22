// app/api/proxy/route.ts
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  let targetUrl = request.nextUrl.searchParams.get("url");
  const referer = request.nextUrl.searchParams.get("referer") || "";
  const origin = request.nextUrl.searchParams.get("origin") || "";

  if (!targetUrl) return new Response("Missing url", { status: 400 });

  // Pass through original referer/origin to sub-requests (key fix!)
  const finalReferer = referer.endsWith("/") ? referer : `${referer}/`;
  const finalOrigin = origin.endsWith("/") ? origin : `${origin}/`;

  const headers = new Headers({
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    Accept: "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate",
    Connection: "keep-alive",
    Referer: finalReferer,
    Origin: finalOrigin,
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "cross-site",
  });

  try {
    const response = await fetch(targetUrl, {
      headers,
      redirect: "follow",
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        `Proxy failed: ${response.status} for ${targetUrl} | Referer: ${finalReferer}`
      );
      return new Response("Stream blocked or expired", { status: 403 });
    }

    const contentType =
      response.headers.get("content-type") || "application/octet-stream";
    const isPlaylist =
      contentType.includes("mpegurl") ||
      contentType.includes("m3u8") ||
      targetUrl.endsWith(".m3u8");

    if (isPlaylist) {
      // Rewrite ALL playlists (master + sub) — inject proxy for segments/sub-playlists
      let text = await response.text();
      const base = targetUrl.slice(0, targetUrl.lastIndexOf("/") + 1);
      const proxyBase = request.nextUrl.origin + request.nextUrl.pathname; // e.g., https://zxcstream-next.vercel.app/api/proxy

      text = text
        .split("\n")
        .map((line) => {
          line = line.trim();
          if (line && !line.startsWith("#") && !line.startsWith("http")) {
            // Relative → full absolute → proxy it with same referer/origin
            const absolute = new URL(line, base).href;
            const proxied = `${proxyBase}?url=${encodeURIComponent(
              absolute
            )}&referer=${encodeURIComponent(
              finalReferer
            )}&origin=${encodeURIComponent(finalOrigin)}`;
            return proxied;
          }
          return line;
        })
        .join("\n");

      return new Response(text, {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.apple.mpegurl",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=60",
        },
      });
    }

    // .ts segments: Stream with max cache (Cloudflare/Vercel caches forever)
    const proxyHeaders = new Headers(response.headers);
    proxyHeaders.set("Access-Control-Allow-Origin", "*");
    proxyHeaders.set("Cache-Control", "public, max-age=31536000, immutable");
    proxyHeaders.set("CDN-Cache-Control", "public, max-age=31536000");

    return new Response(response.body, {
      status: 200,
      headers: proxyHeaders,
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return new Response("Stream unavailable", { status: 502 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}
