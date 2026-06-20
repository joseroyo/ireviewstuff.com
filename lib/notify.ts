import { supabase } from "./supabase";

export async function notifySubscribers(
  title: string,
  category: string,
  pageUrl: string
) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return;

  try {
    await fetch("/api/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ title, category, pageUrl }),
    });
  } catch (error) {
    console.error("Notification failed:", error);
  }
}