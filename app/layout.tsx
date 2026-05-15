import type { Metadata } from "next";
import "./globals.css";
import { QueryProvider } from "@/components/QueryProvider";
import { Analytics } from "@/components/Analytics";
import { FooterScript } from "@/components/FooterScript";
import { getSettings } from "@/lib/supabase";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings.find((s) => s.key === "site_title")?.value || "Telegram News";
  const desc = settings.find((s) => s.key === "site_description")?.value || "Latest news";
  const keywords = settings.find((s) => s.key === "seo_keywords")?.value || "news, telegram";
  return {
    title: { default: title, template: `%s | ${title}` },
    description: desc,
    keywords: keywords.split(",").map((k) => k.trim()),
    authors: [{ name: settings.find((s) => s.key === "seo_author")?.value || "Admin" }],
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const gaId = settings.find((s) => s.key === "google_analytics_id")?.value || "";
  const searchConsole = settings.find((s) => s.key === "google_search_console")?.value || "";
  const footerJs = settings.find((s) => s.key === "footer_javascript")?.value || "";

  return (
    <html lang="en">
      <head>
        <Analytics gaId={gaId} searchConsole={searchConsole} />
      </head>
      <body className="bg-gray-50 min-h-screen antialiased">
        <QueryProvider>{children}</QueryProvider>
        <FooterScript code={footerJs} />
      </body>
    </html>
  );
}
