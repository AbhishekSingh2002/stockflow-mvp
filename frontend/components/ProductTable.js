import { useState } from "react";

export default function ProductTable({ products = [], defaultThreshold = 5, onEdit, onDelete, onAdjust }) {
  const [confirmId, setConfirmId] = useState(null);
  const [adjustId,  setAdjustId]  = useState(null);
  const [delta,     setDelta]     = useState("");

  const isLowStock = (p) => p.quantity <= (p.lowStock ?? defaultThreshold);

  const handleAdjustSubmit = (id) => {
    const num = Number(delta);
    if (isNaN(num) || num === 0) return;
    onAdjust(id, num);
    setAdjustId(null);
    setDelta("");
  };

  // ── Empty state ──────────────────────────────────────────
  if (products.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem 2rem",
          gap: "0.5rem",
        }}
      >
        <span style={{ fontSize: "2.5rem" }}>📦</span>
        <p style={{ fontWeight: 600, color: "var(--foreground)", fontSize: "1rem", margin: 0 }}>No products yet</p>
        <p style={{ color: "var(--muted)", fontSize: "0.875rem", margin: 0 }}>Click "Add Product" to get started.</p>
      </div>
    );
  }

  const thStyle = {
    padding: "0.65rem 1.25rem",
    textAlign: "left",
    fontSize: "0.7rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    color: "var(--muted)",
    whiteSpace: "nowrap",
  };

  const tdStyle = {
    padding: "0.85rem 1.25rem",
    color: "var(--foreground)",
    fontSize: "0.875rem",
    verticalAlign: "middle",
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "var(--background)", borderBottom: "1px solid var(--border)" }}>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>SKU</th>
            <th style={thStyle}>Qty</th>
            <th style={thStyle}>Cost</th>
            <th style={thStyle}>Sell Price</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr
              key={p.id}
              style={{
                borderBottom: i < products.length - 1 ? "1px solid var(--border)" : "none",
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(37,99,235,0.03)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              {/* Name */}
              <td style={{ ...tdStyle, fontWeight: 600 }}>{p.name}</td>

              {/* SKU */}
              <td style={{ ...tdStyle, fontFamily: "monospace", color: "var(--muted)", fontSize: "0.82rem" }}>
                {p.sku}
              </td>

              {/* Qty with inline adjust */}
              <td style={tdStyle}>
                {adjustId === p.id ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <input
                      type="number"
                      value={delta}
                      onChange={(e) => setDelta(e.target.value)}
                      placeholder="+/-"
                      autoFocus
                      style={{
                        width: "64px",
                        background: "var(--background)",
                        color: "var(--foreground)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        padding: "0.25rem 0.4rem",
                        fontSize: "0.8rem",
                        outline: "none",
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleAdjustSubmit(p.id)}
                    />
                    <button
                      onClick={() => handleAdjustSubmit(p.id)}
                      style={{ background: "var(--primary)", color: "#fff", border: "none", borderRadius: "6px", padding: "0.25rem 0.55rem", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}
                    >
                      OK
                    </button>
                    <button
                      onClick={() => { setAdjustId(null); setDelta(""); }}
                      style={{ background: "transparent", color: "var(--muted)", border: "none", cursor: "pointer", fontSize: "0.85rem", padding: "0.2rem" }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAdjustId(p.id)}
                    title="Click to adjust stock"
                    style={{
                      background: "var(--background)",
                      color: "var(--foreground)",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      padding: "0.25rem 0.65rem",
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "border-color 0.15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
                  >
                    {p.quantity}
                  </button>
                )}
              </td>

              {/* Cost */}
              <td style={{ ...tdStyle, color: "var(--muted)" }}>
                {p.costPrice != null ? `$${p.costPrice.toFixed(2)}` : "—"}
              </td>

              {/* Selling price */}
              <td style={{ ...tdStyle, color: "var(--muted)" }}>
                {p.sellingPrice != null ? `$${p.sellingPrice.toFixed(2)}` : "—"}
              </td>

              {/* Status badge */}
              <td style={tdStyle}>
                {isLowStock(p) ? (
                  <span style={{ background: "#fee2e2", color: "#b91c1c", fontSize: "0.72rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "99px", whiteSpace: "nowrap" }}>
                    ⚠ Low Stock
                  </span>
                ) : (
                  <span style={{ background: "#dcfce7", color: "#15803d", fontSize: "0.72rem", fontWeight: 600, padding: "0.25rem 0.6rem", borderRadius: "99px" }}>
                    ✓ OK
                  </span>
                )}
              </td>

              {/* Actions */}
              <td style={tdStyle}>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  {/* Edit */}
                  <button
                    onClick={() => onEdit(p)}
                    style={{
                      background: "transparent",
                      color: "var(--primary)",
                      border: "1px solid rgba(37,99,235,0.3)",
                      borderRadius: "6px",
                      padding: "0.25rem 0.65rem",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(37,99,235,0.08)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    Edit
                  </button>

                  {/* Delete / Confirm */}
                  {confirmId === p.id ? (
                    <div style={{ display: "flex", gap: "0.35rem" }}>
                      <button
                        onClick={() => { onDelete(p.id); setConfirmId(null); }}
                        style={{ background: "#dc2626", color: "#fff", border: "none", borderRadius: "6px", padding: "0.25rem 0.6rem", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        style={{ background: "transparent", color: "var(--muted)", border: "1px solid var(--border)", borderRadius: "6px", padding: "0.25rem 0.6rem", fontSize: "0.78rem", cursor: "pointer" }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(p.id)}
                      style={{
                        background: "transparent",
                        color: "#dc2626",
                        border: "1px solid rgba(220,38,38,0.25)",
                        borderRadius: "6px",
                        padding: "0.25rem 0.65rem",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#fee2e2"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
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