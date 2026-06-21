"use client";

import { useState } from "react";
import Button from "./Button";
import StarRating from "./StarRating";
import ImageUpload from "./ImageUpload";

export type FriendSubmission = {
  name: string;
  rating: number;
  review: string;
  photo: string;
};

type FriendFormProps = {
  onAddReview: (data: FriendSubmission) => void;
};

export default function FriendForm({ onAddReview }: FriendFormProps) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [photo, setPhoto] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (name === "") {
      alert("Please write a name.");
      return;
    }

    if (rating === 0) {
      alert("Please pick a rating.");
      return;
    }

    onAddReview({ name, rating, review, photo });
    setName("");
    setRating(0);
    setReview("");
    setPhoto("");
  }

  return (
    <form className="flex flex-col justify-center" onSubmit={handleSubmit}>
      <section className="flex gap-5 justify-between flex-col sm:flex-row">
        <ImageUpload value={photo} onChange={setPhoto} bucket="site-photos" hint="Not Required"/>
        <section className="flex flex-col w-[100%] sm:w-[50%]">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Add name..."
            className="w-[100%]"
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
          <Button type="submit" className="mt-3">Save Friend Rating</Button>
        </section>
      </section>
    </form>
  );
}