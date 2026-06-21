import { MediaSearchResult } from "./types";

const RAWG_KEY = process.env.NEXT_PUBLIC_RAWG_API_KEY;

export async function searchRawg(query: string): Promise<MediaSearchResult[]> {
  if (!query.trim()) return [];

  const response = await fetch(
    `https://api.rawg.io/api/games?key=${RAWG_KEY}&search=${encodeURIComponent(query)}&page_size=4`
  );
  const data = await response.json();

  return (data.results || []).map((item: any) => ({
    id: String(item.id),
    title: item.name,
    artist: new Date(item.released).getFullYear(),
    imageUrl: item.background_image,
  }));
}