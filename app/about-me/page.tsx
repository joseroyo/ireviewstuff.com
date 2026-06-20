"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import BlogCard from "@/components/BlogCard";
import BlogForm, { BlogSubmission } from "@/components/BlogForm";
import { useAuth } from "@/components/AuthProvider";
import Window from "@/components/Window";
import BackgroundMusic from "@/components/BackgroundMusic";

type BlogType = {
  id: number;
  title: string;
  text: string;
};

export default function AboutMe() {
  const [Blogs, setBlogs] = useState<BlogType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthLoading } = useAuth();

  useEffect(() => {
    async function loadBlogs() {
      const { data, error } = await supabase
        .from("about_me")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load post:", error.message, error);
        setIsLoading(false);
        return;
      }

      const mapped: BlogType[] = data.map((row) => ({
        id: row.id,
        title: row.title,
        text: row.text,
      }));

      setBlogs(mapped);
      setIsLoading(false);
    }
    loadBlogs();
  }, []);

  async function addBlog(data: BlogSubmission) {
    const { data: inserted, error } = await supabase
      .from("about_me")
      .insert({
        title: data.title,
        text: data.text,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to save post:", error.message, error);
      return;
    }

    const newBlogCard: BlogType = {
      id: inserted.id,
      title: inserted.title,
      text: inserted.text,
    };

    setBlogs([newBlogCard, ...Blogs]);
  }

  async function deleteBlog(id: number) {
    const { error } = await supabase.from("about_me").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete:", error.message, error);
      alert("Could not delete.");
      return;
    }

    setBlogs(Blogs.filter((f) => f.id !== id));
  }

  async function updateBlog(id: number, newTitle: string, newText: string) {
    const { error } = await supabase
      .from("about_me")
      .update({ title: newTitle, text: newText })
      .eq("id", id);

    if (error) {
      console.error("Failed to update:", error.message, error);
      return;
    }

    setBlogs(Blogs.map((f) => (f.id === id ? { ...f, title: newTitle, text: newText } : f)));
  }

  return (
    <main className="px-5 container mx-auto flex flex-col items-center">
      <BackgroundMusic pageKey="about-me" />
      <h1>About Me!</h1>

      {!isAuthLoading && user && (
        <Window title="Add a Post!" className="w-[50%]">
          <BlogForm onAddBlog={addBlog} />
        </Window>
      )}

      <section className="flex flex-wrap justify-between container mt-8">
        {isLoading ? (
          <p className="mx-[auto] my-0">Loading...</p>
        ) : Blogs.length === 0 ? (
          <h2 className="mx-[auto] my-0">No posts yet.</h2>
        ) : (
          Blogs.map((f) => (
            <Window className="mb-5 w-[49%] h-fit" key={f.id} draggable>
              <BlogCard
                id={f.id}
                title={f.title}
                text={f.text}
                onDelete={user ? deleteBlog : undefined}
                onUpdate={user ? updateBlog : undefined}
              />
            </Window>
          ))
        )}
      </section>
    </main>
  );
}