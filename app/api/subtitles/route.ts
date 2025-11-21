// /app/api/libre-subs/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

// Define the shape of each subtitle from LibreSubs
export interface LibreSubtitle {
  id: string;
  language: string;
  display: string;
  format: string;
  url: string;
  isHearingImpaired: boolean;
  flagUrl: string;
  source: string;
}

// Define the shape of the transformed subtitle sent to frontend
export interface Subtitle {
  id: string;
  language: string;
  name: string;
  format: string;
  url: string;
  isHearingImpaired: boolean;
  flagUrl: string;
  source: string;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const imdbId = url.searchParams.get("imdbId") || "";
  const season = url.searchParams.get("season") || "";
  const episode = url.searchParams.get("episode") || "";

  if (!imdbId) {
    return NextResponse.json({ success: false, error: "Missing IMDb ID" });
  }

  try {
    const apiUrl = `https://libre-subs.fifthwit.net/search?id=${imdbId}&season=${season}&episode=${episode}&encoding=utf-8&source=all`;

    const response = await axios.get<LibreSubtitle[]>(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json,text/html,*/*",
        Referer: "https://libre-subs.fifthwit.net/",
      },
    });

    // Transform API response into your Subtitle shape
    const subtitles: Subtitle[] = response.data.map((sub) => ({
      id: sub.id,
      language: sub.language,
      name: sub.display,
      format: sub.format,
      url: `/api/subtitles/file?url=${encodeURIComponent(sub.url)}`,
      isHearingImpaired: sub.isHearingImpaired,
      flagUrl: sub.flagUrl,
      source: sub.source,
    }));

    return NextResponse.json(subtitles);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message });
  }
}
