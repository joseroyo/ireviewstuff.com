"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";
import { useAuth } from "@/components/AuthProvider";
import Window from "@/components/Window";

type Review = {
  id: number;
  album: string;
  artist: string;
  date: string;
  rating: number;
  review: string;
  coverUrl: string;
};
type NewReview = Omit<Review, "id">;

export default function Music() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthLoading } = useAuth();

  useEffect(() => {
    async function loadReviews() {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load reviews:", error);
        setIsLoading(false);
        return;
      }

      const mapped: Review[] = data.map((row) => ({
        id: row.id,
        album: row.album,
        artist: row.artist,
        coverUrl: row.cover_url,
        date: row.listened_on,
        rating: row.rating,
        review: row.review_text,
      }));

      setReviews(mapped);
      setIsLoading(false);
    }

    loadReviews();
  }, []);

  async function addReview(newReview: NewReview) {
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        album: newReview.album,
        artist: newReview.artist,
        cover_url: newReview.coverUrl,
        listened_on: newReview.date,
        rating: newReview.rating,
        review_text: newReview.review,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to save review:", error);
      alert("Could not save review. Check the console.");
      return;
    }

    const inserted: Review = {
      id: data.id,
      album: data.album,
      artist: data.artist,
      coverUrl: data.cover_url,
      date: data.listened_on,
      rating: data.rating,
      review: data.review_text,
    };

    setReviews([inserted, ...reviews]);
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

  return (
    <main className="px-5 container mx-auto flex flex-col items-center">
      <h1 className="text-center mb-3">Music Reviews</h1>
      {!isAuthLoading && user && (
        <Window title="Add a Review" className="w-[50%]">
          <ReviewForm onAddReview={addReview} />
        </Window>
      )}
      <section className="flex flex-col container my-7">
        {isLoading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet. Add one above!</p>
        ) : (
          reviews.map((r, index) => (
            <ReviewCard
              key={index}
              id={r.id}
              album={r.album}
              artist={r.artist}
              date={r.date}
              rating={r.rating}
              review={r.review}
              coverUrl={r.coverUrl}
              onDelete={user ? deleteReview : undefined}
            />
          ))
        )}
      </section>
    </main>
  );
}