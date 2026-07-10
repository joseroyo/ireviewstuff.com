"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useRef, useEffect } from "react";

export default function Navigation() {
  const { user, isAuthLoading } = useAuth();
  const router = useRouter();
  const [isWeebOpen, setIsWeebOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsWeebOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <nav className="px-0 md:px-5 py-2 mb-5 flex justify-center flex-wrap border-b-5 border-t-5 border-window-border-color bg-window-dotted bg-size-[5px_5px] xl:justify-between xl:flex-nowrap">
      <Link href="/" className="font-bold text-[16px] px-[12px] pb-[2px] bg-window-bg border-1 rounded-[2px]">Home</Link>
      <Link href="/about-me" className="font-bold text-[16px] px-[12px] pb-[2px] bg-window-bg border-1 rounded-[2px]">About Me</Link>
      <Link href="/music" className="font-bold text-[16px] px-[12px] pb-[2px] bg-window-bg border-1 rounded-[2px]">Music</Link>
      <Link href="/movies" className="font-bold text-[16px] px-[12px] pb-[2px] bg-window-bg border-1 rounded-[2px]">Movies</Link>
      <Link href="/tv-shows" className="font-bold text-[16px] px-[12px] pb-[2px] bg-window-bg border-1 rounded-[2px]">TV Shows</Link>
      <Link href="/books" className="font-bold text-[16px] px-[12px] pb-[2px] bg-window-bg border-1 rounded-[2px]">Books</Link>
      <Link href="/games" className="font-bold text-[16px] px-[12px] pb-[2px] bg-window-bg border-1 rounded-[2px]">Games</Link>
      <div className="relative" ref={dropdownRef}>
        <button 
          className="font-bold text-[16px] px-[12px] pb-[2px] bg-window-bg border-1 rounded-[2px] cursor-pointer"
          type="button"
          onClick={() => setIsWeebOpen(!isWeebOpen)}
        >๑(◕‿◕)๑</button>
        {isWeebOpen && (
        <div className="flex flex-col absolute w-[100%]">
          <Link href="/anime" className="font-bold text-[16px] px-[12px] pb-[2px] bg-window-bg border-1 rounded-[2px]">Anime</Link>
          <Link href="/manga" className="font-bold text-[16px] px-[12px] pb-[2px] bg-window-bg border-1 rounded-[2px]">Manga</Link>
        </div>
        )}
      </div>
      <Link href="/events" className="font-bold text-[16px] px-[12px] pb-[2px] bg-window-bg border-1 rounded-[2px]">Life Events</Link>
      <Link href="/friends" className="font-bold text-[16px] px-[12px] pb-[2px] bg-window-bg border-1 rounded-[2px]">Friends</Link>
      <Link href="/review-me" className="font-bold text-[16px] px-[12px] pb-[2px] bg-window-bg border-1 rounded-[2px]">Review Me</Link>
      <Link href="/search" className="font-bold text-[16px] px-[12px] pb-[2px] bg-window-bg border-1 rounded-[2px]">Search</Link>
      {isAuthLoading ? (
        <span>...</span>
      ) : user ? (
        <button type="button" onClick={handleLogout} className="font-bold text-[16px] px-[12px] pb-[2px] bg-window-bg border-1 rounded-[2px] cursor-pointer">Log out</button>
      ) : (
        <Link href="/login" className="font-bold text-[16px] px-[12px] pb-[2px] bg-window-bg border-1 rounded-[2px]">Log in</Link>
      )}
    </nav>
  );
}