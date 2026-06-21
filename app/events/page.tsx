"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import EventCard from "@/components/EventCard";
import EventForm, { EventSubmission } from "@/components/EventForm";
import { useAuth } from "@/components/AuthProvider";
import Window from "@/components/Window";
import BackgroundMusic from "@/components/BackgroundMusic";
import { notifySubscribers } from "@/lib/notify";
import Pagination from "@/components/Pagination";

type lifeEventType = {
  id: number;
  lifeEvent: string;
  date: string;
  rating: number;
  description: string;
  photoUrl: string;
};

const PAGE_SIZE = 6;

export default function EventRating() {
  const [lifeEvents, setLifeEvents] = useState<lifeEventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { user, isAuthLoading } = useAuth();

  useEffect(() => {
    async function loadLifeEvents() {
      const { data, error } = await supabase
        .from("life_events")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load life events:", error.message, error);
        setIsLoading(false);
        return;
      }

      const mapped: lifeEventType[] = data.map((row) => ({
        id: row.id,
        lifeEvent: row.life_event,
        date: row.date_logged,
        rating: row.rating,
        description: row.description,
        photoUrl: row.photo,
      }));

      setLifeEvents(mapped);
      setIsLoading(false);
    }
    loadLifeEvents();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [lifeEvents.length]);

  const totalPages = Math.ceil(lifeEvents.length / PAGE_SIZE);
  const paginatedLifeEvents = lifeEvents.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  async function addLifeEvent(data: EventSubmission) {
    const { data: inserted, error } = await supabase
      .from("life_events")
      .insert({
        life_event: data.lifeEvent,
        date_logged: data.date,
        rating: data.rating,
        description: data.description,
        photo: data.photoUrl,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to save life events:", error.message, error);
      return;
    }

    const newLifeEventCard: lifeEventType = {
      id: inserted.id,
      lifeEvent: inserted.life_event,
      date: inserted.date_logged,
      rating: inserted.rating,
      description: inserted.description,
      photoUrl: inserted.photo,
    };

    setLifeEvents([newLifeEventCard, ...lifeEvents]);

    notifySubscribers(
      data.lifeEvent,
      "life event",
      `${window.location.origin}/events`
    );
  }

  async function deleteLifeEvent(id: number) {
    const { error } = await supabase.from("life_events").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete:", error.message, error);
      alert("Could not delete.");
      return;
    }

    setLifeEvents(lifeEvents.filter((f) => f.id !== id));
  }

  async function updateLifeEvent(id: number, newText: string, newRating: number) {
    const { error } = await supabase
      .from("life_events")
      .update({ description: newText, rating: newRating })
      .eq("id", id);

    if (error) {
      console.error("Failed to update:", error.message, error);
      return;
    }

    setLifeEvents(lifeEvents.map((f) => (f.id === id ? { ...f, description: newText, rating: newRating } : f)));
  }

  return (
    <main className="px-5 mx-auto flex flex-col items-center w-[100%] 2xl:container">
      <BackgroundMusic pageKey="events" />
      <h1>Life Events</h1>

      {!isAuthLoading && user && (
        <Window title="Add a Life Event" className="max-w-[748px] w-[100%] mb-4 lg:mb-0">
          <EventForm onAddDescription={addLifeEvent} />
        </Window>
      )}

      <section className="flex flex-wrap justify-between lg:mt-8 w-[100%] 2xl:container">
        {isLoading ? (
          <p className="mx-[auto] my-0">Loading...</p>
        ) : lifeEvents.length === 0 ? (
          <h2 className="mx-[auto] my-0">No life events logged yet.</h2>
        ) : (
          paginatedLifeEvents.map((f) => (
            <Window className="mb-5 w-[100%] md:w-[49%]" key={f.id}>
              <EventCard
                id={f.id}
                lifeEvent={f.lifeEvent}
                date={f.date}
                rating={f.rating}
                description={f.description}
                photoUrl={f.photoUrl}
                onDelete={user ? deleteLifeEvent : undefined}
                onUpdate={user ? updateLifeEvent : undefined}
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