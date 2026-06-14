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
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=album&limit=4`
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

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className="w-[50%]">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for an album..."
        className="border-2 w-[100%] pl-2 bg-lowlight focus:outline-0"
      />

      {isLoading && <p>Searching...</p>}

      {results.length > 0 && (
        <ul>
          {results.map((album) => (
            <li key={album.collectionId} className="min-w-0 bg-lowlight">
              <button
                type="button"
                className="flex items-center cursor-pointer border-1 border-b-0 w-[100%] gap-2 first:border-t-0 last:border-b-1 hover:font-bold"
                onClick={() => {
                  onSelect(album);
                  setQuery("");
                  setResults([]);
                }}
              >
                <img src={album.artworkUrl100} alt="" width={45} height={45} />
                <span className="flex flex-col items-start min-w-0">
                  <span className="truncate text-left w-full text-[14px]">{album.collectionName}</span>
                  <span className="truncate text-left w-full text-[14px]">{album.artistName}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}