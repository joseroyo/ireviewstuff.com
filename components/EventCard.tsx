"use client"

import { useState } from "react";

type EventCardProps = {
  id: number;
  lifeEvent: string;
  date: string;
  description: string;
  photoUrl: string;
  onDelete?: (id: number) => void;
  onUpdate?: (id: number, newReview: string) => void;
};

export default function EventCard({ id, lifeEvent, date, description, photoUrl, onDelete, onUpdate }: EventCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(description);
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongDesc = description.length > 280;

  function handleDelete() {
    if (!onDelete) return;
    const confirmed = confirm(`Delete your review of "${lifeEvent}"?`);
    if (confirmed) {
      onDelete(id);
    }
  }

  function handleSave() {
    if (editedText === description) {
      setIsEditing(false);
      return;
    }

    const confirmed = confirm("Ready to save these changes?");
    if (!confirmed) return;

    onUpdate?.(id, editedText);
    setIsEditing(false);
  }

  function handleCancel() {
    setEditedText(description);
    setIsEditing(false);
  }

  return (
    <article className="flex gap-4 relative">
      {photoUrl && (
        <img src={photoUrl} alt={`${lifeEvent} photo`} className="h-[100%]" width={200} height={200} />
      )}
      <div className="w-[100%]">
        {onUpdate && (
          <button type="button" onClick={() => setIsEditing(true)} className="absolute right-0 hover:underline">Edit Desc.</button>
        )}
        <h3 className="w-[75%]">{lifeEvent}</h3>
        <p>Date: {date}</p>
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
            {description}
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