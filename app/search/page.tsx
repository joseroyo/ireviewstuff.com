"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ReviewCard from "@/components/ReviewCard";
import EventCard from "@/components/EventCard";
import FriendCard from "@/components/FriendCard";
import Window from "@/components/Window";
import BackgroundMusic from "@/components/BackgroundMusic";
import Pagination from "@/components/Pagination";
import StarRating from "@/components/StarRating";

type SearchResult = { type: "review"; data: any; mediaType: string } | { type: "friend"; data: any } | { type: "event"; data: any };

const PAGE_SIZE = 4;

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (query.trim() === "" && rating === 0) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);

      let reviewsQuery = supabase.from("reviews").select("*").limit(6);
      let friendsQuery = supabase.from("friends").select("*").limit(6);
      let eventsQuery = supabase.from("life_events").select("*").limit(6);

      if (query.trim()) {
        reviewsQuery = reviewsQuery.or(`title.ilike.%${query}%,artist.ilike.%${query}%`);
        friendsQuery = friendsQuery.ilike("name", `%${query}%`);
        eventsQuery = eventsQuery.ilike("life_event", `%${query}%`);
      }

      if (rating > 0) {
        reviewsQuery = reviewsQuery.eq("rating", rating);
        friendsQuery = friendsQuery.eq("rating", rating);
        eventsQuery = eventsQuery.eq("rating", rating);
      }

      const [reviewsRes, friendsRes, lifeEventRes] = await Promise.all([
        reviewsQuery,
        friendsQuery,
        eventsQuery,
      ]);

      const reviews: SearchResult[] = (reviewsRes.data || []).map((r) => ({
        type: "review",
        data: r,
        mediaType: r.media_type,
      }));

      const friends: SearchResult[] = (friendsRes.data || []).map((f) => ({
        type: "friend",
        data: f,
      }));

      const life_events: SearchResult[] = (lifeEventRes.data || []).map((f) => ({
        type: "event",
        data: f,
      }));

      setResults([...reviews, ...friends, ...life_events]);
      setIsLoading(false);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query, rating]);

    useEffect(() => {
      setCurrentPage(1);
    }, [results.length]);
  
    const totalPages = Math.ceil(results.length / PAGE_SIZE);
    const paginatedReviews = results.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE
    );

  return (
    <main className="px-5 mx-auto flex flex-col items-center w-[100%] 2xl:container">
      <BackgroundMusic pageKey="search" />
      <h1>Search</h1>
      <Window className="max-w-[748px] w-[100%] mb-4 lg:mb-0">
        <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="..."
            className="w-[100%]"
        />
        <div className="flex items-center gap-4 mt-1">
          <StarRating value={rating} onChange={setRating} />
          <button type="button" onClick={() => setRating(0)}>x</button>
        </div>
      </Window>
      {isLoading && <p>Searching...</p>}
      {!isLoading && query && results.length === 0 && (
        <p>No results for "{query}"</p>
      )}
      <section className="flex flex-wrap justify-between mt-8 w-[100%] 2xl:container">
        {paginatedReviews.map((result) =>
          result.type === "review" ? (
            <Window className="mb-5 w-[100%] md:w-[49%]" key={`r-${result.data.id}`}>
              <ReviewCard
                id={result.data.id}
                title={result.data.title}
                artist={result.data.artist}
                date={result.data.date_logged}
                rating={result.data.rating}
                review={result.data.review_text}
                imageUrl={result.data.image_url}
              />
            </Window>
          ) : result.type === "friend" ? (
            <Window className="mb-5 w-[100%] md:w-[49%]" key={`f-${result.data.id}`}>
              <FriendCard
                id={result.data.id}
                name={result.data.name}
                rating={result.data.rating}
                review={result.data.review_text}
                photoUrl={result.data.photo}
              />
            </Window>
          ) : (
            <Window className="mb-5 w-[100%] md:w-[49%]" key={`e-${result.data.id}`}>
              <EventCard
                id={result.data.id}
                lifeEvent={result.data.life_event}
                date={result.data.date_logged}
                rating={result.data.rating}
                description={result.data.description}
                photoUrl={result.data.photo}
              />
            </Window>
          )
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