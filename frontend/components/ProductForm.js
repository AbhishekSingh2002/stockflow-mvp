import { useState } from "react";

const INITIAL_FORM = {
  name: "",
  sku: "",
  description: "",
  quantity: 0,
  costPrice: "",
  sellingPrice: "",
  lowStock: "",
};

// ── Reusable field ────────────────────────────────────────────
function Field({ label, name, type = "text", placeholder, required, value, onChange, error }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <label
        style={{
          fontSize: "0.78rem",
          fontWeight: 600,
          color: "var(--muted)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label} {required && <span style={{ color: "#dc2626" }}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          background: "var(--background)",
          color: "var(--foreground)",
          border: `1px solid ${error ? "#f87171" : "var(--border)"}`,
          borderRadius: "8px",
          padding: "0.5rem 0.75rem",
          fontSize: "0.875rem",
          outline: "none",
          width: "100%",
          transition: "border-color 0.15s, box-shadow 0.15s",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--primary)";
          e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.12)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? "#f87171" : "var(--border)";
          e.target.style.boxShadow = "none";
        }}
      />
      {error && (
        <span style={{ fontSize: "0.75rem", color: "#dc2626" }}>{error}</span>
      )}
    </div>
  );
}

export default function ProductForm({ initialData = {}, onSubmit, onCancel, loading = false }) {
  const [form, setForm]     = useState({ ...INITIAL_FORM, ...initialData });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())  errs.name     = "Name is required";
    if (!form.sku.trim())   errs.sku      = "SKU is required";
    if (form.quantity < 0)  errs.quantity = "Quantity cannot be negative";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);
    onSubmit({
      name:         form.name.trim(),
      sku:          form.sku.trim().toUpperCase(),
      description:  form.description?.trim() || null,
      quantity:     Number(form.quantity),
      costPrice:    form.costPrice    !== "" ? Number(form.costPrice)    : null,
      sellingPrice: form.sellingPrice !== "" ? Number(form.sellingPrice) : null,
      lowStock:     form.lowStock     !== "" ? Number(form.lowStock)     : null,
    });
  };

  // grid helpers
  const col2 = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" };
  const col3 = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>

      {/* Row 1: Name + SKU */}
      <div style={col2}>
        <Field label="Product Name" name="name" placeholder="e.g. Wireless Mouse" required
          value={form.name} onChange={handleChange} error={errors.name} />
        <Field label="SKU" name="sku" placeholder="e.g. WM-100" required
          value={form.sku} onChange={handleChange} error={errors.sku} />
      </div>

      {/* Row 2: Description */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Optional product description"
          rows={2}
          style={{
            background: "var(--background)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "0.5rem 0.75rem",
            fontSize: "0.875rem",
            outline: "none",
            resize: "vertical",
            fontFamily: "inherit",
            transition: "border-color 0.15s, box-shadow 0.15s",
          }}
          onFocus={(e) => { e.target.style.borderColor = "var(--primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.12)"; }}
          onBlur={(e)  => { e.target.style.borderColor = "var(--border)";  e.target.style.boxShadow = "none"; }}
        />
      </div>

      {/* Row 3: Qty + Cost + Selling */}
      <div style={col3}>
        <Field label="Qty on Hand" name="quantity" type="number" required
          value={form.quantity} onChange={handleChange} error={errors.quantity} />
        <Field label="Cost Price ($)" name="costPrice" type="number" placeholder="0.00"
          value={form.costPrice} onChange={handleChange} />
        <Field label="Selling Price ($)" name="sellingPrice" type="number" placeholder="0.00"
          value={form.sellingPrice} onChange={handleChange} />
      </div>

      {/* Row 4: Low stock threshold */}
      <div style={{ maxWidth: "220px" }}>
        <Field label="Low Stock Threshold" name="lowStock" type="number" placeholder="Uses global default"
          value={form.lowStock} onChange={handleChange} />
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.25rem" }}>
        <button
          type="submit"
          disabled={loading}
          style={{
            background: "var(--primary)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "0.5rem 1.25rem",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            transition: "opacity 0.15s, background 0.15s",
          }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "var(--primary-hover)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--primary)"; }}
        >
          {loading ? "Saving…" : "Save Product"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: "transparent",
            color: "var(--muted)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "0.5rem 1.25rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "pointer",
            transition: "color 0.15s, border-color 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--foreground)"; e.currentTarget.style.borderColor = "var(--muted)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)";      e.currentTarget.style.borderColor = "var(--border)"; }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}