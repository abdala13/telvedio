import { NextResponse } from "next/server";
import { toggleArticlePublish } from "@/lib/supabase";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { isPublished } = await request.json();
    await toggleArticlePublish(id, isPublished);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}