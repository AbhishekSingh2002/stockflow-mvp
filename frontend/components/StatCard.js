/**
 * StatCard – displays a single KPI metric.
 * @param {string} label - Metric label
 * @param {string|number} value - Metric value
 * @param {string} [color] - Tailwind border color class (e.g. "border-blue-500")
 */
export default function StatCard({ label, value, color = "border-blue-500" }) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${color}`}>
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}