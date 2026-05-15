import { getSettings, updateSetting } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  async function saveSetting(formData: FormData) {
    "use server";
    const key = formData.get("key") as string;
    const value = formData.get("value") as string;
    await updateSetting(key, value);
    revalidatePath("/admin/settings");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">General platform settings</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        {settings.filter((s) => !["ads_enabled", "ads_code_header", "ads_code_article", "ads_code_sidebar", "google_analytics_id", "google_search_console", "footer_javascript", "seo_keywords", "seo_author"].includes(s.key)).map((setting) => (
          <div key={setting.id} className="pb-6 border-b border-gray-100 last:border-0 last:pb-0">
            <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
              {setting.key.replace(/_/g, " ")}
            </label>
            <form action={saveSetting} className="flex gap-2">
              <input type="hidden" name="key" value={setting.key} />
              <input type="text" name="value" defaultValue={setting.value || ""} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
