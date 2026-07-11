"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthProvider";
import Button from "./Button";

type Comment = {
  id: number;
  name: string;
  text: string;
  createdAt: string;
  parentCommentId: number | null;
};

type CommentsProps = {
  parentType: "reviews" | "friends" | "life_events";
  parentId: number;
};

export default function Comments({ parentType, parentId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [count, setCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    async function loadCount() {
      const { count } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("parent_type", parentType)
        .eq("parent_id", parentId);
      setCount(count ?? 0);
    }
    loadCount();
  }, [parentType, parentId]);

  async function toggleExpanded() {
    if (!isExpanded && comments.length === 0) {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("parent_type", parentType)
        .eq("parent_id", parentId)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setComments(data.map((c) => ({
          id: c.id,
          name: c.name,
          text: c.text,
          createdAt: c.created_at,
          parentCommentId: c.parent_comment_id,
        })));
      }
      setIsLoading(false);
    }
    setIsExpanded(!isExpanded);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    setIsSubmitting(true);
    const { data, error } = await supabase
      .from("comments")
      .insert({ parent_type: parentType, parent_id: parentId, name, text, parent_comment_id: null })
      .select()
      .single();

    setIsSubmitting(false);

    if (error || !data) return;

    fetch("/api/notify-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, text, parentType, parentId }),
    }).catch(() => {});

    setComments([...comments, {
      id: data.id,
      name: data.name,
      text: data.text,
      createdAt: data.created_at,
      parentCommentId: null,
    }]);
    setCount(count + 1);
    setName("");
    setText("");
  }

  async function handleReplySubmit(parentCommentId: number) {
    if (!replyText.trim() || !user) return;

    setIsReplying(true);
    const { data, error } = await supabase
      .from("comments")
      .insert({
        parent_type: parentType,
        parent_id: parentId,
        parent_comment_id: parentCommentId,
        name: "Paul",
        text: replyText,
      })
      .select()
      .single();

    setIsReplying(false);
    if (error || !data) return;

    setComments([...comments, {
      id: data.id,
      name: data.name,
      text: data.text,
      createdAt: data.created_at,
      parentCommentId: data.parent_comment_id,
    }]);
    setCount(count + 1);
    setReplyText("");
    setReplyingTo(null);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this comment?")) return;
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (!error) {
      const removed = comments.filter((c) => c.id === id || c.parentCommentId === id).length;
      setComments(comments.filter((c) => c.id !== id && c.parentCommentId !== id));
      setCount(count - removed);
    }
  }

  const topLevel = comments.filter((c) => c.parentCommentId === null);
  const repliesByParent = comments.reduce((acc, c) => {
    if (c.parentCommentId !== null) {
      if (!acc[c.parentCommentId]) acc[c.parentCommentId] = [];
      acc[c.parentCommentId].push(c);
    }
    return acc;
  }, {} as Record<number, Comment[]>);

  return (
    <div>
      <button
        type="button"
        onClick={toggleExpanded}
        className="text-pink-strong hover:underline"
      >
        {isExpanded && "Hide"} Comments {count > 0 && `(${count})`}
      </button>

      {isExpanded && (
        <div className="mt-2">
          {isLoading && <p>Loading...</p>}

          {!isLoading && topLevel.length === 0 && (
            <p>No comments yet, be the first!</p>
          )}

          <ul>
            {topLevel.map((c) => (
              <li key={c.id} className="py-3 border-dotted border-b-1 first:border-t-1">
                <div>
                  <strong>{c.name}:</strong> {c.text}
                  {user && (
                    <>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      className="ml-3 text-red-500 underline"
                    >
                      X
                    </button>
                    <div>
                      <button
                        type="button"
                        onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
                        className="text-pink-strong underline"
                      >
                        Reply
                      </button>
                    </div>
                    </>
                  )}
                </div>

                {repliesByParent[c.id]?.map((reply) => (
                  <div key={reply.id} className="ml-6 mt-2">
                    <strong>{reply.name}:</strong> {reply.text}
                    {user && (
                      <button
                        type="button"
                        onClick={() => handleDelete(reply.id)}
                        className="ml-3 text-red-500 underline"
                      >
                        X
                      </button>
                    )}
                  </div>
                ))}

                {replyingTo === c.id && (
                  <div className="ml-6 mt-2 flex flex-col gap-2">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Your reply"
                      maxLength={500}
                      rows={2}
                      required
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={() => handleReplySubmit(c.id)}
                        disabled={isReplying}
                      >
                        {isReplying ? "Posting..." : "Post Reply"}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              maxLength={50}
              required
            />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Your comment"
              maxLength={500}
              rows={2}
              required
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}