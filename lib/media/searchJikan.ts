import { MediaSearchResult } from "./types";

export async function searchJikanAnime(query: string): Promise<MediaSearchResult[]> {
  if (!query.trim()) return [];

  const response = await fetch(
    `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=4`
  );
  const data = await response.json();

  return (data.data || []).map((item: any) => ({
    id: String(item.mal_id),
    title: item.title_english || item.title,
    artist: item.aired.prop.from.year,
    imageUrl: item.images.webp.large_image_url,
  }));
}

export async function searchJikanManga(query: string): Promise<MediaSearchResult[]> {
  if (!query.trim()) return [];

  const response = await fetch(
    `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}&limit=4`
  );
  const data = await response.json();

  return (data.data || []).map((item: any) => ({
    id: String(item.mal_id),
    title: item.title_english || item.title,
    artist: item.authors?.[0]?.name ?? "",
    imageUrl: item.images.webp.large_image_url,
  }));
}