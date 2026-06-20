import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const { error: dbError } = await supabase
    .from("subscribers")
    .insert({ email });

  if (dbError) {
    if (dbError.code === "23505") {
      return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }

  await resend.emails.send({
    from: "paul@ireviewstuff.com",
    to: email,
    subject: "Welcome to the newsletter!",
    html: `
      <h1>Thanks for subscribing!</h1>
      <p>You'll get an email whenever a new review is posted.</p>
    `,
  });

  return NextResponse.json({ success: true });
}