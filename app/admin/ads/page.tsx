import { getSettings, updateSetting } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export default async function AdminAdsPage() {
  const settings = await getSettings();
  const getValue = (key: string) => settings.find((s) => s.key === key)?.value || "";

  async function saveSetting(formData: FormData) {
    "use server";
    const key = formData.get("key") as string;
    const value = formData.get("value") as string;
    await updateSetting(key, value);
    revalidatePath("/admin/ads");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ads & SEO</h1>
        <p className="text-gray-500 mt-1">Manage advertisements and search engine optimization</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        <form action={saveSetting} className="flex items-center gap-4 pb-6 border-b border-gray-100">
          <input type="hidden" name="key" value="ads_enabled" />
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" name="value" value="true" defaultChecked={getValue("ads_enabled") === "true"} className="w-5 h-5 text-blue-600 rounded" />
            <span className="font-medium text-gray-900">Enable Ads</span>
          </label>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Save</button>
        </form>

        <div className="grid gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Google Analytics ID</label>
            <form action={saveSetting} className="flex gap-2">
              <input type="hidden" name="key" value="google_analytics_id" />
              <input type="text" name="value" defaultValue={getValue("google_analytics_id")} placeholder="G-XXXXXXXXXX" className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save</button>
            </form>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Google Search Console Verification</label>
            <form action={saveSetting} className="flex gap-2">
              <input type="hidden" name="key" value="google_search_console" />
              <input type="text" name="value" defaultValue={getValue("google_search_console")} placeholder="Paste meta tag content here..." className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save</button>
            </form>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">SEO Keywords</label>
            <form action={saveSetting} className="flex gap-2">
              <input type="hidden" name="key" value="seo_keywords" />
              <input type="text" name="value" defaultValue={getValue("seo_keywords")} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save</button>
            </form>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ad Code - Header</label>
            <form action={saveSetting}>
              <input type="hidden" name="key" value="ads_code_header" />
              <textarea name="value" defaultValue={getValue("ads_code_header")} rows={4} placeholder="Paste your ad code here..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" />
              <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save Header Ad</button>
            </form>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ad Code - Article Content</label>
            <form action={saveSetting}>
              <input type="hidden" name="key" value="ads_code_article" />
              <textarea name="value" defaultValue={getValue("ads_code_article")} rows={4} placeholder="Paste your ad code here..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" />
              <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save Article Ad</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
