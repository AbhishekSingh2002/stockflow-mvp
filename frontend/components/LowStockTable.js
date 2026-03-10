/**
 * LowStockTable – shows products that have hit their low-stock threshold.
 */
export default function LowStockTable({ items = [] }) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">⚠️ Low Stock Items</h2>
        <p className="text-green-600 font-medium">✅ All products are well stocked!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        ⚠️ Low Stock Items
        <span className="ml-2 bg-red-100 text-red-700 text-sm px-2 py-0.5 rounded-full">
          {items.length}
        </span>
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500 uppercase text-xs">
              <th className="pb-2 pr-4">Product</th>
              <th className="pb-2 pr-4">SKU</th>
              <th className="pb-2 pr-4">Qty on Hand</th>
              <th className="pb-2">Threshold</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="py-2 pr-4 font-medium text-gray-800">{item.name}</td>
                <td className="py-2 pr-4 text-gray-500 font-mono">{item.sku}</td>
                <td className="py-2 pr-4">
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-semibold">
                    {item.quantity}
                  </span>
                </td>
                <td className="py-2 text-gray-500">{item.lowStock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}