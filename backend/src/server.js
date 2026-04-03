require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const financialRoutes = require("./routes/financialRoutes");
const financeDashboardRoutes = require("./routes/financeDashboardRoutes");
const userManagementRoutes = require("./routes/userManagementRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ 
  origin: process.env.FRONTEND_URL || ["http://localhost:3000", "https://stockflow-mvp-six.vercel.app", "https://stockflow-2qcpuy0et-abhisheksingh2002s-projects.vercel.app", "https://stockflow-ju2avldrk-abhisheksingh2002s-projects.vercel.app", "https://stockflow-1ldm83k39-abhisheksingh2002s-projects.vercel.app"],
  credentials: true
}));
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/financial-records", financialRoutes);
app.use("/api/dashboard", financeDashboardRoutes);
app.use("/api/users", userManagementRoutes);

// ── Health check ────────────────────────────────────────────
app.get("/health", (_, res) => res.json({ status: "ok" }));

// ── Global error handler ────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`✅ Finance Data Processing Backend running on http://localhost:${PORT}`);
});