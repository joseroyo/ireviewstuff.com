"use client"

import { useState } from "react";
import StarRating from "./StarRating";
import StarDisplay from "./StarDisplay";

type FriendCardProps = {
  id: number;
  name: string;
  rating: number;
  review: string;
  photoUrl: string;
  onDelete?: (id: number) => void;
  onUpdate?: (id: number, newReview: string, newRating: number) => void;
};

export default function FriendCard({ id, name, rating, review, photoUrl, onDelete, onUpdate }: FriendCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(review);
  const [editedRating, setEditedRating] = useState(rating);
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
    if ((editedText === review) && (editedRating === rating)) {
      setIsEditing(false);
      return;
    }

    const confirmed = confirm("Ready to save these changes?");
    if (!confirmed) return;

    onUpdate?.(id, editedText, editedRating);
    setIsEditing(false);
  }

  function handleCancel() {
    setEditedText(review);
    setEditedRating(rating);
    setIsEditing(false);
  }

  return (
    <article className="flex gap-4 relative">
      {photoUrl && (
        <img src={photoUrl} alt={`${name} photo big card`} className="hidden w-[200px] h-[100%] sm:block md:hidden lg:w-[150px] lg:block xl:w-[200px]" width={200} height={200} loading="lazy" />
      )}
      <div className="w-[100%]">
        {onUpdate && !isEditing && (
          <button type="button" onClick={() => setIsEditing(true)} className="absolute right-0 bottom-[-5px] text-primary hover:underline">Edit</button>
        )}
        <div className="flex">
          <img src={photoUrl} alt={`${name} photo small card`} className="w-[100px] h-[100%] mr-4 sm:hidden md:block lg:hidden" width={100} height={100} loading="lazy" />
          <div>
            <h3>{name}</h3>
            {isEditing ? (
              <div>
                <StarRating value={editedRating} onChange={setEditedRating} />
              </div>
            ) : (
              <StarDisplay value={rating} />
            )}
          </div>
        </div>
        <div className="mt-[10px] sm:mt-0 md:mt-[10px] lg:mt-0">
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
            <p className={!isExpanded && isLongReview ? "line-clamp-3 sm:line-clamp-5" : ""}>
              {review}
            </p>
          )}
          {isLongReview && !isEditing && (
            <button type="button" onClick={() => setIsExpanded(!isExpanded)} className="text-pink-strong underline">
              {isExpanded ? "Read less" : "Read more"}
            </button>
          )}
        </div>
      </div>
      {onDelete && (
        <button type="button" className="absolute right-[-23px] top-[-59px] border-0 px-4 py-2 cursor-pointer" onClick={handleDelete}>x</button>
      )}
    </article>
  );
}