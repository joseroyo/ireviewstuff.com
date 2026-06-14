"use client";

import { useState } from "react";

type StarRatingProps = {
  value: number;
  onChange: (newRating: number) => void;
};

export default function StarRating({ value, onChange }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  return (
    <div
      className="flex gap-1 mb-2"
      onMouseLeave={() => setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((starNumber) => {
        const isLit = hovered
          ? starNumber <= hovered
          : starNumber <= value;

        return (
          <button
            key={starNumber}
            type="button"
            onClick={() => onChange(starNumber === value ? 0 : starNumber)}
            onMouseEnter={() => setHovered(starNumber)}
            className={`text-[40px] leading-none cursor-pointer transition-colors ${
              isLit ? "text-primary" : "text-lowlight"
            }`}
            aria-label={`Rate ${starNumber} out of 5`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}