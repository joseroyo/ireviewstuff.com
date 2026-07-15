"use client";

import { useState } from "react";
import Button from "./Button";
import StarRating from "./StarRating";
import { todayLocal } from "@/lib/utils";

export type ArticleSubmission = {
  title: string;
  date: string;
  rating: number;
  text: string;
  previewUrl: string;
  articleUrl: string;
};

type EventFormProps = {
  onAddReview: (data: ArticleSubmission) => void;
};

export default function ArticleForm({ onAddReview }: EventFormProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(todayLocal());
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [articleUrl, setArticleUrl] = useState("");

  async function fetchPreview() {
    if (!articleUrl) return;
    const response = await fetch("/api/fetch-page-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: articleUrl }),
    });
    const data = await response.json();
    if (response.ok) {
      setPreviewUrl(data.image || "");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (title === "") {
      alert("Please write the article's name");
      return;
    }

    if (articleUrl === "") {
      alert("Please enter the article's URL");
      return;
    }

    if (rating === 0) {
      alert("Please pick a rating.");
      return;
    }

    onAddReview({ title, date, rating, text, previewUrl, articleUrl });
    setTitle("");
    setDate(todayLocal());
    setRating(0);
    setText("");
    setPreviewUrl("");
    setArticleUrl("");
  }

  return (
    <form className="flex flex-col justify-center" onSubmit={handleSubmit}>
      <section className="flex gap-5 justify-between flex-col sm:flex-row">
        <section className="flex flex-col w-[100%] sm:grow sm:w-[auto]">
          <div className="mb-2 flex items-center">
            <input
              type="url"
              value={articleUrl}
              onChange={(e) => {
                setArticleUrl(e.target.value)
                if (e.target.value === "") setPreviewUrl("");
              }}
              onBlur={fetchPreview}
              placeholder="Add URL..."
              className="text-s grow"
            />
            {previewUrl && (
              <img src={previewUrl} alt="Preview" className="w-[100px] ml-5" width={100} />
            )}
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add Title..."
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
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add review..."
              rows={4}
              className="pr-2"
            />
          <Button type="submit" className="mt-3">Save Entry</Button>
        </section>
      </section>
    </form>
  );
}