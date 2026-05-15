"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Settings, LogOut, Newspaper, BarChart3, Code } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  username: string;
}

export function AdminLayout({ children, username }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/articles", label: "Articles", icon: FileText },
    { href: "/admin/ads", label: "Ads & SEO", icon: BarChart3 },
    { href: "/admin/code", label: "Custom Code", icon: Code },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white hidden lg:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="flex items-center space-x-2">
            <Newspaper className="w-6 h-6 text-blue-400" />
            <span className="text-lg font-bold">News Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}>
                <Icon className="w-5 h-5" /><span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <p className="text-xs text-slate-400 mb-3">{username}</p>
          <button onClick={handleLogout} className="flex items-center space-x-2 text-sm text-red-400 hover:text-red-300 font-medium w-full px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors">
            <LogOut className="w-4 h-4" /><span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="lg:hidden bg-slate-900 text-white p-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Newspaper className="w-6 h-6 text-blue-400" />
            <span className="font-bold">News Admin</span>
          </Link>
          <span className="text-sm text-slate-400">{username}</span>
        </div>
      </div>

      <main className="lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
