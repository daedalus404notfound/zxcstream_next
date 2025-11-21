// import { NextResponse } from "next/server";
// export const runtime = "nodejs";
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
//       console.error("STREAM ERROR:", error);
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
export const runtime = "nodejs";

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

// ---------------------------
// ALLOWED ORIGINS (EDIT THIS)
// ---------------------------
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://zxcstream-next.vercel.app",
  "https://vidnest.fun",
];

// providers
const providers = makeProviders({
  fetcher: makeStandardFetcher(fetch),
  target: targets.NATIVE,
});

// ---------------------------
// CORS helper
// ---------------------------
function cors(response: NextResponse, origin: string) {
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
}

// ---------------------------
// OPTIONS (required on Vercel)
// ---------------------------
export function OPTIONS(req: Request) {
  const origin = req.headers.get("origin") || "";
  const allowed = ALLOWED_ORIGINS.includes(origin);

  const res = new NextResponse(null, {
    status: allowed ? 200 : 403,
  });

  return cors(res, allowed ? origin : "");
}

// ---------------------------
// MAIN GET ROUTE
// ---------------------------
export async function GET(req: Request) {
  const origin = req.headers.get("origin") || "";

  // Reject request if origin not allowed
  const allowed = ALLOWED_ORIGINS.includes(origin);

  if (!allowed) {
    return NextResponse.json(
      { error: "Forbidden: Origin not allowed" },
      { status: 403 }
    );
  }

  const url = new URL(req.url);

  const title = url.searchParams.get("title") || "";
  const releaseYear = Number(url.searchParams.get("releaseYear") || 0);
  const tmdbId = url.searchParams.get("tmdbId");
  const media_type = url.searchParams.get("media_type") || "movie";

  const seasonTitle = url.searchParams.get("seasonTitle") || "";
  const season = Number(url.searchParams.get("season") || 1);
  const episode = Number(url.searchParams.get("episode") || 1);
  const episodeCount = Number(url.searchParams.get("episodeCount") || 0);

  if (!tmdbId) {
    return cors(
      NextResponse.json({ success: false, error: "Missing TMDB ID" }),
      origin
    );
  }

  try {
    // ---------------- MOVIE ----------------
    if (media_type === "movie") {
      const media: MovieMedia = {
        type: "movie",
        tmdbId,
        title,
        releaseYear,
      };

      const streams = await providers.runAll({ media });

      return cors(NextResponse.json({ success: true, streams }), origin);
    }

    // ---------------- SHOW ----------------
    const media: ShowMedia = {
      type: "show",
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

    const streams = await providers.runAll({ media });

    return cors(NextResponse.json({ success: true, streams }), origin);
  } catch (error) {
    console.error("STREAM ERROR:", error);

    return cors(
      NextResponse.json(
        { success: false, streams: null, message: "404 not found." },
        { status: 404 }
      ),
      origin
    );
  }
}
