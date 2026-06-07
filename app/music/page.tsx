"use client"

import { useState } from "react";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";

type Review = {
  album: string;
  artist: string;
  date: string;
  rating: number;
  review: string;
  coverUrl: string;
};

export default function Music() {
  const [reviews, setReviews] = useState<Review[]>([]);

  function addReview(newReview: Review) {
    setReviews([newReview, ...reviews]);
  }

  return (
    <main>
      <h1>Music Reviews</h1>

      <ReviewForm onAddReview={addReview} />
      
      {reviews.length === 0 ? (
        <p>No reviews yet. Add one above!</p>
      ) : (
        reviews.map((r, index) => (
          <ReviewCard
            key={index}
            album={r.album}
            artist={r.artist}
            date={r.date}
            rating={r.rating}
            review={r.review}
            coverUrl={r.coverUrl}
          />
        ))
      )}
    </main>
  );
}