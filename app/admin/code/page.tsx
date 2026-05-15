import { getSettings, updateSetting } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export default async function AdminCodePage() {
  const settings = await getSettings();
  const footerJs = settings.find((s) => s.key === "footer_javascript")?.value || "";

  async function saveCode(formData: FormData) {
    "use server";
    const value = formData.get("value") as string;
    await updateSetting("footer_javascript", value);
    revalidatePath("/admin/code");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Custom Code</h1>
        <p className="text-gray-500 mt-1">Add custom JavaScript to your site footer</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form action={saveCode} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Footer JavaScript</label>
            <textarea
              name="value"
              defaultValue={footerJs}
              rows={12}
              placeholder="<script>...your code...</script>"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">This code will be injected before the closing body tag on every page.</p>
          </div>
          <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Save Code
          </button>
        </form>
      </div>
    </div>
  );
}
