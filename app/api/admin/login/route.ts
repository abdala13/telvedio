import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyPassword, createToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const { data: user } = await supabaseAdmin.from("admin_users").select("*").eq("username", username).single();
    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const token = await createToken(username);
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 86400 });
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}