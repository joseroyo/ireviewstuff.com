"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import Window from "@/components/Window";
import DiaryGate from "@/components/DiaryGate";
import DiaryPasswordChange from "@/components/DiaryPasswordChange";
import EventForm, { EventSubmission } from "@/components/EventForm";
import DiaryCard from "@/components/DiaryCard";
import Pagination from "@/components/Pagination";
import BackgroundMusic from "@/components/BackgroundMusic"; 
import Button from "@/components/Button";
import { redirect } from 'next/navigation';

type DiaryPost = {
  id: number;
  title: string;
  text: string;
  photo: string;
  rating: number;
  date: string;
};

const PAGE_SIZE = 4;

export default function Diary() {
  redirect('/404');

  return (
    <main className="px-5 mx-auto flex flex-col items-center w-[100%] 2xl:container">
      <BackgroundMusic pageKey="diary" />
      <h1>Diary</h1>
      <DiaryGate>
        <DiaryContent />
      </DiaryGate>
    </main>
  );
}

function DiaryContent() {
  const [posts, setPosts] = useState<DiaryPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const { user, isAuthLoading } = useAuth();

  useEffect(() => {
    async function loadPosts() {
      if (user) {
        
        const { data, error } = await supabase
          .from("diary")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) setPosts(data);
      } else {
        const response = await fetch("/api/diary/posts");
        if (response.ok) {
          const { posts } = await response.json();
          setPosts(posts);
        }
      }
      setIsLoading(false);
    }

    if (!isAuthLoading) loadPosts();
  }, [user, isAuthLoading]);

  useEffect(() => {
    setCurrentPage(1);
  }, [posts.length]);

  const totalPages = Math.ceil(posts.length / PAGE_SIZE);
  const paginatedEntries = posts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  async function addDiary(data: EventSubmission) {
    const { data: inserted, error } = await supabase
      .from("diary")
      .insert({
        title: data.lifeEvent,
        date: data.date,
        rating: data.rating,
        text: data.description,
        photo: data.photoUrl,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to save diary entry:", error.message, error);
      return;
    }

    const newDiaryEntry: DiaryPost = {
      id: inserted.id,
      title: inserted.title,
      date: inserted.date,
      rating: inserted.rating,
      text: inserted.text,
      photo: inserted.photo,
    };

    setPosts([newDiaryEntry, ...posts]);
  }

  async function deleteDiary(id: number) {
    const entry = posts.find((p) => p.id === id);
    if (!entry) return;

    const { error } = await supabase.from("diary").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete:", error.message, error);
      alert("Could not delete.");
      return;
    }

    if (entry.photo) {
      const filename = entry.photo.split("/").pop();
      if (filename) {
        const { data: { session } } = await supabase.auth.getSession();
        await fetch("/api/delete-storage-file", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ bucket: "site-photos", filename }),
        });
      }
    }

    setPosts(posts.filter((f) => f.id !== id));
  }

  async function updateDiary(id: number, newText: string, newRating: number) {
    const { error } = await supabase
      .from("diary")
      .update({ text: newText, rating: newRating })
      .eq("id", id);

    if (error) {
      console.error("Failed to update:", error.message, error);
      return;
    }

    setPosts(posts.map((f) => (f.id === id ? { ...f, text: newText, rating: newRating } : f)));
  }

  return (
    <>
      {user && (
        <>
          <Button
              variant="secondary"
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="fixed bottom-16 right-4 flex gap-2 items-center z-10"
            >
              {showPasswordChange ? "Hide password change" : "Change diary password"}
          </Button>
          {showPasswordChange && <DiaryPasswordChange />}
          <Window title="Add a Diary Entry" className="max-w-[748px] w-[100%] mb-4 lg:mb-8">
            <EventForm onAddDescription={addDiary} />
          </Window>
        </>
      )}

      {isLoading ? (
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        <>
          <section className="flex flex-wrap justify-between w-[100%] 2xl:container">
            {paginatedEntries.map((p) => (
              <Window key={p.id} className="mb-5 w-[100%] md:w-[49%]">
                <DiaryCard
                  id={p.id}
                  title={p.title}
                  text={p.text}
                  photo={p.photo}
                  rating={p.rating}
                  date={p.date}
                  onDelete={user ? deleteDiary : undefined}
                  onUpdate={user ? updateDiary : undefined}
                />
              </Window>
            ))}
          </section>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </>
  );
}