"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import FriendCard from "@/components/FriendCard";
import FriendForm, { FriendSubmission } from "@/components/FriendForm";
import { useAuth } from "@/components/AuthProvider";
import Window from "@/components/Window";

type Friend = {
  id: number;
  name: string;
  rating: number;
  review: string;
  photoUrl: string;
};

export default function FriendRating() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  async function updateFriend(id: number, newText: string) {
    const { error } = await supabase
      .from("friends")
      .update({ review_text: newText })
      .eq("id", id);

    if (error) {
      console.error("Failed to update:", error.message, error);
      return;
    }

    setFriends(friends.map((f) => (f.id === id ? { ...f, review: newText } : f)));
  }

  return (
    <main className="px-5 container mx-auto flex flex-col items-center">
      <h1>Friend Ratings</h1>

      {!isAuthLoading && user && (
        <Window title="Add a Friend Rating" className="w-[50%]">
          <FriendForm onAddReview={addFriend} />
        </Window>
      )}

      <section className="flex flex-wrap justify-between container mt-8">
        {isLoading ? (
          <p className="mx-[auto] my-0">Loading...</p>
        ) : friends.length === 0 ? (
          <h2 className="mx-[auto] my-0">No friends rated yet.</h2>
        ) : (
          friends.map((f) => (
            <Window className="mb-5 w-[49%]" key={f.id}>
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
    </main>
  );
}