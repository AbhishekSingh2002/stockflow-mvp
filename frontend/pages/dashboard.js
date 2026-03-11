import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { dashboardApi } from "../services/api";

// ── StatCard ─────────────────────────────────────────────────
function StatCard({ label, value, accent, icon }) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderTop: `3px solid ${accent}`,
        borderRadius: "14px",
        padding: "1.5rem 1.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
          {label}
        </span>
        <span style={{ fontSize: "1.2rem" }}>{icon}</span>
      </div>
      <span style={{ fontSize: "2.2rem", fontWeight: 700, color: "var(--foreground)", lineHeight: 1 }}>
        {value}
      </span>
    </div>
  );
}

// ── LowStockTable ────────────────────────────────────────────
function LowStockTable({ items = [] }) {
  if (items.length === 0) {
    return (
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
          padding: "1.5rem 1.75rem",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "0.85rem" }}>
          ⚠️ Low Stock Items
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#16a34a", fontSize: "0.875rem", fontWeight: 500 }}>
          ✅ All products are well stocked!
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ padding: "1rem 1.75rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <h2 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--foreground)", margin: 0 }}>⚠️ Low Stock Items</h2>
        <span style={{ background: "#fee2e2", color: "#b91c1c", fontSize: "0.7rem", fontWeight: 700, padding: "0.15rem 0.55rem", borderRadius: "99px" }}>
          {items.length}
        </span>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "var(--background)" }}>
            {["Product", "SKU", "Qty on Hand", "Threshold"].map((h) => (
              <th key={h} style={{ padding: "0.6rem 1.75rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--muted)" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} style={{ borderTop: "1px solid var(--border)" }}>
              <td style={{ padding: "0.75rem 1.75rem", fontWeight: 500, color: "var(--foreground)" }}>{item.name}</td>
              <td style={{ padding: "0.75rem 1.75rem", fontFamily: "monospace", color: "var(--muted)", fontSize: "0.82rem" }}>{item.sku}</td>
              <td style={{ padding: "0.75rem 1.75rem" }}>
                <span style={{ background: "#fee2e2", color: "#b91c1c", padding: "0.2rem 0.6rem", borderRadius: "6px", fontWeight: 700, fontSize: "0.82rem" }}>
                  {item.quantity}
                </span>
              </td>
              <td style={{ padding: "0.75rem 1.75rem", color: "var(--muted)", fontSize: "0.875rem" }}>{item.lowStock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Navbar ───────────────────────────────────────────────────
function Navbar({ user, activePage, onLogout }) {
  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/products",  label: "Products"  },
    { href: "/settings",  label: "Settings"  },
  ];

  return (
    <nav style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Left: Logo + divider + links */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <span style={{ fontSize: "1.25rem" }}>📦</span>
            <span style={{ fontWeight: 700, fontSize: "1rem", color: "var(--foreground)", letterSpacing: "-0.01em" }}>
              StockFlow
            </span>
          </div>

          <div style={{ width: "1px", height: "18px", background: "var(--border)" }} />

          <div style={{ display: "flex", alignItems: "center", gap: "0.15rem" }}>
            {navLinks.map(({ href, label }) => {
              const isActive = activePage === label.toLowerCase();
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "var(--primary)" : "var(--muted)",
                    padding: "0.375rem 0.7rem",
                    borderRadius: "7px",
                    background: isActive ? "rgba(37,99,235,0.08)" : "transparent",
                    transition: "all 0.15s",
                    textDecoration: "none",
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Org pill + Logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {user?.organizationName && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", background: "var(--background)", border: "1px solid var(--border)", borderRadius: "99px", padding: "0.28rem 0.75rem" }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, flexShrink: 0 }}>
                {user.organizationName.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--foreground)" }}>
                {user.organizationName}
              </span>
            </div>
          )}

          <button
            onClick={onLogout}
            style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--muted)", background: "transparent", border: "1px solid var(--border)", borderRadius: "7px", padding: "0.33rem 0.8rem", cursor: "pointer" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.borderColor = "#fca5a5"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

// ── Page ─────────────────────────────────────────────────────
export default function Dashboard() {
  const router = useRouter();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser]       = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) { router.replace("/login"); return; }
    const stored = localStorage.getItem("user");
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
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--background)" }}>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      <Navbar user={user} activePage="dashboard" onLogout={handleLogout} />

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.75rem" }}>

        {/* Page heading */}
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
            Inventory Overview
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: "0.3rem", marginBottom: 0 }}>
            A live snapshot of your stock across all products.
          </p>
        </div>

        {/* KPI cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "1rem" }}>
          <StatCard label="Total Products"   value={data.totalProducts}        accent="#2563eb" icon="🗂️" />
          <StatCard label="Units in Stock"   value={data.totalQuantity}        accent="#16a34a" icon="📦" />
          <StatCard
            label="Low Stock Alerts"
            value={data.lowStockItems.length}
            accent={data.lowStockItems.length > 0 ? "#dc2626" : "#94a3b8"}
            icon={data.lowStockItems.length > 0 ? "🔴" : "✅"}
          />
        </div>

        {/* Low stock section */}
        <LowStockTable items={data.lowStockItems} />
      </main>
    </div>
  );
}