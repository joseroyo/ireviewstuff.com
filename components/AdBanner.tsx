"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthProvider";
import Button from "./Button";

export default function AdBanner() {
  const { user, adsEnabled, toggleAds } = useAuth();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadAd() {
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["ad-image", "ad-link"]);

      if (data) {
        const image = data.find((s) => s.key === "ad-image")?.value;
        const link = data.find((s) => s.key === "ad-link")?.value;
        if (image) setImageUrl(image);
        if (link) setLinkUrl(link);
      }
    }
    loadAd();
  }, []);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const ext = file.name.split(".").pop();
    const filename = `ad-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("site-photos")
      .upload(filename, file);

    if (uploadError) {
      console.error("Upload failed:", uploadError.message);
      setIsUploading(false);
      return;
    }

    const { data: publicData } = supabase.storage
      .from("site-photos")
      .getPublicUrl(filename);

    const newUrl = publicData.publicUrl;

    await supabase
      .from("site_settings")
      .upsert({ key: "ad-image", value: newUrl });

    setImageUrl(newUrl);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleLinkChange(e: React.FormEvent) {
    e.preventDefault();
    await supabase
      .from("site_settings")
      .upsert({ key: "ad-link", value: linkUrl });
    alert("Ad link updated");
  }

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        onClick={toggleAds}
        className="fixed bottom-16 right-4 flex gap-2 items-center z-10"
      >
        {adsEnabled ? "Disable ads" : "Enable ads?"}
      </Button>
      {adsEnabled && imageUrl && (
      <a
        href={linkUrl || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="rotate-90 fixed origin-top-right right-0 bottom-[10%] z-40 hidden md:block"
      >
        <img
          src={imageUrl}
          alt="Ad"
          className="h-[80px]"
        />
      </a>
      )}

      {user && (
        <div className="w-[180px] fixed left-4 bottom-4 z-40 flex flex-col gap-2 bg-window-bg border-2 border-pink-strong p-2 hidden md:flex">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="secondary"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? "Uploading..." : "Change Ad Img"}
          </Button>
          <form onSubmit={handleLinkChange} className="flex flex-col gap-1">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Venmo URL"
              className="text-s"
            />
            <Button type="submit" variant="secondary">
              Update Link
            </Button>
          </form>
        </div>
      )}
    </>
  );
}