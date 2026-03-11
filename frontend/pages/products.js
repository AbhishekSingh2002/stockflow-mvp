import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { productsApi, settingsApi } from "../services/api";
import Navbar from "../components/Navbar";
import ProductTable from "../components/ProductTable";
import ProductForm from "../components/ProductForm";

// ── Toast ─────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  const isError = toast.type === "error";
  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        background: isError ? "#dc2626" : "#16a34a",
        color: "#fff",
        padding: "0.65rem 1rem",
        borderRadius: "10px",
        fontSize: "0.875rem",
        fontWeight: 500,
        boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <span>{isError ? "✕" : "✓"}</span>
      {toast.msg}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function Products() {
  const router = useRouter();
  const [products,          setProducts]          = useState([]);
  const [defaultThreshold,  setDefaultThreshold]  = useState(5);
  const [search,            setSearch]            = useState("");
  const [loading,           setLoading]           = useState(true);
  const [saving,            setSaving]            = useState(false);
  const [showForm,          setShowForm]          = useState(false);
  const [editingProduct,    setEditingProduct]    = useState(null);
  const [toast,             setToast]             = useState(null);
  const [user,              setUser]              = useState(null);

  const notify = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = useCallback(async () => {
    try {
      const [prodRes, settingsRes] = await Promise.all([
        productsApi.list(search),
        settingsApi.get(),
      ]);
      setProducts(prodRes.data);
      setDefaultThreshold(settingsRes.data.defaultLowStockThreshold);
    } catch {
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    if (!localStorage.getItem("token")) { router.replace("/login"); return; }
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    fetchProducts();
  }, [fetchProducts]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleCreate = async (formData) => {
    setSaving(true);
    try {
      await productsApi.create(formData);
      notify("Product created!");
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      notify(err.response?.data?.error || "Failed to create product", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (formData) => {
    setSaving(true);
    try {
      await productsApi.update(editingProduct.id, formData);
      notify("Product updated!");
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      notify(err.response?.data?.error || "Failed to update product", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await productsApi.remove(id);
      notify("Product deleted");
      fetchProducts();
    } catch {
      notify("Failed to delete product", "error");
    }
  };

  const handleAdjust = async (id, delta) => {
    try {
      await productsApi.adjustStock(id, delta);
      notify(`Stock adjusted by ${delta > 0 ? "+" : ""}${delta}`);
      fetchProducts();
    } catch (err) {
      notify(err.response?.data?.error || "Failed to adjust stock", "error");
    }
  };

  const openCreate = () => { setShowForm(true); setEditingProduct(null); };
  const closeForm  = () => { setShowForm(false); setEditingProduct(null); };

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      <Navbar activePage="products" user={user} onLogout={handleLogout} />
      <Toast toast={toast} />

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* ── Page header ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Products</h1>
            <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: "0.3rem", marginBottom: 0 }}>
              Manage your inventory — click a quantity to adjust stock inline.
            </p>
          </div>
          <button
            onClick={openCreate}
            style={{
              background: "var(--primary)",
              color: "#fff",
              border: "none",
              borderRadius: "9px",
              padding: "0.55rem 1.1rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--primary-hover)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--primary)"; }}
          >
            + Add Product
          </button>
        </div>

        {/* ── Search bar ── */}
        <div style={{ position: "relative", maxWidth: "340px" }}>
          <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontSize: "0.9rem", pointerEvents: "none" }}>🔍</span>
          <input
            type="text"
            placeholder="Search by name or SKU…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              background: "var(--surface)",
              color: "var(--foreground)",
              border: "1px solid var(--border)",
              borderRadius: "9px",
              padding: "0.5rem 0.75rem 0.5rem 2.2rem",
              fontSize: "0.875rem",
              outline: "none",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
            onFocus={(e) => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.12)"; }}
            onBlur={(e)  => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        {/* ── Form panel (slide in) ── */}
        {(showForm || editingProduct) && (
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              padding: "1.5rem 1.75rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
                {editingProduct ? "✏️ Edit Product" : "➕ New Product"}
              </h2>
              <button
                onClick={closeForm}
                style={{ background: "transparent", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "1.1rem", lineHeight: 1, padding: "0.2rem" }}
              >
                ✕
              </button>
            </div>
            <ProductForm
              initialData={editingProduct || {}}
              onSubmit={editingProduct ? handleUpdate : handleCreate}
              onCancel={closeForm}
              loading={saving}
            />
          </div>
        )}

        {/* ── Products table ── */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          {/* Table header row */}
          <div
            style={{
              padding: "1rem 1.25rem",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)" }}>
              All Products
            </span>
            <span
              style={{
                background: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "99px",
                padding: "0.15rem 0.6rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                color: "var(--muted)",
              }}
            >
              {products.length} {products.length === 1 ? "item" : "items"}
            </span>
          </div>

          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--muted)", fontSize: "0.9rem" }}>
              Loading products…
            </div>
          ) : (
            <ProductTable
              products={products}
              defaultThreshold={defaultThreshold}
              onEdit={(p) => { setEditingProduct(p); setShowForm(false); }}
              onDelete={handleDelete}
              onAdjust={handleAdjust}
            />
          )}
        </div>
      </main>
    </div>
  );
}