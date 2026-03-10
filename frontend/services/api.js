import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const api = axios.create({ baseURL: BASE_URL });

// ── Attach token on every request ───────────────────────────
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ── Auto-redirect on 401 ────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ── Auth ────────────────────────────────────────────────────
export const authApi = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  me: () => api.get("/auth/me"),
};

// ── Products ─────────────────────────────────────────────────
export const productsApi = {
  list: (search = "") => api.get("/products", { params: { search } }),
  get: (id) => api.get(`/products/${id}`),
  create: (data) => api.post("/products", data),
  update: (id, data) => api.put(`/products/${id}`, data),
  adjustStock: (id, delta, note) => api.patch(`/products/${id}/adjust-stock`, { delta, note }),
  remove: (id) => api.delete(`/products/${id}`),
};

// ── Dashboard ─────────────────────────────────────────────────
export const dashboardApi = {
  get: () => api.get("/dashboard"),
};

// ── Settings ──────────────────────────────────────────────────
export const settingsApi = {
  get: () => api.get("/settings"),
  update: (data) => api.put("/settings", data),
};