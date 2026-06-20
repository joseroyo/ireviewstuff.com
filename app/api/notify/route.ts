import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, category, pageUrl } = await request.json();

  const { data: subscribers, error: subError } = await supabase
    .from("subscribers")
    .select("email, unsubscribe_token");

  if (subError || !subscribers || subscribers.length === 0) {
    return NextResponse.json({ success: true, sent: 0 });
  }

  const emails = subscribers.map((sub) => ({
    from: "paul@ireviewstuff.com",
    to: sub.email,
    subject: `New ${category}: ${title}`,
    html: `
      <h1>New ${category} posted!</h1>
      <p style="font-size: 16px;">Check out the latest review of <strong>${title}</strong></p>
      ${pageUrl ? `<p style="font-size: 16px;"><a href="${pageUrl}">View it here!</a></p>` : ""}
      <p style="font-size:12px; margin-top:50px;">
        <a href="https://ireviewstuff.com/unsubscribe?token=${sub.unsubscribe_token}">Unsubscribe</a>
      </p>
    `,
  }));

  await resend.batch.send(emails);

  return NextResponse.json({ success: true, sent: emails.length });
}