import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (!password) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .select("value")
    .eq("key", "diary-password-hash")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Password not set" }, { status: 500 });
  }

  const isValid = await bcrypt.compare(password, data.value);

  if (!isValid) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("diary-access", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 86400,
    path: "/",
  });

  return NextResponse.json({ success: true });
}