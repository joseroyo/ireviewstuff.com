"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Button from "./Button";
import Window from "./Window";

export default function DiaryPasswordChange() {
  const [newPassword, setNewPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setStatus("error");
      setErrorMessage("Not logged in");
      return;
    }

    const response = await fetch("/api/diary/set-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ password: newPassword }),
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus("error");
      setErrorMessage(data.error || "Failed to update");
      return;
    }

    setStatus("success");
    setNewPassword("");
  }

  return (
    <Window title="Change Diary Password" className="max-w-[600px] w-[100%] mb-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
          minLength={4}
          required
        />
        {status === "error" && <p className="text-red-500">{errorMessage}</p>}
        {status === "success" && <p className="text-green-600">Password updated!</p>}
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Saving..." : "Update Password"}
        </Button>
      </form>
    </Window>
  );
}