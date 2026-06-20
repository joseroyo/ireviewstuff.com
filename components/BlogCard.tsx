"use client"

import { useState } from "react";

type BlogCardProps = {
  id: number;
  title: string;
  text: string;
  onDelete?: (id: number) => void;
  onUpdate?: (id: number, newTitle: string, newText: string) => void;
};

export default function BlogCard({ id, title, text, onDelete, onUpdate }: BlogCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedText, setEditedText] = useState(text);
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongDesc = text.length > 1000;

  function handleDelete() {
    if (!onDelete) return;
    const confirmed = confirm("Delete your post?");
    if (confirmed) {
      onDelete(id);
    }
  }

  function handleSave() {
    if ((editedTitle === title) && (editedText === text)) {
      setIsEditing(false);
      return;
    }

    const confirmed = confirm("Ready to save these changes?");
    if (!confirmed) return;

    onUpdate?.(id, editedTitle, editedText);
    setIsEditing(false);
  }

  function handleCancel() {
    setEditedTitle(title);
    setEditedText(text);
    setIsEditing(false);
  }

  return (
    <article className="flex gap-4 relative">
      <div className="w-[100%]">
        {onUpdate && (
          <button type="button" onClick={() => setIsEditing(true)} className="absolute right-0 bottom-0 text-primary hover:underline">Edit Post</button>
        )}
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            placeholder="Add title..."
            className="w-[100%]"
          />
        ) : (
          <h3 className="w-[100%]">{title}</h3>
        )}
        {isEditing ? (
          <div className="flex flex-col mt-1">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              rows={5}
              className="pr-2"
            />
            <article className="flex justify-between mt-3">
              <button type="button" onClick={handleCancel} className="hover:underline">Cancel</button>
              <button type="button" onClick={handleSave} className="hover:underline">Save</button>
            </article>
          </div>
        ) : (
          <p className={!isExpanded && isLongDesc ? "line-clamp-5" : ""}>
            {text}
          </p>
        )}
        {isLongDesc && !isEditing && (
          <button type="button" onClick={() => setIsExpanded(!isExpanded)} className="text-pink-strong underline">
            {isExpanded ? "Read less" : "Read more"}
          </button>
        )}
      </div>
      {onDelete && (
        <button type="button" className="absolute right-[-23px] top-[-59px] border-0 px-4 py-2 cursor-pointer" onClick={handleDelete}>x</button>
      )}
    </article>
  );
}