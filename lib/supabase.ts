import { createClient } from "@supabase/supabase-js";
import { Article, SystemLog, Setting } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
export const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function getArticles(page = 1, limit = 12, category?: string) {
  let query = supabase.from("articles").select("*", { count: "exact" })
    .eq("is_published", true).order("published_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);
  if (category && category !== "all") query = query.eq("category", category);
  const { data, error, count } = await query;
  if (error) throw error;
  return { articles: data as Article[], total: count || 0, hasMore: (page * limit) < (count || 0) };
}

export async function getArticleBySlug(slug: string) {
  const { data, error } = await supabase.from("articles").select("*")
    .eq("slug", slug).eq("is_published", true).single();
  if (error) throw error;
  return data as Article;
}

export async function getCategories() {
  const { data, error } = await supabase.from("articles").select("category").eq("is_published", true);
  if (error) throw error;
  return [...new Set(data.map((item) => item.category))] as string[];
}

export async function searchArticles(query: string, limit = 20) {
  const { data, error } = await supabase.from("articles").select("*")
    .eq("is_published", true)
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as Article[];
}

export async function getAdminArticles(page = 1, limit = 20) {
  const { data, error, count } = await supabaseAdmin.from("articles").select("*", { count: "exact" })
    .order("created_at", { ascending: false }).range((page - 1) * limit, page * limit - 1);
  if (error) throw error;
  return { articles: data as Article[], total: count || 0 };
}

export async function deleteArticle(id: string) {
  const { error } = await supabaseAdmin.from("articles").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleArticlePublish(id: string, current: boolean) {
  const { error } = await supabaseAdmin.from("articles").update({ is_published: !current }).eq("id", id);
  if (error) throw error;
}

export async function getSystemLogs(limit = 50) {
  const { data, error } = await supabaseAdmin.from("system_logs").select("*")
    .order("created_at", { ascending: false }).limit(limit);
  if (error) throw error;
  return data as SystemLog[];
}

export async function getSettings() {
  const { data, error } = await supabaseAdmin.from("settings").select("*");
  if (error) throw error;
  return data as Setting[];
}

export async function updateSetting(key: string, value: string) {
  const { error } = await supabaseAdmin.from("settings").update({ value }).eq("key", key);
  if (error) throw error;
}
