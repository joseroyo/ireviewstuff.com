import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { url } = await request.json();

  if (!url) {
    return NextResponse.json({ error: "URL required" }, { status: 400 });
  }

  try {
    const microlinkUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=true`;
    const response = await fetch(microlinkUrl);
    const result = await response.json();

    if (result.status !== "success") {
      return NextResponse.json({ error: "Failed to fetch preview" }, { status: 500 });
    }

    return NextResponse.json({
      image: result.data.screenshot?.url || result.data.image?.url || "",
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch preview" }, { status: 500 });
  }
}