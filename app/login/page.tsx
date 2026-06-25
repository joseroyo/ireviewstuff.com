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

    router.push("/");
  }

  return (
    <main className="flex flex-col items-center px-5">
      <h1>Log In</h1>
      <Window className="max-w-[558px] w-[100%]">
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