"use client";

import { useState } from "react";
import Button from "./Button";
import ImageUpload from "./ImageUpload";
import StarRating from "./StarRating";
import { todayLocal } from "@/lib/utils";

export type EventSubmission = {
  lifeEvent: string;
  date: string;
  rating: number;
  description: string;
  photoUrl: string;
};

type EventFormProps = {
  onAddDescription: (data: EventSubmission) => void;
};

export default function EventForm({ onAddDescription }: EventFormProps) {
  const [lifeEvent, setLifeEvent] = useState("");
  const [date, setDate] = useState(todayLocal());
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (lifeEvent === "") {
      alert("Please write the entry's name/title");
      return;
    }

    if (rating === 0) {
      alert("Please pick a rating.");
      return;
    }

    onAddDescription({ lifeEvent, date, rating, description, photoUrl });
    setLifeEvent("");
    setDate(todayLocal());
    setRating(0);
    setDescription("");
    setPhotoUrl("");
  }

  return (
    <form className="flex flex-col justify-center" onSubmit={handleSubmit}>
      <section className="flex gap-5 justify-between flex-col sm:flex-row">
        <ImageUpload value={photoUrl} onChange={setPhotoUrl} bucket="site-photos" />
        <section className="flex flex-col w-[100%] sm:grow sm:w-[auto]">
          <input
            type="text"
            value={lifeEvent}
            onChange={(e) => setLifeEvent(e.target.value)}
            placeholder="Add entry..."
            className="w-[100%]"
          />
          <input
              type="date"
              value={date}
              className="focus:outline-0 mt-[8px] mb-[-10px]"
              onChange={(e) => setDate(e.target.value)}
            />
          <div>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write more details..."
              rows={5}
              className="pr-2"
            />
          <Button type="submit" className="mt-3">Save Entry</Button>
        </section>
      </section>
    </form>
  );
}