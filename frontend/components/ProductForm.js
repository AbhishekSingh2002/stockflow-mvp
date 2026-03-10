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

/**
 * ProductForm – reusable for both create and edit.
 * @param {object} [initialData] - Pre-fills form for editing
 * @param {function} onSubmit - Called with form data on submit
 * @param {function} onCancel - Called when user cancels
 * @param {boolean} loading - Disables submit button while saving
 */
export default function ProductForm({ initialData = {}, onSubmit, onCancel, loading = false }) {
  const [form, setForm] = useState({ ...INITIAL_FORM, ...initialData });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.sku.trim()) errs.sku = "SKU is required";
    if (form.quantity < 0) errs.quantity = "Quantity cannot be negative";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) return setErrors(errs);

    onSubmit({
      name: form.name.trim(),
      sku: form.sku.trim().toUpperCase(),
      description: form.description.trim() || null,
      quantity: Number(form.quantity),
      costPrice: form.costPrice !== "" ? Number(form.costPrice) : null,
      sellingPrice: form.sellingPrice !== "" ? Number(form.sellingPrice) : null,
      lowStock: form.lowStock !== "" ? Number(form.lowStock) : null,
    });
  };

  const Field = ({ label, name, type = "text", placeholder, required }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors[name] ? "border-red-400" : "border-gray-300"
        }`}
      />
      {errors[name] && <p className="mt-1 text-xs text-red-500">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Product Name" name="name" placeholder="e.g. Wireless Mouse" required />
        <Field label="SKU" name="sku" placeholder="e.g. WM-100" required />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Optional product description"
          rows={2}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Qty on Hand" name="quantity" type="number" required />
        <Field label="Cost Price ($)" name="costPrice" type="number" placeholder="0.00" />
        <Field label="Selling Price ($)" name="sellingPrice" type="number" placeholder="0.00" />
      </div>

      <Field
        label="Low Stock Threshold"
        name="lowStock"
        type="number"
        placeholder="Uses global default if empty"
      />

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-md text-sm font-medium transition"
        >
          {loading ? "Saving…" : "Save Product"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-gray-300 px-5 py-2 rounded-md text-sm font-medium hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}