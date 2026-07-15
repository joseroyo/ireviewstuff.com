"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ArticleCard from "@/components/ArticleCard";
import ArticleForm, { ArticleSubmission } from "@/components/ArticleForm";
import { useAuth } from "@/components/AuthProvider";
import Window from "@/components/Window";
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
  previewUrl: string;
  articleUrl: string;
};

const PAGE_SIZE = 4;

export default function Articles() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { user, isAuthLoading } = useAuth();

  useEffect(() => {
    async function loadReviews() {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("media_type", "article")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load reviews:", error);
        setIsLoading(false);
        return;
      }

      const mapped: Review[] = data.map((row) => ({
        id: row.id,
        title: row.title,
        author: "",
        previewUrl: row.image_url,
        date: row.date_logged,
        rating: row.rating,
        review: row.review_text,
        articleUrl: row.article_url,
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

  async function addReview(data: ArticleSubmission) {
    const { data: inserted, error } = await supabase
      .from("reviews")
      .insert({
        title: data.title,
        image_url: data.previewUrl,
        article_url: data.articleUrl,
        date_logged: data.date,
        rating: data.rating,
        review_text: data.text,
        media_type: "article",
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
      previewUrl: inserted.image_url,
      date: inserted.date_logged,
      rating: inserted.rating,
      review: inserted.review_text,
      articleUrl: inserted.article_url,
    };

    setReviews([newReviewCard, ...reviews]);

    notifySubscribers(
      data.title,
      "article review",
      `${window.location.origin}/articles`
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
      <BackgroundMusic pageKey="articles" />
      <h1>Article reviews</h1>
      {!isAuthLoading && user && (
        <Window title="Add a Review" className="max-w-[748px] w-[100%] mb-4 lg:mb-8">
          <ArticleForm onAddReview={addReview} />
        </Window>
      )}
      <section className="flex flex-wrap justify-between w-[100%] 2xl:container">
        {isLoading ? (
          <p className="my-0 mx-[auto]">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <h2 className="my-0 mx-[auto]">No reviews yet</h2>
        ) : (
          paginatedReviews.map((r) => (
            <Window className="mb-5 w-[100%] md:w-[49%]" key={r.id}>
              <ArticleCard
                id={r.id}
                title={r.title}
                date={r.date}
                rating={r.rating}
                text={r.review}
                previewUrl={r.previewUrl}
                articleUrl={r.articleUrl}
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