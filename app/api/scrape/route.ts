import { NextResponse } from "next/server";
import {
  makeProviders,
  makeStandardFetcher,
  targets,
} from "@p-stream/providers";
import { proxiedFetch } from "./proxyFetcher";
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

const providers = makeProviders({
  fetcher: makeStandardFetcher(proxiedFetch),
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
      return NextResponse.json({ success: true, streams });
    } catch (error) {
      return NextResponse.json({
        success: false,
        streams: null,
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
    return NextResponse.json({ success: true, streams });
  } catch (error) {
    return NextResponse.json({
      success: false,
      streams: null,
      message: "404 not found.",
    });
  }
}
