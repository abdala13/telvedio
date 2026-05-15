"use client";
import { useState } from "react";
import { Article } from "@/types";
import { formatDate } from "@/lib/utils";
import { Eye, Trash2, ToggleLeft, ToggleRight, ExternalLink } from "lucide-react";
import Link from "next/link";

interface ArticleTableProps {
  articles: Article[];
}

export function ArticleTable({ articles: initial }: ArticleTableProps) {
  const [articles, setArticles] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function togglePublish(id: string, current: boolean) {
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: current }),
      });
      if (res.ok) setArticles(articles.map((a) => a.id === id ? { ...a, is_published: !current } : a));
    } catch (e) { console.error(e); }
  }

  async function deleteArt(id: string) {
    if (!confirm("Delete this article?")) return;
    setDeleting(id);
    try {
      const res = await fetch("/api/admin/articles", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      if (res.ok) setArticles(articles.filter((a) => a.id !== id));
    } catch (e) { console.error(e); } finally { setDeleting(null); }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Article</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Views</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {articles.map((article) => (
            <tr key={article.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900 line-clamp-1">{article.title}</span>
                  <span className="text-xs text-gray-400">@{article.channel_username}</span>
                </div>
              </td>
              <td className="px-6 py-4"><span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">{article.category}</span></td>
              <td className="px-6 py-4 text-sm text-gray-500"><div className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {article.view_count}</div></td>
              <td className="px-6 py-4 text-sm text-gray-500">{formatDate(article.published_at)}</td>
              <td className="px-6 py-4 text-center">
                <button onClick={() => togglePublish(article.id, article.is_published)} className={article.is_published ? "text-green-500" : "text-gray-300"}>
                  {article.is_published ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/article/${article.slug}`} target="_blank" className="text-gray-400 hover:text-blue-600 transition-colors"><ExternalLink className="w-4 h-4" /></Link>
                  <button onClick={() => deleteArt(article.id)} disabled={deleting === article.id} className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"><Trash2 className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
