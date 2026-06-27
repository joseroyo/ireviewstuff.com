"use client";

import { useState, useEffect, useRef } from "react";
import StarRating from "@/components/StarRating";
import StarDisplay from "@/components/StarDisplay";
import Button from "@/components/Button";
import Window from "@/components/Window";
import SparkleBurst from "@/components/SparkleBurst";

const LOCKED_RATING = 5;
const LOCKED_TEXT = "BEST PERSON EVER!!";

export default function ReviewMe() {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [burstRect, setBurstRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (localStorage.getItem("reviewMe-submitted") === "true") {
      setRating(LOCKED_RATING);
      setText(LOCKED_TEXT);
      setHasSubmitted(true);
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRating(LOCKED_RATING);
    setText(LOCKED_TEXT);
    setHasSubmitted(true);
    localStorage.setItem("reviewMe-submitted", "true");

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
        if (windowRef.current) {
            setBurstRect(windowRef.current.getBoundingClientRect());
        }
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 400);
        });
    });
  }

  function handleReset() {
    setRating(0);
    setText("");
    setHasSubmitted(false);
    localStorage.removeItem("reviewMe-submitted");
  }

  return (
    <main className="px-5 mx-auto flex flex-col items-center w-[100%] 2xl:container">
      <h1>Review Me</h1>
      <div ref={windowRef} className={`max-w-[600px] w-full ${isAnimating ? "animate-pop" : ""}`}>
          <Window title="Review Me!" className="w-[100%]">
            <div className="flex flex-col items-center gap-4">
            {!hasSubmitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
                    <StarRating value={rating} onChange={setRating} />
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Write your review..."
                        rows={4}
                    />
                    <Button type="submit">Submit Review</Button>
                </form>
            ) : (
                <div className="flex flex-col gap-3 w-full">
                    <StarDisplay value={rating} />
                    <h2>{text}</h2>
                </div>
            )}
            </div>
        </Window>
      </div>
      <SparkleBurst triggerRect={burstRect} onDone={() => setBurstRect(null)} />
    </main>
  );
}