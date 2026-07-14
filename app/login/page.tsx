"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Button from "@/components/Button";
import Window from "@/components/Window";

const PAUL_BIRTHDAY = "15/05/2000";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [birthdayUsed, setBirthdayUsed] = useState(false);
  const [birthdayClass, setBirthdayClass] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("login-attempts");
    if (saved) setAttempts(parseInt(saved, 10));
    if (localStorage.getItem("birthday-used") === "true") setBirthdayUsed(true);
  }, []);

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
      const next = attempts + 1;
      setAttempts(next);
      localStorage.setItem("login-attempts", next.toString());

      if (attempts === 0) {
        setErrorMessage(`Paulina’s date of birth in format dd/mm/yyyy`);
      } else if (password === PAUL_BIRTHDAY && !birthdayUsed) {
        setErrorMessage("U remembered 🥹");
        setBirthdayUsed(true);
        setBirthdayClass(true);
        localStorage.setItem("birthday-used", "true");
      } else {
        setErrorMessage("sucks to suck");
        setBirthdayClass(false);
      }
      return;
    }

    localStorage.removeItem("login-attempts");
    localStorage.removeItem("birthday-used");
    setAttempts(0);
    setBirthdayUsed(false);
    setBirthdayClass(false);
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
          {errorMessage && <p style={{ color: birthdayClass ? "var(--pink-extra-strong)" : "red" }}>{errorMessage}</p>}
          <Button type="submit" disabled={isSubmitting} className="mt-5">
            {isSubmitting ? "Logging in..." : "Log in"}
          </Button>
        </form>
      </Window>
    </main>
  );
}