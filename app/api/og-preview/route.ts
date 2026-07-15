import { NextResponse } from "next/server";
import ogs from "open-graph-scraper";

export async function POST(request: Request) {
  const { url } = await request.json();

  if (!url) {
    return NextResponse.json({ error: "URL required" }, { status: 400 });
  }

  try {
    const { result } = await ogs({ url });
    return NextResponse.json({
      image: result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url || "",
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch preview" }, { status: 500 });
  }
}