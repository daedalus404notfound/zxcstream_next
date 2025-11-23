// app/api/get/route.ts
import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const targetUrl =
    req.nextUrl.searchParams.get("url") ??
    "https://watch.vidora.su/watch/tv/66732/1/6";

  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled", // ← THIS ONE LINE fixes 90% of blocks
      ],
    });

    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      viewport: { width: 1920, height: 1080 },
    });

    // Only these 3 stealth lines → enough in Nov 2025
    await context.addInitScript(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => false });
      delete (window as any).cdc_adoQpoasnfa76pfcZLmcfl_Array;
      delete (window as any).cdc_adoQpoasnfa76pfcZLmcfl_Promise;
      delete (window as any).cdc_adoQpoasnfa76pfcZLmcfl_Symbol;
    });

    const page = await context.newPage();
    let m3u8Url = "";

    page.on("request", (req) => {
      const url = req.url();
      if (
        url.includes("workers.dev") &&
        url.includes("cGxheWxpc3Q") &&
        url.includes(".m3u8")
      ) {
        m3u8Url = url;
      }
    });

    await page.goto(targetUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });

    // Wait max 10 seconds
    for (let i = 0; i < 20 && !m3u8Url; i++) {
      await page.waitForTimeout(500);
    }

    await browser.close();

    if (!m3u8Url) {
      return NextResponse.json({
        success: false,
        error: "No stream found in 10s",
      });
    }

    return NextResponse.json({
      success: true,
      realStreamUrl: m3u8Url,
      playInVLC: m3u8Url,
      download: `ffmpeg -i "${m3u8Url}" -c copy "movie.mp4"`,
    });
  } catch (error) {
    if (browser) await browser.close().catch(() => {});
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
    });
  }
}
