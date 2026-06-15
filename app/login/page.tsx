"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Button from "@/components/Button";
import Window from "@/components/Window";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    // Logged in successfully — send them to the music page
    router.push("/music");
  }

  return (
    <main className="flex flex-col items-center">
      <h1>Log In</h1>

      <Window className="w-[33%]">
        <form onSubmit={handleSubmit}>
          <label className="flex flex-col">
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="flex flex-col mt-3">
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          <Button type="submit" disabled={isSubmitting} className="mt-5">
            {isSubmitting ? "Logging in..." : "Log in"}
          </Button>
        </form>
      </Window>

    </main>
  );
}