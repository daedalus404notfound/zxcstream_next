// import { NextResponse } from "next/server";
// import {
//   makeProviders,
//   makeStandardFetcher,
//   targets,
// } from "@p-stream/providers";
// export interface MovieMedia {
//   type: "movie";
//   tmdbId: string;
//   title: string;
//   releaseYear: number;
// }

// export interface ShowMedia {
//   type: "show";
//   tmdbId: string;

//   title: string;
//   releaseYear: number;

//   season: {
//     number: number;
//     tmdbId: string;
//     title: string;
//     episodeCount?: number;
//   };

//   episode: {
//     number: number;
//     tmdbId: string;
//   };
// }

// const customFetch: typeof fetch = (input, init) => {
//   return fetch(input, {
//     ...init,
//     headers: {
//       // Mobile Chrome on Android (Pixel 9, Android 15, Chrome 131)
//       "User-Agent":
//         "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",

//       // Common mobile headers
//       Accept:
//         "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
//       "Accept-Language": "en-US,en;q=0.9",
//       "Accept-Encoding": "gzip, deflate, br, zstd",
//       "Sec-Fetch-Dest": "document",
//       "Sec-Fetch-Mode": "navigate",
//       "Sec-Fetch-Site": "none",
//       "Sec-Fetch-User": "?1",
//       "Upgrade-Insecure-Requests": "1",

//       // Optional: fake viewport (some sites check this via JS, but good for realism)
//       "Viewport-Width": "412",
//       DPR: "2.625", // Pixel 9 has ~420dpi → ~2.6x

//       // Override any headers passed in init
//       ...((init?.headers as Record<string, string>) || {}),
//     },
//     signal: init?.signal ?? AbortSignal.timeout?.(30_000),
//   });
// };

// const providers = makeProviders({
//   fetcher: makeStandardFetcher(customFetch), // Only 1 argument!
//   target: targets.NATIVE,
// });

// export async function GET(req: Request) {
//   console.log(
//     "providers",
//     providers.listSources().filter((s) => s.mediaTypes?.includes("show"))
//   );

//   const url = new URL(req.url);
//   const title = url.searchParams.get("title") || "";
//   const releaseYear = Number(url.searchParams.get("releaseYear") || 0);
//   const tmdbId = url.searchParams.get("tmdbId");
//   const media_type = url.searchParams.get("media_type") || "movie";

//   const seasonTitle = url.searchParams.get("seasonTitle") || "";
//   const season = Number(url.searchParams.get("season") || 1);
//   const episode = Number(url.searchParams.get("episode") || 1);
//   const episodeCount = Number(url.searchParams.get("episodeCount") || 0);
//   if (!tmdbId)
//     return NextResponse.json({ success: false, error: "Missing TMDB ID" });

//   // --------------------------
//   // MOVIE MEDIA
//   // --------------------------
//   if (media_type === "movie") {
//     const media: MovieMedia = {
//       type: "movie" as const,
//       tmdbId,
//       title,
//       releaseYear,
//     };
//     try {
//       const streams = await providers.runAll({ media });
//       return NextResponse.json({ success: true, streams });
//     } catch (error) {
//       return NextResponse.json({
//         success: false,
//         streams: [],
//         message: "404 not found.",
//       });
//     }
//   }
//   // --------------------------
//   // SHOW MEDIA
//   // --------------------------

//   const media: ShowMedia = {
//     type: "show" as const,
//     tmdbId,
//     title,
//     releaseYear,

//     season: {
//       number: season,
//       tmdbId,
//       title: seasonTitle,
//       episodeCount,
//     },

//     episode: {
//       number: episode,
//       tmdbId,
//     },
//   };

//   try {
//     const streams = await providers.runAll({ media });
//     return NextResponse.json({ success: true, streams });
//   } catch (error) {
//     return NextResponse.json({
//       success: false,
//       streams: [],
//       message: "404 not found. Try switching server.",
//     });
//   }
// }

// // http://localhost:3000/api/zxc?title=Arcane&releaseYear=2021&tmdbId=94605&media_type=show&seasonTitle=Season+1&season=1&episode=1&episodeCount=9
//----------------------------------------------------------------------------------------------------------------------------------------------
// import { NextResponse } from "next/server";
// import {
//   buildProviders,
//   makeStandardFetcher,
//   targets,
//   type MovieScrapeContext,
//   type ShowScrapeContext,
//   NotFoundError,
// } from "@p-stream/providers";
// import { chromium } from "playwright";

// export interface MovieMedia {
//   type: "movie";
//   tmdbId: string;
//   title: string;
//   releaseYear: number;
// }

// export interface ShowMedia {
//   type: "show";
//   tmdbId: string;
//   title: string;
//   releaseYear: number;
//   season: {
//     number: number;
//     tmdbId: string;
//     title: string;
//     episodeCount?: number;
//   };
//   episode: {
//     number: number;
//     tmdbId: string;
//   };
// }

// const customFetch: typeof fetch = (input, init) => {
//   return fetch(input, {
//     ...init,
//     headers: {
//       "User-Agent":
//         "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
//       Accept:
//         "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
//       "Accept-Language": "en-US,en;q=0.9",
//       "Accept-Encoding": "gzip, deflate, br, zstd",
//       "Sec-Fetch-Dest": "document",
//       "Sec-Fetch-Mode": "navigate",
//       "Sec-Fetch-Site": "none",
//       "Sec-Fetch-User": "?1",
//       "Upgrade-Insecure-Requests": "1",
//       "Viewport-Width": "412",
//       DPR: "2.625",
//       ...((init?.headers as Record<string, string>) || {}),
//     },
//     signal: init?.signal ?? AbortSignal.timeout?.(30_000),
//   });
// };

// // Playwright-based scraper for Vidora
// async function vidoraComboScraper(
//   ctx: MovieScrapeContext | ShowScrapeContext
// ): Promise<{ embeds: { embedId: string; url: string }[] }> {
//   const baseUrl = "https://watch.vidora.su";
//   let watchUrl: string;

//   // Construct watch URL based on media type
//   if (ctx.media.type === "movie") {
//     watchUrl = `${baseUrl}/watch/movie/${ctx.media.tmdbId}`;
//   } else {
//     watchUrl = `${baseUrl}/watch/tv/${ctx.media.tmdbId}/${ctx.media.season.number}/${ctx.media.episode.number}`;
//   }

//   let browser;
//   try {
//     ctx.progress(10);

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

//     ctx.progress(30);

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

//     await page.goto(watchUrl, {
//       waitUntil: "domcontentloaded",
//       timeout: 30_000,
//     });

//     ctx.progress(60);

//     // Wait up to 10 seconds for the stream request
//     for (let i = 0; i < 20; i++) {
//       if (m3u8Url) break;
//       await new Promise((r) => setTimeout(r, 500));
//     }

//     await browser.close();

//     if (!m3u8Url) {
//       throw new NotFoundError("Stream not found within 10 seconds");
//     }

//     ctx.progress(100);

//     const embeds = [
//       {
//         embedId: "vidora-player",
//         url: m3u8Url,
//       },
//     ];

//     return { embeds };
//   } catch (error) {
//     if (browser) await browser.close().catch(() => {});
//     throw new NotFoundError(
//       `Failed to scrape Vidora: ${(error as Error).message}`
//     );
//   }
// }

// // Manually construct the Vidora source
// const vidoraSource = {
//   type: "source",
//   id: "vidora-su",
//   name: "Vidora SU",
//   rank: 800,
//   disabled: false,
//   externalSource: false,
//   flags: [],
//   mediaTypes: ["movie", "show"],
//   scrapeMovie: vidoraComboScraper,
//   scrapeShow: vidoraComboScraper,
// };

// // Build providers with custom source
// const providers = buildProviders()
//   .setFetcher(makeStandardFetcher(customFetch))
//   .setTarget(targets.NATIVE)
//   // @ts-ignore - Suppress type mismatch for flags
//   .addSource(vidoraSource)
//   .build();

// export async function GET(req: Request) {
//   console.log(
//     "providers",
//     providers.listSources().filter((s: any) => s.mediaTypes?.includes("show"))
//   );

//   const url = new URL(req.url);
//   const title = url.searchParams.get("title") || "";
//   const releaseYear = Number(url.searchParams.get("releaseYear") || 0);
//   const tmdbId = url.searchParams.get("tmdbId");
//   const media_type = url.searchParams.get("media_type") || "movie";

//   const seasonTitle = url.searchParams.get("seasonTitle") || "";
//   const season = Number(url.searchParams.get("season") || 1);
//   const episode = Number(url.searchParams.get("episode") || 1);
//   const episodeCount = Number(url.searchParams.get("episodeCount") || 0);

//   if (!tmdbId)
//     return NextResponse.json({ success: false, error: "Missing TMDB ID" });

//   // MOVIE MEDIA
//   if (media_type === "movie") {
//     const media: MovieMedia = {
//       type: "movie" as const,
//       tmdbId,
//       title,
//       releaseYear,
//     };
//     try {
//       const streams = await providers.runAll({ media });
//       return NextResponse.json({ success: true, streams });
//     } catch (error) {
//       return NextResponse.json({
//         success: false,
//         streams: [],
//         message: "404 not found.",
//       });
//     }
//   }

//   // SHOW MEDIA
//   const media: ShowMedia = {
//     type: "show" as const,
//     tmdbId,
//     title,
//     releaseYear,
//     season: {
//       number: season,
//       tmdbId,
//       title: seasonTitle,
//       episodeCount,
//     },
//     episode: {
//       number: episode,
//       tmdbId,
//     },
//   };

//   try {
//     const streams = await providers.runAll({ media });
//     return NextResponse.json({ success: true, streams });
//   } catch (error) {
//     return NextResponse.json({
//       success: false,
//       streams: [],
//       message: "404 not found. Try switching server.",
//     });
//   }
// }

// Test: http://localhost:3000/api/scrape?title=Arcane&releaseYear=2021&tmdbId=94605&media_type=show&seasonTitle=Season+1&season=1&episode=1&episodeCount=9
import { NextResponse } from "next/server";
import {
  makeProviders,
  makeStandardFetcher,
  targets,
} from "@p-stream/providers";
export interface MovieMedia {
  type: "movie";
  tmdbId: string;
  title: string;
  releaseYear: number;
}

export interface ShowMedia {
  type: "show";
  tmdbId: string;

  title: string;
  releaseYear: number;

  season: {
    number: number;
    tmdbId: string;
    title: string;
    episodeCount?: number;
  };

  episode: {
    number: number;
    tmdbId: string;
  };
}

const customFetch: typeof fetch = (input, init) => {
  return fetch(input, {
    ...init,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      ...((init?.headers as Record<string, string>) || {}),
    },
    signal: init?.signal ?? AbortSignal.timeout?.(30_000), // 30s timeout (Node 18+)
  });
};

const providers = makeProviders({
  fetcher: makeStandardFetcher(customFetch), // Only 1 argument!
  target: targets.NATIVE,
});

export async function GET(req: Request) {
  console.log(
    "providers",
    providers.listSources().filter((s) => s.mediaTypes?.includes("show"))
  );

  const url = new URL(req.url);
  const title = url.searchParams.get("title") || "";
  const releaseYear = Number(url.searchParams.get("releaseYear") || 0);
  const tmdbId = url.searchParams.get("tmdbId");
  const media_type = url.searchParams.get("media_type") || "movie";

  const seasonTitle = url.searchParams.get("seasonTitle") || "";
  const season = Number(url.searchParams.get("season") || 1);
  const episode = Number(url.searchParams.get("episode") || 1);
  const episodeCount = Number(url.searchParams.get("episodeCount") || 0);
  if (!tmdbId)
    return NextResponse.json({ success: false, error: "Missing TMDB ID" });

  // --------------------------
  // MOVIE MEDIA
  // --------------------------
  if (media_type === "movie") {
    const media: MovieMedia = {
      type: "movie" as const,
      tmdbId,
      title,
      releaseYear,
    };
    try {
      const streams = await providers.runAll({ media });
      return withCors({ success: true, streams });
    } catch (error) {
      return NextResponse.json({
        success: false,
        streams: [],
        message: "404 not found.",
      });
    }
  }
  // --------------------------
  // SHOW MEDIA
  // --------------------------

  const media: ShowMedia = {
    type: "show" as const,
    tmdbId,
    title,
    releaseYear,

    season: {
      number: season,
      tmdbId,
      title: seasonTitle,
      episodeCount,
    },

    episode: {
      number: episode,
      tmdbId,
    },
  };

  try {
    const streams = await providers.runAll({ media });
    return withCors({ success: true, streams });
  } catch (error) {
    return NextResponse.json({
      success: false,
      streams: [],
      message: "404 not found. Try switching server.",
    });
  }
}
function withCors(json: any, status = 200) {
  return new NextResponse(JSON.stringify(json), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", // or "http://localhost:3000"
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

/* ⬇️ ADD THIS — REQUIRED FOR CORS */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
