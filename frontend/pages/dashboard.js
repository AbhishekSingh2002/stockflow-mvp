import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { dashboardApi } from "../services/api";
import StatCard from "../components/StatCard";
import LowStockTable from "../components/LowStockTable";

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!localStorage.getItem("token")) {
      router.replace("/login");
      return;
    }
    if (stored) setUser(JSON.parse(stored));

    dashboardApi
      .get()
      .then((res) => setData(res.data))
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white shadow-sm border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold text-gray-800 text-lg">📦 StockFlow</span>
          <Link href="/dashboard" className="text-sm text-blue-600 font-medium">Dashboard</Link>
          <Link href="/products" className="text-sm text-gray-600 hover:text-blue-600">Products</Link>
          <Link href="/settings" className="text-sm text-gray-600 hover:text-blue-600">Settings</Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500">{user?.organizationName}</span>
          <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">Logout</button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Overview</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Products" value={data.totalProducts} color="border-blue-500" />
          <StatCard label="Total Units in Stock" value={data.totalQuantity} color="border-green-500" />
          <StatCard
            label="Low Stock Alerts"
            value={data.lowStockItems.length}
            color={data.lowStockItems.length > 0 ? "border-red-500" : "border-gray-300"}
          />
        </div>

        {/* Low stock */}
        <LowStockTable items={data.lowStockItems} />
      </main>
    </div>
  );
}