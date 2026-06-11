"use client";

import { useState, useEffect } from "react";

type Album = {
  collectionId: number;
  collectionName: string;
  artistName: string;
  artworkUrl100: string;
};

type AlbumSearchProps = {
  onSelect: (album: Album) => void;
};

export default function AlbumSearch({ onSelect }: AlbumSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If the query is empty, clear results and bail out
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    // Debounce: wait 400ms after the user stops typing before fetching
    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=album&limit=3`
        );
        const data = await response.json();
        setResults(data.results);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    // Cleanup: if the user types again before 400ms, cancel the pending fetch
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for an album..."
      />

      {isLoading && <p>Searching...</p>}

      {results.length > 0 && (
        <ul>
          {results.map((album) => (
            <li key={album.collectionId}>
              <button
                type="button"
                onClick={() => {
                  onSelect(album);
                  setQuery("");
                  setResults([]);
                }}
              >
                <img src={album.artworkUrl100} alt="" width={40} height={40} />
                <span>{album.collectionName} — {album.artistName}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}