import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  const { rating, text, name } = await request.json();

  const resend = new Resend(process.env.RESEND_API_KEY!);

  await resend.emails.send({
    from: "noreply@ireviewstuff.com",
    to: "paul@ireviewstuff.com",
    subject: `New "Review Me" submission: ${rating} stars`,
    html: `
      <h2>${name || "(no name given)"} reviewed you!</h2>
      <p><strong>Rating:</strong> ${rating} stars</p>
      <p><strong>Review:</strong> ${text || "(no text given)"}</p>
    `,
  });

  return NextResponse.json({ success: true });
}