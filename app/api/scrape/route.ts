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

// const providers = makeProviders({
//   fetcher: makeStandardFetcher(fetch),
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
//         streams: null,
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
//     console.error("STREAM ERROR:", error);
//     return NextResponse.json({
//       success: false,
//       streams: null,
//       message: "404 not found, Try switching server.",
//     });
//   }
// }
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

// Custom fetcher that uses ScraperAPI in production
const createFetcher = () => {
  const SCRAPER_API_KEY = "3b5897de0867fc700081765989e5a46a";

  return (url: string, opts?: RequestInit) => {
    // Use ScraperAPI in production, direct fetch in development
    if (process.env.NODE_ENV === "production" && SCRAPER_API_KEY) {
      const proxyUrl = `http://api.scraperapi.com?api_key=${SCRAPER_API_KEY}&url=${encodeURIComponent(
        url
      )}`;
      console.log(`DEBUG: Proxying request through ScraperAPI`);
      return fetch(proxyUrl, {
        method: opts?.method || "GET",
        headers: {
          // Don't forward all headers to ScraperAPI - it handles its own
          "Content-Type": "application/json",
        },
        body: opts?.body,
      });
    }

    return fetch(url, opts);
  };
};

const providers = makeProviders({
  fetcher: makeStandardFetcher(createFetcher()),
  target: targets.NATIVE,
});

export async function GET(req: Request) {
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

  // MOVIE MEDIA
  if (media_type === "movie") {
    const media: MovieMedia = {
      type: "movie" as const,
      tmdbId,
      title,
      releaseYear,
    };
    try {
      const streams = await providers.runAll({ media });
      return NextResponse.json({ success: true, streams });
    } catch (error) {
      console.error("MOVIE STREAM ERROR:", error);
      return NextResponse.json({
        success: false,
        streams: null,
        message: "404 not found.",
      });
    }
  }

  // SHOW MEDIA
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
    return NextResponse.json({ success: true, streams });
  } catch (error) {
    console.error("STREAM ERROR:", error);
    return NextResponse.json({
      success: false,
      streams: null,
      message: "404 not found, Try switching server.",
    });
  }
}
