"use client";
import Link from "next/link";
import { Article } from "@/types";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { ArrowLeft, ExternalLink, Share2, Clock, Eye, Tag } from "lucide-react";
import { useEffect } from "react";

interface ArticleDetailProps {
  article: Article;
  adsCode?: string;
}

export function ArticleDetail({ article, adsCode }: ArticleDetailProps) {
  useEffect(() => { fetch(`/api/articles/${article.slug}`).catch(() => {}); }, [article.slug]);

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: article.title, text: article.summary || article.content.slice(0, 100), url: window.location.href }); } catch {}
    } else { navigator.clipboard.writeText(window.location.href); }
  };

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="h-56 bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 flex items-center justify-center relative">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IndoaXRlIi8+PC9zdmc+')]" />
        <div className="text-center text-white px-6 relative z-10">
          <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-4 border border-white/30">
            {article.category}
          </span>
          <h1 className="text-2xl md:text-4xl font-bold leading-tight">{article.title}</h1>
        </div>
      </div>

      <div className="p-6 md:p-10">
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {formatDate(article.published_at)}</span>
          <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {article.view_count} views</span>
          <span className="flex items-center gap-1.5"><Tag className="w-4 h-4" /> @{article.channel_username}</span>
          <span className="text-xs text-gray-400 ml-auto">{formatRelativeTime(article.published_at)}</span>
        </div>

        {adsCode && (
          <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100" dangerouslySetInnerHTML={{ __html: adsCode }} />
        )}

        <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600">
          {article.content.split("\n\n").map((paragraph, i) => (
            <p key={i} className="mb-5 text-gray-700 leading-[1.8]">{paragraph}</p>
          ))}
        </div>

        {adsCode && (
          <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100" dangerouslySetInnerHTML={{ __html: adsCode }} />
        )}

        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-blue-600 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Articles
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={handleShare} className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
              <Share2 className="w-4 h-4 mr-2" /> Share
            </button>
            {article.telegram_link && (
              <a href={article.telegram_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                View on Telegram <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
