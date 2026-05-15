"use client";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ArticleCard } from "./ArticleCard";
import { ArticlesResponse } from "@/types";
import { Loader2, Filter } from "lucide-react";

interface ArticleFeedProps {
  initialCategory: string;
  categories: string[];
}

export function ArticleFeed({ initialCategory, categories }: ArticleFeedProps) {
  const [category, setCategory] = useState(initialCategory);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useInfiniteQuery({
    queryKey: ["articles", category],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(`/api/articles?page=${pageParam}&limit=12&category=${category === "all" ? "" : category}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json() as Promise<ArticlesResponse>;
    },
    getNextPageParam: (lastPage, allPages) => lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
  });

  const articles = data?.pages.flatMap((page) => page.articles) || [];

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Filter className="w-4 h-4 text-gray-400" />
        <button onClick={() => setCategory("all")} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${category === "all" ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}>All</button>
        {categories.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${category === cat ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"}`}>{cat}</button>
        ))}
      </div>

      {status === "pending" ? (
        <div className="flex justify-center py-16"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-400 text-lg">No articles found in this category</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => <ArticleCard key={article.id} article={article} />)}
          </div>
          {hasNextPage && (
            <div className="flex justify-center mt-10">
              <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="px-8 py-3 bg-white border border-gray-200 rounded-full text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 shadow-sm">
                {isFetchingNextPage ? <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</span> : "Load More Articles"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
