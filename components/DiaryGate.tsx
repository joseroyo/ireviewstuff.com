"use client";

import { useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthProvider";
import Window from "./Window";
import Button from "./Button";

type DiaryGateProps = {
  children: ReactNode;
};

export default function DiaryGate({ children }: DiaryGateProps) {
  const { user, isAuthLoading } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function check() {
      if (user) {
        setHasAccess(true);
        setIsChecking(false);
        return;
      }

      const response = await fetch("/api/diary/posts");
      setHasAccess(response.ok);
      setIsChecking(false);
    }

    if (!isAuthLoading) check();
  }, [user, isAuthLoading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const response = await fetch("/api/diary/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setErrorMessage(data.error || "Something went wrong");
      return;
    }

    setHasAccess(true);
    setPassword("");
  }

  if (isChecking) return <p>Loading...</p>;
  if (hasAccess) return <>{children}</>;

  return (
    <Window title="Enter password" className="w-[400px] mx-auto mt-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <p>Stop right there! You need the secret password in order to read!!</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Checking..." : "Unlock"}
        </Button>
      </form>
    </Window>
  );
}