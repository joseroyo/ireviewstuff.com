"use client";

import { useState } from "react";
import Button from "./Button";

export type BlogSubmission = {
  title: string;
  text: string;
};

type BlogFormProps = {
  onAddBlog: (data: BlogSubmission) => void;
};

export default function BlogForm({ onAddBlog }: BlogFormProps) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (text === "") {
      alert("Please write post");
      return;
    }

    onAddBlog({ title, text });
    setTitle("");
    setText("");
  }

  return (
    <form className="flex flex-col justify-center" onSubmit={handleSubmit}>
      <section className="flex gap-5 justify-between">
        <section className="flex flex-col w-[100%]">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add title..."
            className="w-[100%] mb-4"
          />
          <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write post..."
              rows={4}
              className="pr-2"
            />
          <Button type="submit" className="mt-3">Save Post</Button>
        </section>
      </section>
    </form>
  );
}