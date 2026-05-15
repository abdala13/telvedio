import { Suspense } from "react";
import { ArticleTable } from "@/components/Admin/ArticleTable";
import { getAdminArticles } from "@/lib/supabase";

export default async function AdminArticlesPage() {
  const { articles, total } = await getAdminArticles(1, 50);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
          <p className="text-gray-500 mt-1">{total} total articles</p>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <Suspense fallback={<div className="p-6">Loading...</div>}>
          <ArticleTable articles={articles} />
        </Suspense>
      </div>
    </div>
  );
}
