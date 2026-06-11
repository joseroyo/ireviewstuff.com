"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const { user, isAuthLoading } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/music">Music</Link>
      
      {isAuthLoading ? (
        <span>...</span>
      ) : user ? (
        <button type="button" onClick={handleLogout}>Log out</button>
      ) : (
        <Link href="/login">Log in</Link>
      )}
    </nav>
  );
}