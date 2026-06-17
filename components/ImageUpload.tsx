"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Button from "./Button";

type ImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
  bucket: string;
};

export default function ImageUpload({ value, onChange, bucket }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from(bucket).upload(filename, file);

    if (error) {
      console.error("Upload failed:", error.message, error);
      alert("Upload failed.");
      setIsUploading(false);
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
    onChange(data.publicUrl);
    setIsUploading(false);

    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="w-auto">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div>
          <img src={value} alt="" width={200} height={200} />
          <Button type="button" onClick={() => onChange("")} variant="secondary" className="mt-[20px]">
            Change
          </Button>
        </div>
      ) : (
        <div className="flex flex-col">
          <Button
            type="button"
            variant="secondary"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? "Uploading..." : "Upload Image"}
          </Button>
          <small className="ml-[2px]">Not required</small>
        </div>
      )}
    </div>
  );
}