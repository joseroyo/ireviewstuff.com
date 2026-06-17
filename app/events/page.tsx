"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import EventCard from "@/components/EventCard";
import EventForm, { EventSubmission } from "@/components/EventForm";
import { useAuth } from "@/components/AuthProvider";
import Window from "@/components/Window";

type lifeEventType = {
  id: number;
  lifeEvent: string;
  date: string;
  description: string;
  photoUrl: string;
};

export default function EventRating() {
  const [lifeEvents, setLifeEvents] = useState<lifeEventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
        description: row.description,
        photoUrl: row.photo,
      }));

      setLifeEvents(mapped);
      setIsLoading(false);
    }
    loadLifeEvents();
  }, []);

  async function addLifeEvent(data: EventSubmission) {
    const { data: inserted, error } = await supabase
      .from("life_events")
      .insert({
        life_event: data.lifeEvent,
        date_logged: data.date,
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
      description: inserted.description,
      photoUrl: inserted.photo,
    };

    setLifeEvents([newLifeEventCard, ...lifeEvents]);
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

  async function updateLifeEvent(id: number, newText: string) {
    const { error } = await supabase
      .from("life_events")
      .update({ review_text: newText })
      .eq("id", id);

    if (error) {
      console.error("Failed to update:", error.message, error);
      return;
    }

    setLifeEvents(lifeEvents.map((f) => (f.id === id ? { ...f, review: newText } : f)));
  }

  return (
    <main className="px-5 container mx-auto flex flex-col items-center">
      <h1>Life Events</h1>

      {!isAuthLoading && user && (
        <Window title="Add a Life Event" className="w-[50%]">
          <EventForm onAddReview={addLifeEvent} />
        </Window>
      )}

      <section className="flex flex-wrap justify-between container mt-8">
        {isLoading ? (
          <p className="mx-[auto] my-0">Loading...</p>
        ) : lifeEvents.length === 0 ? (
          <h2 className="mx-[auto] my-0">No life events logged yet.</h2>
        ) : (
          lifeEvents.map((f) => (
            <Window className="mb-5 w-[49%]" key={f.id}>
              <EventCard
                id={f.id}
                lifeEvent={f.lifeEvent}
                date={f.date}
                description={f.description}
                photoUrl={f.photoUrl}
                onDelete={user ? deleteLifeEvent : undefined}
                onUpdate={user ? updateLifeEvent : undefined}
              />
            </Window>
          ))
        )}
      </section>
    </main>
  );
}