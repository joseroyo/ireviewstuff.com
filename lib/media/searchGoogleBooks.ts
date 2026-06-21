import { MediaSearchResult } from "./types";

const GOOGLE_BOOKS_KEY = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_KEY;

export async function searchGoogleBooks(query: string): Promise<MediaSearchResult[]> {
  if (!query.trim()) return [];

  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${GOOGLE_BOOKS_KEY}&maxResults=4`
  );
  const data = await response.json();

  return (data.items || []).map((item: any) => ({
    id: String(item.id),
    title: item.volumeInfo.title,
    artist: item.volumeInfo.authors?.join(", ") ?? "Unknown",
    imageUrl: item.volumeInfo.imageLinks?.thumbnail ?? "",
  }));
}