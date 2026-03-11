import Link from "next/link";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/products",  label: "Products"  },
  { href: "/settings",  label: "Settings"  },
];

export default function Navbar({ activePage, user, onLogout }) {
  return (
    <nav
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* ── Left: Logo + divider + links ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <span style={{ fontSize: "1.25rem" }}>📦</span>
            <span
              style={{
                fontWeight: 700,
                fontSize: "1rem",
                color: "var(--foreground)",
                letterSpacing: "-0.01em",
              }}
            >
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
                    padding: "0.375rem 0.75rem",
                    borderRadius: "7px",
                    background: isActive ? "rgba(37,99,235,0.08)" : "transparent",
                    transition: "color 0.15s, background 0.15s",
                    textDecoration: "none",
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Right: Org pill + Logout ── */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {user?.organizationName && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                background: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "99px",
                padding: "0.28rem 0.75rem",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "var(--primary)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {user.organizationName.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--foreground)" }}>
                {user.organizationName}
              </span>
            </div>
          )}

          <button
            onClick={onLogout}
            style={{
              fontSize: "0.8rem",
              fontWeight: 500,
              color: "var(--muted)",
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "7px",
              padding: "0.33rem 0.8rem",
              cursor: "pointer",
              transition: "color 0.15s, border-color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#dc2626";
              e.currentTarget.style.borderColor = "#fca5a5";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--muted)";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}