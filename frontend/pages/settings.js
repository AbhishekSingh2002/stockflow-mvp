import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { settingsApi } from "../services/api";

export default function Settings() {
  const router = useRouter();
  const [threshold, setThreshold] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) { router.replace("/login"); return; }
    settingsApi
      .get()
      .then((res) => setThreshold(res.data.defaultLowStockThreshold))
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    const value = Number(threshold);
    if (isNaN(value) || value < 0) {
      return setMessage({ text: "Must be a non-negative number", type: "error" });
    }
    setSaving(true);
    try {
      await settingsApi.update({ defaultLowStockThreshold: value });
      setMessage({ text: "Settings saved!", type: "success" });
    } catch {
      setMessage({ text: "Failed to save settings", type: "error" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold text-gray-800 text-lg">📦 StockFlow</span>
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-blue-600">Dashboard</Link>
          <Link href="/products" className="text-sm text-gray-600 hover:text-blue-600">Products</Link>
          <Link href="/settings" className="text-sm text-blue-600 font-medium">Settings</Link>
        </div>
        <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">Logout</button>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Inventory Defaults</h2>
          <p className="text-sm text-gray-500 mb-6">
            Products without a specific low-stock threshold will use this global default.
          </p>

          {loading ? (
            <p className="text-gray-400">Loading…</p>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Low Stock Threshold
                </label>
                <input
                  type="number"
                  min={0}
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  A product is "low stock" when its quantity is ≤ this value.
                </p>
              </div>

              {message && (
                <p className={`text-sm font-medium ${message.type === "error" ? "text-red-600" : "text-green-600"}`}>
                  {message.text}
                </p>
              )}

              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-md text-sm font-medium transition"
              >
                {saving ? "Saving…" : "Save Settings"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}