"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm, { ReviewSubmission } from "@/components/ReviewForm";
import { useAuth } from "@/components/AuthProvider";
import Window from "@/components/Window";
import { searchGoogleBooks } from "@/lib/media/searchGoogleBooks";
import BackgroundMusic from "@/components/BackgroundMusic";
import { notifySubscribers } from "@/lib/notify";
import Pagination from "@/components/Pagination";

type Review = {
  id: number;
  title: string;
  author: string;
  date: string;
  rating: number;
  review: string;
  coverUrl: string;
};

const PAGE_SIZE = 6;

export default function Books() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { user, isAuthLoading } = useAuth();

  useEffect(() => {
    async function loadReviews() {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("media_type", "book")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load reviews:", error);
        setIsLoading(false);
        return;
      }

      const mapped: Review[] = data.map((row) => ({
        id: row.id,
        title: row.title,
        author: row.artist,
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

  useEffect(() => {
    setCurrentPage(1);
  }, [reviews.length]);

  const totalPages = Math.ceil(reviews.length / PAGE_SIZE);
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

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
        media_type: "book",
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to save review:", error);
      return;
    }

    const newReviewCard: Review = {
      id: inserted.id,
      title: inserted.title,
      author: inserted.artist,
      coverUrl: inserted.image_url,
      date: inserted.date_logged,
      rating: inserted.rating,
      review: inserted.review_text,
    };

    setReviews([newReviewCard, ...reviews]);

    notifySubscribers(
      data.item.title,
      "book review",
      `${window.location.origin}/books`
    );
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
    <main className="px-5 mx-auto flex flex-col items-center w-[100%] 2xl:container">
      <BackgroundMusic pageKey="books" />
      <h1>Book reviews</h1>
      {!isAuthLoading && user && (
        <Window title="Add a Review" className="max-w-[748px] w-[100%] mb-4 lg:mb-0">
          <ReviewForm
            search={searchGoogleBooks}
            searchPlaceholder="Search for a book..."
            onAddReview={addReview}
          />
        </Window>
      )}
      <section className="flex flex-wrap justify-between lg:mt-8 w-[100%] 2xl:container">
        {isLoading ? (
          <p className="my-0 mx-[auto]">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <h2 className="my-0 mx-[auto]">No reviews yet</h2>
        ) : (
          paginatedReviews.map((r) => (
            <Window className="mb-5 w-[100%] md:w-[49%]" key={r.id}>
              <ReviewCard
                id={r.id}
                title={r.title}
                artist={r.author}
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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}