import { NextResponse } from "next/server";
import axios from "axios";
import { srtToVtt } from "@/lib/subs-converter";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const subtitleUrl = url.searchParams.get("url");

  if (!subtitleUrl) {
    return NextResponse.json(
      { error: "Missing subtitle URL" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(subtitleUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Referer: "https://libre-subs.fifthwit.net/",
      },
      responseType: "text",
    });

    let content = response.data;

    // Check the 'format' query parameter
    const subtitleUrlObj = new URL(subtitleUrl);
    const format = subtitleUrlObj.searchParams.get("format"); // "srt" or "vtt"

    if (format === "srt") {
      content = srtToVtt(content);
    }

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/vtt; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    console.error("Subtitle fetch error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
