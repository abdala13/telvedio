"use client";
import Link from "next/link";
import { Newspaper, Menu, X, Search } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Newspaper className="w-7 h-7 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 tracking-tight">Telegram News</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Home</Link>
            <Link href="/search" className="text-gray-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-1">
              <Search className="w-4 h-4" /> Search
            </Link>
            <Link href="/admin" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Admin</Link>
          </nav>
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-2">
            <Link href="/" className="block text-gray-600 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/search" className="block text-gray-600 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Search</Link>
            <Link href="/admin" className="block text-gray-600 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
          </div>
        </div>
      )}
    </header>
  );
}
