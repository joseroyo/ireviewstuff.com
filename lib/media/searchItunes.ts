import { MediaSearchResult } from "./types";
import { getItunesArtwork } from "@/lib/itunes";

export async function searchItunes(query: string): Promise<MediaSearchResult[]> {
  if (!query.trim()) return [];

  const response = await fetch(
    `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=album&limit=4`
  );
  const data = await response.json();

  return (data.results || []).map((item: any) => ({
    id: String(item.collectionId),
    title: item.collectionName,
    artist: item.artistName,
    imageUrl: getItunesArtwork(item.artworkUrl100, 600),
  }));
}