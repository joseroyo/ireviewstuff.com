"use client"

import { useState } from "react";
import AlbumSearch from "./AlbumSearch";


type Album = {
  collectionId: number;
  collectionName: string;
  artistName: string;
  artworkUrl100: string;
};

type ReviewFormProps = {
  onAddReview: (review: {
    album: string;
    artist: string;
    date: string;
    rating: number;
    review: string;
    coverUrl: string;
  }) => void;
};

export default function ReviewForm({ onAddReview }: ReviewFormProps) {
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);  const [date, setDate] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedAlbum) {
      alert("Please pick an album first.");
      return;
    }

    onAddReview({
      album: selectedAlbum.collectionName,
      artist: selectedAlbum.artistName,
      date,
      rating,
      review,
      coverUrl: selectedAlbum.artworkUrl100,
    });
    setSelectedAlbum(null);
    setDate("");
    setRating(5);
    setReview("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add a Review</h2>

      {selectedAlbum ? (
        <div>
          <img src={selectedAlbum.artworkUrl100} alt="" width={60} height={60} />
          <p>{selectedAlbum.collectionName} — {selectedAlbum.artistName}</p>
          <button type="button" onClick={() => setSelectedAlbum(null)}>
            Change album
          </button>
        </div>
      ) : (
        <AlbumSearch onSelect={setSelectedAlbum} />
      )}

      <label>
        Date listened:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

      <label>
        Rating (1-5):
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />
      </label>

      <label>
        Review:
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Write your review..."
          rows={4}
        />
      </label>

      <button type="submit">Save Review</button>
    </form>
  );
}