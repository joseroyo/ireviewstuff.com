"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthProvider";
import Button from "./Button";

type BackgroundMusicProps = {
  pageKey: string;
};

export default function BackgroundMusic({ pageKey }: BackgroundMusicProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function loadAudio() {
      const { data } = await supabase
        .from("page_music")
        .select("audio_url")
        .eq("page_key", pageKey)
        .maybeSingle();

      if (data?.audio_url) setAudioUrl(data.audio_url);
    }
    loadAudio();
  }, [pageKey]);

  useEffect(() => {
    if (!audioUrl) return;

    let started = false;

    function startMusic() {
        if (started) return;
        started = true;

        audioRef.current?.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});

        window.removeEventListener("click", startMusic);
        window.removeEventListener("keydown", startMusic);
        window.removeEventListener("touchstart", startMusic);
        window.removeEventListener("scroll", startMusic);
        window.removeEventListener("mousemove", startMusic);
    }

    window.addEventListener("click", startMusic);
    window.addEventListener("keydown", startMusic);
    window.addEventListener("touchstart", startMusic);
    window.addEventListener("scroll", startMusic);
    window.addEventListener("mousemove", startMusic);

    return () => {
        window.removeEventListener("click", startMusic);
        window.removeEventListener("keydown", startMusic);
        window.removeEventListener("touchstart", startMusic);
        window.removeEventListener("scroll", startMusic);
        window.removeEventListener("mousemove", startMusic);
    };
  }, [audioUrl]);

  function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const ext = file.name.split(".").pop();
    const filename = `${pageKey}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("music")
      .upload(filename, file);

    if (uploadError) {
      console.error("Upload failed:", uploadError.message);
      alert("Upload failed.");
      setIsUploading(false);
      return;
    }

    const { data: publicData } = supabase.storage
      .from("music")
      .getPublicUrl(filename);

    const newUrl = publicData.publicUrl;

    const { error: dbError } = await supabase
      .from("page_music")
      .upsert({ page_key: pageKey, audio_url: newUrl, updated_at: new Date().toISOString() });

    if (dbError) {
      console.error("Save failed:", dbError.message);
      setIsUploading(false);
      return;
    }

    setAudioUrl(newUrl);
    setIsPlaying(false);
    setIsUploading(false);

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="fixed bottom-4 right-4 flex gap-2 items-center z-10">
      {audioUrl && (
        <>
          <audio
            ref={audioRef}
            src={audioUrl}
            preload="none"
            loop
            onLoadedMetadata={() => {
                if (audioRef.current) audioRef.current.volume = 0.3;
            }}
            onEnded={() => setIsPlaying(false)}
          />
          <Button type="button" onClick={togglePlay} variant="secondary">
            {isPlaying ? "⏸" : "▶"}
          </Button>
        </>
      )}
      {user && (
        <>
          <input
            type="file"
            accept="audio/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="secondary"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? "Uploading..." : audioUrl ? "Change" : "Upload Song"}
          </Button>
        </>
      )}
    </div>
  );
}