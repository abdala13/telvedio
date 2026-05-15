import { NextResponse } from "next/server";
import { getArticleBySlug } from "@/lib/supabase";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);
    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }
}