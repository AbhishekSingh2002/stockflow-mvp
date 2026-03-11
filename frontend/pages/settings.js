import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { settingsApi } from "../services/api";
import Navbar from "../components/Navbar";

export default function Settings() {
  const router = useRouter();
  const [threshold, setThreshold] = useState("");
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [message,   setMessage]   = useState(null);
  const [user,      setUser]      = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) { router.replace("/login"); return; }
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));

    settingsApi
      .get()
      .then((res) => setThreshold(res.data.defaultLowStockThreshold))
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleSave = async () => {
    const value = Number(threshold);
    if (isNaN(value) || value < 0) {
      return setMessage({ text: "Must be a non-negative number", type: "error" });
    }
    setSaving(true);
    try {
      await settingsApi.update({ defaultLowStockThreshold: value });
      setMessage({ text: "Settings saved successfully!", type: "success" });
    } catch {
      setMessage({ text: "Failed to save settings", type: "error" });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      <Navbar activePage="settings" user={user} onLogout={handleLogout} />

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* ── Page header ── */}
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>Settings</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginTop: "0.3rem", marginBottom: 0 }}>
            Configure global defaults for your inventory.
          </p>
        </div>

        {/* ── Settings grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.5rem", alignItems: "start" }}>

          {/* Left: section nav / labels */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              overflow: "hidden",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            {[
              { label: "Inventory Defaults", icon: "📦", active: true },
            ].map(({ label, icon, active }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.65rem",
                  padding: "0.85rem 1.1rem",
                  cursor: "pointer",
                  background: active ? "rgba(37,99,235,0.07)" : "transparent",
                  borderLeft: active ? "3px solid var(--primary)" : "3px solid transparent",
                  transition: "background 0.15s",
                }}
              >
                <span style={{ fontSize: "1rem" }}>{icon}</span>
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: active ? 600 : 400,
                    color: active ? "var(--primary)" : "var(--muted)",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Right: settings card */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            {/* Card header */}
            <div style={{ padding: "1.1rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
              <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
                📦 Inventory Defaults
              </h2>
              <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.2rem", marginBottom: 0 }}>
                These values apply globally when a product has no individual setting.
              </p>
            </div>

            {/* Card body */}
            <div style={{ padding: "1.5rem" }}>
              {loading ? (
                <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>Loading…</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                  {/* Field */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label
                      style={{
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        color: "var(--muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Default Low Stock Threshold
                    </label>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <input
                        type="number"
                        min={0}
                        value={threshold}
                        onChange={(e) => setThreshold(e.target.value)}
                        style={{
                          width: "120px",
                          background: "var(--background)",
                          color: "var(--foreground)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          padding: "0.5rem 0.75rem",
                          fontSize: "1rem",
                          fontWeight: 600,
                          outline: "none",
                          textAlign: "center",
                          transition: "border-color 0.15s, box-shadow 0.15s",
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.12)"; }}
                        onBlur={(e)  => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
                      />
                      <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>units</span>
                    </div>

                    <p style={{ fontSize: "0.78rem", color: "var(--muted)", margin: 0 }}>
                      A product is flagged as "Low Stock" when its quantity is ≤ this value.
                    </p>
                  </div>

                  {/* Divider */}
                  <div style={{ borderTop: "1px solid var(--border)" }} />

                  {/* Save row */}
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      style={{
                        background: "var(--primary)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "0.5rem 1.25rem",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        cursor: saving ? "not-allowed" : "pointer",
                        opacity: saving ? 0.6 : 1,
                        transition: "background 0.15s, opacity 0.15s",
                      }}
                      onMouseEnter={(e) => { if (!saving) e.currentTarget.style.background = "var(--primary-hover)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "var(--primary)"; }}
                    >
                      {saving ? "Saving…" : "Save Changes"}
                    </button>

                    {message && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: message.type === "error" ? "#dc2626" : "#16a34a",
                        }}
                      >
                        <span>{message.type === "error" ? "✕" : "✓"}</span>
                        {message.text}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Info card ── */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            padding: "1.1rem 1.5rem",
            display: "flex",
            gap: "0.75rem",
            alignItems: "flex-start",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}
        >
          <span style={{ fontSize: "1.1rem", flexShrink: 0, marginTop: "0.05rem" }}>💡</span>
          <div>
            <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)", margin: "0 0 0.2rem" }}>
              How thresholds work
            </p>
            <p style={{ fontSize: "0.8rem", color: "var(--muted)", margin: 0, lineHeight: 1.6 }}>
              Each product can have its own low-stock threshold set on the Products page.
              If a product has no individual threshold, this global default is used.
              Low-stock products appear in the dashboard overview automatically.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}