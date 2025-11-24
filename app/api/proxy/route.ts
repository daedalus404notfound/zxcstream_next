// app/api/play/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const cookies = req.nextUrl.searchParams.get("c"); // pass cookies as base64 if needed

  if (!url) return new NextResponse("add ?url=");

  const headers = new Headers({
    Referer: "https://vidrock.net/",
    Origin: "https://vidrock.net",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  });

  // Add the magic cookies
  headers.set(
    "Cookie",
    "__dtsu=6D001763876909BF6DE8D3A11976FC5B; cc_id=bbbf21f6fb94e73885448c48f6c6f4e; panoramaId=b19ebe8144602bac827a056cbd88185ca02cda61a0432e3df6fa3a027f3797d2"
  );

  const range = req.headers.get("range");
  if (range) headers.set("Range", range);

  const res = await fetch(url, { headers });
  if (!res.ok)
    return new NextResponse("dead link or wrong cookies", { status: 502 });

  return new NextResponse(res.body, {
    status: res.status,
    headers: {
      "Content-Type": "video/mp4",
      "Content-Disposition": 'inline; filename="movie.mp4"',
      "Accept-Ranges": "bytes",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
