"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm, { ReviewSubmission } from "@/components/ReviewForm";
import { useAuth } from "@/components/AuthProvider";
import Window from "@/components/Window";
import { searchItunes } from "@/lib/media/searchItunes";
import BackgroundMusic from "@/components/BackgroundMusic";

type Review = {
  id: number;
  album: string;
  artist: string;
  date: string;
  rating: number;
  review: string;
  coverUrl: string;
};

export default function Music() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthLoading } = useAuth();

  useEffect(() => {
    async function loadReviews() {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("media_type", "music")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load reviews:", error);
        setIsLoading(false);
        return;
      }

      const mapped: Review[] = data.map((row) => ({
        id: row.id,
        album: row.title,
        artist: row.artist,
        coverUrl: row.image_url,
        date: row.date_logged,
        rating: row.rating,
        review: row.review_text,
      }));

      setReviews(mapped);
      setIsLoading(false);
    }

    loadReviews();
  }, []);

  async function addReview(data: ReviewSubmission) {
    const { data: inserted, error } = await supabase
      .from("reviews")
      .insert({
        title: data.item.title,
        artist: data.item.artist,      
        image_url: data.item.imageUrl,
        date_logged: data.date,
        rating: data.rating,
        review_text: data.review,
        media_type: "music",
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to save review:", error);
      return;
    }

    const newReviewCard: Review = {
      id: inserted.id,
      album: inserted.title,
      artist: inserted.artist,
      coverUrl: inserted.image_url,
      date: inserted.date_logged,
      rating: inserted.rating,
      review: inserted.review_text,
    };

    setReviews([newReviewCard, ...reviews]);
  }

  async function deleteReview(id: number) {
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete:", error);
      alert("Could not delete review.");
      return;
    }

    setReviews(reviews.filter((r) => r.id !== id));
  }

  async function updateReview(id: number, newText: string, newRating: number) {
    const { error } = await supabase
      .from("reviews")
      .update({ review_text: newText, rating: newRating })
      .eq("id", id);

    if (error) {
      console.error("Failed to update:", error.message, error);
      return;
    }

    setReviews(reviews.map((r) => (r.id === id ? { ...r, review: newText, rating: newRating } : r)));
  }

  return (
    <main className="px-5 container mx-auto flex flex-col items-center">
      <BackgroundMusic pageKey="music" />
      <h1>Music reviews</h1>
      {!isAuthLoading && user && (
        <Window title="Add a Review" className="w-[50%]">
          <ReviewForm
            search={searchItunes}
            searchPlaceholder="Search for an album..."
            onAddReview={addReview}
          />
        </Window>
      )}
      <section className="flex flex-wrap justify-between container mt-8">
        {isLoading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet. Add one above!</p>
        ) : (
          reviews.map((r) => (
            <Window className="mb-5 w-[49%]" key={r.id}>
              <ReviewCard
                id={r.id}
                title={r.album}
                artist={r.artist}
                date={r.date}
                rating={r.rating}
                review={r.review}
                imageUrl={r.coverUrl}
                onDelete={user ? deleteReview : undefined}
                onUpdate={user ? updateReview : undefined}
              />
            </Window>
          ))
        )}
      </section>
    </main>
  );
}