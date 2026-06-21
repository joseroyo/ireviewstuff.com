"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import FriendCard from "@/components/FriendCard";
import FriendForm, { FriendSubmission } from "@/components/FriendForm";
import { useAuth } from "@/components/AuthProvider";
import Window from "@/components/Window";
import BackgroundMusic from "@/components/BackgroundMusic";
import { notifySubscribers } from "@/lib/notify";
import Pagination from "@/components/Pagination";

type Friend = {
  id: number;
  name: string;
  rating: number;
  review: string;
  photoUrl: string;
};

const PAGE_SIZE = 6;

export default function FriendRating() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { user, isAuthLoading } = useAuth();

  useEffect(() => {
    async function loadFriends() {
      const { data, error } = await supabase
        .from("friends")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load friends:", error.message, error);
        setIsLoading(false);
        return;
      }

      const mapped: Friend[] = data.map((row) => ({
        id: row.id,
        name: row.name,
        rating: row.rating,
        review: row.review_text,
        photoUrl: row.photo,
      }));

      setFriends(mapped);
      setIsLoading(false);
    }
    loadFriends();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [friends.length]);

  const totalPages = Math.ceil(friends.length / PAGE_SIZE);
  const paginatedFriends = friends.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  async function addFriend(data: FriendSubmission) {
    const { data: inserted, error } = await supabase
      .from("friends")
      .insert({
        name: data.name,
        rating: data.rating,
        review_text: data.review,
        photo: data.photo,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to save friend:", error.message, error);
      return;
    }

    const newFriendCard: Friend = {
      id: inserted.id,
      name: inserted.name,
      rating: inserted.rating,
      review: inserted.review_text,
      photoUrl: inserted.photo,
    };

    setFriends([newFriendCard, ...friends]);

    notifySubscribers(
      data.name,
      "friend rating",
      `${window.location.origin}/friends`
    );
  }

  async function deleteFriend(id: number) {
    const { error } = await supabase.from("friends").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete:", error.message, error);
      alert("Could not delete.");
      return;
    }

    setFriends(friends.filter((f) => f.id !== id));
  }

  async function updateFriend(id: number, newText: string, newRating: number) {
    const { error } = await supabase
      .from("friends")
      .update({ review_text: newText, rating: newRating })
      .eq("id", id);

    if (error) {
      console.error("Failed to update:", error.message, error);
      return;
    }

    setFriends(friends.map((f) => (f.id === id ? { ...f, review: newText, rating: newRating } : f)));
  }

  return (
    <main className="px-5 mx-auto flex flex-col items-center w-[100%] 2xl:container">
      <BackgroundMusic pageKey="friends" />
      <h1>Friends Reviews</h1>

      {!isAuthLoading && user && (
        <Window title="Add a Friend Rating" className="max-w-[748px] w-[100%] mb-4 lg:mb-0">
          <FriendForm onAddReview={addFriend} />
        </Window>
      )}

      <section className="flex flex-wrap justify-between lg:mt-8 w-[100%] 2xl:container">
        {isLoading ? (
          <p className="mx-[auto] my-0">Loading...</p>
        ) : friends.length === 0 ? (
          <h2 className="mx-[auto] my-0">No friends rated yet.</h2>
        ) : (
          paginatedFriends.map((f) => (
            <Window className="mb-5 w-[100%] md:w-[49%]" key={f.id}>
              <FriendCard
                id={f.id}
                name={f.name}
                rating={f.rating}
                review={f.review}
                photoUrl={f.photoUrl}
                onDelete={user ? deleteFriend : undefined}
                onUpdate={user ? updateFriend : undefined}
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