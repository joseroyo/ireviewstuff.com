"use client";

import { useState } from "react";
import AlbumSearch from "./AlbumSearch";
import Button from "./Button";
import StarRating from "./StarRating";


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
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);  
  const [date, setDate] = useState("");
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
    <form className="flex flex-col justify-center" onSubmit={handleSubmit}>
      <section className="flex gap-5">
        {selectedAlbum ? (
          <div>
            <img src={selectedAlbum.artworkUrl100} alt="" width={60} height={60} />
            <p>{selectedAlbum.collectionName} — {selectedAlbum.artistName}</p>
            <Button type="button" onClick={() => setSelectedAlbum(null)} variant="secondary">
              Change album
            </Button>
          </div>
        ) : (
          <AlbumSearch onSelect={setSelectedAlbum} />
        )}

        <section className="flex flex-col w-[50%]">
          <input
              type="date"
              value={date}
              className="focus:outline-0"
              onChange={(e) => setDate(e.target.value)}
            />
          <div>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your review..."
              rows={4}
              className="pr-2"
            />
          <Button type="submit" className="mt-3">Save Review</Button>
        </section>
      </section>
    </form>
  );
}