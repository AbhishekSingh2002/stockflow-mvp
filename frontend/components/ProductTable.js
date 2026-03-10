import { useState } from "react";

/**
 * ProductTable – displays paginated product list with low-stock badge,
 * inline stock adjustment, and row-level edit / delete actions.
 */
export default function ProductTable({ products = [], defaultThreshold = 5, onEdit, onDelete, onAdjust }) {
  const [confirmId, setConfirmId] = useState(null);
  const [adjustId, setAdjustId] = useState(null);
  const [delta, setDelta] = useState("");

  const isLowStock = (p) => p.quantity <= (p.lowStock ?? defaultThreshold);

  const handleAdjustSubmit = (id) => {
    const num = Number(delta);
    if (isNaN(num) || num === 0) return;
    onAdjust(id, num);
    setAdjustId(null);
    setDelta("");
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">📦</p>
        <p className="text-lg font-medium">No products yet</p>
        <p className="text-sm">Click "Add Product" to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr className="text-left text-xs uppercase text-gray-500 tracking-wide">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">SKU</th>
            <th className="px-4 py-3">Qty</th>
            <th className="px-4 py-3">Sell Price</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50 transition">
              <td className="px-4 py-3 font-medium text-gray-800">{p.name}</td>
              <td className="px-4 py-3 font-mono text-gray-500">{p.sku}</td>
              <td className="px-4 py-3">
                {adjustId === p.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={delta}
                      onChange={(e) => setDelta(e.target.value)}
                      placeholder="+/-"
                      className="w-16 border rounded px-1 py-0.5 text-xs"
                    />
                    <button
                      onClick={() => handleAdjustSubmit(p.id)}
                      className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded"
                    >
                      OK
                    </button>
                    <button
                      onClick={() => { setAdjustId(null); setDelta(""); }}
                      className="text-xs text-gray-500"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAdjustId(p.id)}
                    title="Adjust stock"
                    className="font-semibold hover:underline"
                  >
                    {p.quantity}
                  </button>
                )}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {p.sellingPrice != null ? `$${p.sellingPrice.toFixed(2)}` : "—"}
              </td>
              <td className="px-4 py-3">
                {isLowStock(p) ? (
                  <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                    Low Stock
                  </span>
                ) : (
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                    OK
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(p)}
                    className="text-blue-600 hover:underline text-xs font-medium"
                  >
                    Edit
                  </button>
                  {confirmId === p.id ? (
                    <>
                      <button
                        onClick={() => { onDelete(p.id); setConfirmId(null); }}
                        className="text-red-600 text-xs font-medium hover:underline"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="text-gray-500 text-xs"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setConfirmId(p.id)}
                      className="text-red-500 hover:underline text-xs font-medium"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}