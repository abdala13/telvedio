import { Suspense } from "react";
import { Header } from "@/components/Header";
import { ArticleFeed } from "@/components/Article/ArticleFeed";
import { getCategories } from "@/lib/supabase";

interface HomeProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function HomePage({ searchParams }: HomeProps) {
  const params = await searchParams;
  const category = params.category || "all";
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<Skeleton />}>
          <ArticleFeed initialCategory={category} categories={categories} />
        </Suspense>
      </main>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm p-4 animate-pulse">
          <div className="h-48 bg-gray-200 rounded-lg mb-4" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
