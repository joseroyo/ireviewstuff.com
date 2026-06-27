"use client";

import { useEffect, useState } from "react";

type Sparkle = {
  id: number;
  x: number;
  y: number;
  symbol: string;
  color: string;
  dx: number;
  dy: number;
};

const SYMBOLS = ["✦", "✧", "✩", "★", "♡"];
const COLORS = ["var(--pink-strong)", "var(--pink-light)", "#ffffff"];
let nextId = 0;

type SparkleBurstProps = {
  triggerRect: DOMRect | null;
  onDone: () => void;
};

export default function SparkleBurst({ triggerRect, onDone }: SparkleBurstProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    if (!triggerRect) return;

    const newSparkles: Sparkle[] = [];
    const count = 500;

    for (let i = 0; i < count; i++) {
      const side = Math.floor(Math.random() * 4);
      let x = 0, y = 0;
      if (side === 0) { x = triggerRect.left + Math.random() * triggerRect.width; y = triggerRect.top; }
      if (side === 1) { x = triggerRect.right; y = triggerRect.top + Math.random() * triggerRect.height; }
      if (side === 2) { x = triggerRect.left + Math.random() * triggerRect.width; y = triggerRect.bottom; }
      if (side === 3) { x = triggerRect.left; y = triggerRect.top + Math.random() * triggerRect.height; }

      const angle = Math.random() * Math.PI * 2;
      const speed = 60 + Math.random() * 80;

      newSparkles.push({
        id: nextId++,
        x,
        y,
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
      });
    }

    setSparkles(newSparkles);

    const timeout = setTimeout(() => {
      setSparkles([]);
      onDone();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [triggerRect, onDone]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="absolute text-lg animate-sparkle-burst"
          style={{
            left: `${s.x}px`,
            top: `${s.y}px`,
            color: s.color,
            "--dx": `${s.dx}px`,
            "--dy": `${s.dy}px`,
          } as React.CSSProperties}
        >
          {s.symbol}
        </span>
      ))}
    </div>
  );
}