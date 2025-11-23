// //movie https://watch.vidora.su/watch/movie/{id}
// //tv https://watch.vidora.su/watch/tv/{id}/{season}/{episode}
// import { NextRequest, NextResponse } from "next/server";
// import { chromium } from "playwright";

// export const dynamic = "force-dynamic";
// export const maxDuration = 15; // Vercel: allow up to 15s

// export async function GET(req: NextRequest) {
//   const url =
//     req.nextUrl.searchParams.get("url") ??
//     "https://watch.vidora.su/watch/tv/60625/1/1";

//   let browser;
//   try {
//     browser = await chromium.launch({
//       headless: true,
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });

//     const context = await browser.newContext({
//       userAgent:
//         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
//       viewport: { width: 1920, height: 1080 },
//     });

//     // Bypass bot detection
//     await context.addInitScript(() => {
//       Object.defineProperty(navigator, "webdriver", { get: () => false });
//     });

//     const page = await context.newPage();
//     let m3u8Url = "";

//     // Capture the real stream request
//     page.on("request", (req) => {
//       const url = req.url();
//       if (
//         url.includes("workers.dev") &&
//         url.includes(".m3u8") &&
//         url.includes("cGxheWxpc3Q")
//       ) {
//         m3u8Url = url;
//       }
//     });

//     await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });

//     // Wait up to 10 seconds for the request
//     for (let i = 0; i < 20; i++) {
//       if (m3u8Url) break;
//       await new Promise((r) => setTimeout(r, 500));
//     }

//     await browser.close();

//     if (!m3u8Url) {
//       return NextResponse.json({
//         success: false,
//         error: "Stream not found in 10s",
//       });
//     }

//     return NextResponse.json({
//       success: true,
//       realStreamUrl: m3u8Url,
//       playInVLC: m3u8Url,
//       download: `ffmpeg -i "${m3u8Url}" -c copy "movie.mp4"`,
//     });
//   } catch (error) {
//     if (browser) await browser.close().catch(() => {});
//     return NextResponse.json({
//       success: false,
//       error: (error as Error).message,
//     });
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";

export const dynamic = "force-dynamic";
export const maxDuration = 15; // Vercel: allow up to 15s

export async function GET(req: NextRequest) {
  // Get query params
  const id = req.nextUrl.searchParams.get("id");
  const media_type = req.nextUrl.searchParams.get("media_type"); // "movie" or "tv"
  const season = req.nextUrl.searchParams.get("season");
  const episode = req.nextUrl.searchParams.get("episode");

  if (!id || !media_type || (media_type === "tv" && (!season || !episode))) {
    const res = NextResponse.json({
      success: false,
      error: "Missing required parameters",
    });
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "*");
    return res;
  }

  // Construct URL based on type
  const url =
    media_type === "movie"
      ? `https://watch.vidora.su/watch/movie/${id}`
      : `https://watch.vidora.su/watch/tv/${id}/${season}/${episode}`;

  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      viewport: { width: 1920, height: 1080 },
    });

    // Bypass bot detection
    await context.addInitScript(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => false });
    });

    const page = await context.newPage();
    let m3u8Url = "";

    // Capture the real stream request
    page.on("request", (req) => {
      const url = req.url();
      if (
        url.includes("workers.dev") &&
        url.includes(".m3u8") &&
        url.includes("cGxheWxpc3Q")
      ) {
        m3u8Url = url;
      }
    });

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });

    // Wait up to 10 seconds for the request
    for (let i = 0; i < 20; i++) {
      if (m3u8Url) break;
      await new Promise((r) => setTimeout(r, 500));
    }

    await browser.close();

    const res = NextResponse.json(
      m3u8Url
        ? {
            success: true,
            realStreamUrl: m3u8Url,
            playInVLC: m3u8Url,
            download: `ffmpeg -i "${m3u8Url}" -c copy "movie.mp4"`,
          }
        : { success: false, error: "Stream not found in 10s" }
    );

    // Add CORS headers
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "*");

    return res;
  } catch (error) {
    if (browser) await browser.close().catch(() => {});
    const res = NextResponse.json({
      success: false,
      error: (error as Error).message,
    });
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "*");
    return res;
  }
}
