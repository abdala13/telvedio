"use client";
import Link from "next/link";
import { Article } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import { Newspaper, ExternalLink, Eye } from "lucide-react";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <Link href={`/article/${article.slug}`}>
        <div className="h-48 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
          <Newspaper className="w-14 h-14 text-white/70 group-hover:scale-110 transition-transform duration-300" />
        </div>
      </Link>
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
            {article.category}
          </span>
          <span className="text-xs text-gray-400">{formatRelativeTime(article.published_at)}</span>
        </div>
        <Link href={`/article/${article.slug}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors leading-snug">
            {article.title}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm line-clamp-3 mb-4 leading-relaxed">
          {article.summary || article.content.slice(0, 150) + "..."}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <span className="text-xs font-medium text-gray-400">@{article.channel_username}</span>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {article.view_count}
            </span>
            {article.telegram_link && (
              <a href={article.telegram_link} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-blue-500 transition-colors" onClick={(e) => e.stopPropagation()}>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
