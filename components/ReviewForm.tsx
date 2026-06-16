"use client";

import { useState } from "react";
import Button from "./Button";
import StarRating from "./StarRating";
import MediaSearch from "./MediaSearch";
import { MediaSearchResult } from "@/lib/media/types";

export type ReviewSubmission = {
  item: MediaSearchResult;
  date: string;
  rating: number;
  review: string;
};

type ReviewFormProps = {
  search: (query: string) => Promise<MediaSearchResult[]>;
  searchPlaceholder?: string;
  onAddReview: (data: ReviewSubmission) => void;
};

export default function ReviewForm({ search, searchPlaceholder, onAddReview }: ReviewFormProps) {
  const [selectedItem, setSelectedItem] = useState<MediaSearchResult | null>(null);
  const [date, setDate] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedItem) {
      alert("Please pick something first.");
      return;
    }
    if (rating === 0) {
      alert("Please pick a rating.");
      return;
    }

    onAddReview({ item: selectedItem, date, rating, review });

    setSelectedItem(null);
    setDate("");
    setRating(0);
    setReview("");
  }

  return (
    <form className="flex flex-col justify-center" onSubmit={handleSubmit}>
      <section className="flex gap-5">
        {selectedItem ? (
          <div>
            <img src={selectedItem.imageUrl} alt="" width={60} height={60} />
            <p>{selectedItem.title} {selectedItem.artist && ` — ${selectedItem.artist}`}</p>
            <Button type="button" onClick={() => setSelectedItem(null)} variant="secondary">
              Change
            </Button>
          </div>
        ) : (
          <MediaSearch
            search={search}
            placeholder={searchPlaceholder}
            onSelect={setSelectedItem}
          />
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