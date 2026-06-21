"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    async function unsubscribe() {
      if (!token) {
        setStatus("error");
        return;
      }   
      const { error } = await supabase
        .from("subscribers")
        .delete()
        .eq("unsubscribe_token", token);
      setStatus(error ? "error" : "success");
    }
    unsubscribe();
  }, [token]);

  if (status === "loading") return <p className="text-center">Unsubscribing...</p>;
  if (status === "error") return <h1 className="text-center">Couldn't unsubscribe. The link may be invalid.</h1>;
  return <h1 className="text-center">Sad to see you go!</h1>;
}

export default function Unsubscribe() {
  return (
    <Suspense fallback={<p className="text-center">Loading...</p>}>
      <UnsubscribeContent />
    </Suspense>
  );
}