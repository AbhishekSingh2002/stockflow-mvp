import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { dashboardApi, financialApi } from "../services/api";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const userData = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    
    if (!token) {
      router.push("/login");
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashboardRes, recordsRes] = await Promise.all([
        dashboardApi.get(),
        financialApi.list({ limit: 10 })
      ]);
      
      setDashboardData(dashboardRes.data);
      setRecords(recordsRes.data.records);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError(err.response?.data?.error || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-800">Loading...</h1>
          <p className="text-gray-600">Fetching your financial data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-xl max-w-md">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const { summary, categoryBreakdown, recentTransactions } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.email?.split('@')[0]}! 👋
            </h2>
            <p className="text-gray-600">
              Here's your financial overview for this month
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Role-specific Content */}
        {user?.role === 'VIEWER' && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">👁️ Viewer Dashboard</h3>
            <p className="text-blue-800 mb-4">As a Viewer, you have read-only access to financial data.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <h4 className="font-medium text-blue-900 mb-2">Available Features:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>✅ View financial summaries</li>
                  <li>✅ Browse transaction history</li>
                  <li>✅ Filter and search records</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <h4 className="font-medium text-blue-900 mb-2">Limitations:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>❌ Cannot create transactions</li>
                  <li>❌ Cannot edit existing data</li>
                  <li>❌ No access to analytics</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {user?.role === 'ANALYST' && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-4">📊 Analyst Dashboard</h3>
            <p className="text-green-800 mb-4">As an Analyst, you can manage financial data and access analytics.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-green-100">
                <h4 className="font-medium text-green-900 mb-2">Features:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>✅ All Viewer features</li>
                  <li>✅ Create transactions</li>
                  <li>✅ Edit existing records</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-100">
                <h4 className="font-medium text-green-900 mb-2">Analytics:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>📈 Category breakdown</li>
                  <li>📊 Monthly trends</li>
                  <li>🎯 Advanced insights</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-100">
                <h4 className="font-medium text-green-900 mb-2">Actions:</h4>
                <div className="space-y-2">
                  <a href="/products" className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                    ➕ Add Transaction
                  </a>
                  <a href="/dashboard/analytics" className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                    📊 View Analytics
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {user?.role === 'ADMIN' && (
          <div className="mb-8 bg-purple-50 border border-purple-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-4">👑 Admin Dashboard</h3>
            <p className="text-purple-800 mb-4">As an Admin, you have complete system control.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <h4 className="font-medium text-purple-900 mb-2">Full Access:</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>✅ All Analyst features</li>
                  <li>✅ User management</li>
                  <li>✅ System settings</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <h4 className="font-medium text-purple-900 mb-2">Admin Tools:</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>👥 Create users</li>
                  <li>⚙️ Manage permissions</li>
                  <li>📈 System analytics</li>
                </ul>
              </div>
              <div className="bg-white rounded-lg p-4 border border-purple-100">
                <h4 className="font-medium text-purple-900 mb-2">Quick Actions:</h4>
                <div className="space-y-2">
                  <a href="/products" className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors">
                    ➕ Add Transaction
                  </a>
                  <a href="/settings" className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors">
                    👥 Manage Users
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100 min-w-[200px]">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">↑</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 font-medium">Total Income</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(summary.totalIncome)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100 min-w-[200px]">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">↓</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 font-medium">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(summary.totalExpenses)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100 min-w-[200px]">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">💰</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 font-medium">Net Balance</p>
                <p className={`text-2xl font-bold ${summary.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(summary.netBalance)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100 min-w-[200px]">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 font-medium">This Month</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(summary.currentMonth.net)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          </div>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.description || 'No description'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.type === 'INCOME' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                      transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'INCOME' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Role Info */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-blue-600 text-2xl">ℹ️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800 font-medium">
                <strong>Your Role:</strong> {user?.role} 
              </p>
              <p className="text-sm text-blue-700 mt-1">
                {user?.role === 'VIEWER' && 'You can view financial data and dashboards.'}
                {user?.role === 'ANALYST' && 'You can view data, create/edit financial records, and access analytics.'}
                {user?.role === 'ADMIN' && 'You have full access including user management.'}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
