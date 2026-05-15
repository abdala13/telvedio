"use client";
import { useState } from "react";
import { Header } from "@/components/Header";
import { ArticleCard } from "@/components/Article/ArticleCard";
import { Article } from "@/types";
import { Search, Loader2, FileSearch } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Search Articles</h1>
          <p className="text-gray-500 text-center mb-6">Find articles by title or content</p>
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search news, topics, channels..."
              className="w-full px-5 py-4 pr-14 bg-white border border-gray-200 rounded-2xl text-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>
        ) : searched && results.length === 0 ? (
          <div className="text-center py-16">
            <FileSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No articles found for &quot;{query}&quot;</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((article) => <ArticleCard key={article.id} article={article} />)}
          </div>
        )}
      </main>
    </div>
  );
}
