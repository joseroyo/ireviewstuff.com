"use client"

import { useState } from "react";

type FriendCardProps = {
  id: number;
  name: string;
  rating: number;
  review: string;
  photoUrl: string;
  onDelete?: (id: number) => void;
  onUpdate?: (id: number, newReview: string) => void;
};

export default function FriendCard({ id, name, rating, review, photoUrl, onDelete, onUpdate }: FriendCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(review);
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongReview = review.length > 280;

  function handleDelete() {
    if (!onDelete) return;
    const confirmed = confirm(`Delete your review of "${name}"?`);
    if (confirmed) {
      onDelete(id);
    }
  }

  function handleSave() {
    if (editedText === review) {
      setIsEditing(false);
      return;
    }

    const confirmed = confirm("Ready to save these changes?");
    if (!confirmed) return;

    onUpdate?.(id, editedText);
    setIsEditing(false);
  }

  function handleCancel() {
    setEditedText(review);
    setIsEditing(false);
  }

  return (
    <article className="flex gap-4 relative">
      {photoUrl && (
        <img src={photoUrl} alt={`${name} photo`} className="h-[100%]" width={200} height={200} />
      )}
      <div className="w-[100%]">
        {onUpdate && (
          <button type="button" onClick={() => setIsEditing(true)} className="absolute right-0 hover:underline">Edit review</button>
        )}
        <h3 className="w-[75%]">{name}</h3>
        <p className="text-[25px]">
          {"★".repeat(rating)}
          <span className="text-lowlight">{"★".repeat(5 - rating)}</span>
        </p>
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
          <p className={!isExpanded && isLongReview ? "line-clamp-5" : ""}>
            {review}
          </p>
        )}
        {isLongReview && !isEditing && (
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