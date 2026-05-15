import { Suspense } from "react";
import { StatsCard } from "@/components/Admin/StatsCard";
import { ArticleTable } from "@/components/Admin/ArticleTable";
import { getAdminArticles, getSystemLogs } from "@/lib/supabase";
import { FileText, Eye, Newspaper, AlertCircle } from "lucide-react";

export default async function AdminDashboard() {
  const { articles, total } = await getAdminArticles(1, 10);
  const logs = await getSystemLogs(5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Articles" value={total} icon={<FileText className="w-5 h-5" />} color="blue" />
        <StatsCard title="Published" value={articles.filter((a) => a.is_published).length} icon={<Newspaper className="w-5 h-5" />} color="green" />
        <StatsCard title="Total Views" value={articles.reduce((sum, a) => sum + a.view_count, 0)} icon={<Eye className="w-5 h-5" />} color="purple" />
        <StatsCard title="Categories" value={new Set(articles.map((a) => a.category)).size} icon={<AlertCircle className="w-5 h-5" />} color="orange" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200"><h2 className="text-lg font-semibold text-gray-900">Recent Articles</h2></div>
        <Suspense fallback={<div className="p-6">Loading...</div>}>
          <ArticleTable articles={articles} />
        </Suspense>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200"><h2 className="text-lg font-semibold text-gray-900">Recent Logs</h2></div>
        <div className="p-6">
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className={`p-3 rounded-lg text-sm ${log.level === "error" ? "bg-red-50 text-red-700" : log.level === "warning" ? "bg-yellow-50 text-yellow-700" : "bg-blue-50 text-blue-700"}`}>
                <div className="flex justify-between items-start">
                  <span className="font-medium">{log.source}</span>
                  <span className="text-xs opacity-75">{new Date(log.created_at).toLocaleString()}</span>
                </div>
                <p className="mt-1">{log.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
