import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getArticleBySlug, getSettings } from "@/lib/supabase";
import { ArticleDetail } from "@/components/Article/ArticleDetail";
import { Header } from "@/components/Header";
import { generateMetaTitle } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);
    return {
      title: generateMetaTitle(article.title),
      description: article.summary || article.content.slice(0, 160),
    };
  } catch {
    return { title: "Article Not Found" };
  }
}

export default async function ArticlePage({ params }: Props) {
  try {
    const { slug } = await params;
    const article = await getArticleBySlug(slug);
    const settings = await getSettings();
    const adsEnabled = settings.find((s) => s.key === "ads_enabled")?.value === "true";
    const adsCode = adsEnabled ? settings.find((s) => s.key === "ads_code_article")?.value || "" : "";

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ArticleDetail article={article} adsCode={adsCode} />
        </main>
      </div>
    );
  } catch {
    notFound();
  }
}
