require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

const authRoutes = require("./routes/authRoutes");
const financialRoutes = require("./routes/financialRoutes");
const financeDashboardRoutes = require("./routes/financeDashboardRoutes");
const userManagementRoutes = require("./routes/userManagementRoutes");
const prisma = require("./utils/prismaClient");

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

// ── Debug endpoint to check users ────────────────────────────
app.get("/api/debug/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({ 
      select: { 
        id: true,
        email: true, 
        role: true,
        status: true,
        createdAt: true, 
        organization: { select: { name: true } } 
      }
    });
    res.json({ 
      totalUsers: users.length,
      users: users 
    });
  } catch (error) {
    console.error("Debug users error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ── Fix JWT_SECRET mismatch endpoint ────────────────────────
app.post("/api/debug/fix-passwords", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) {
      return res.status(400).json({ error: "Email and newPassword required" });
    }

    // Hash the new password with current JWT_SECRET
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update the user's password
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
      select: { id: true, email: true, role: true }
    });

    res.json({ 
      message: "Password updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Password fix error:", error);
    res.status(500).json({ error: "Failed to update password" });
  }
});

// ── Update user role endpoint ─────────────────────────────────
app.post("/api/debug/update-role", async (req, res) => {
  try {
    const { email, role } = req.body;
    
    if (!email || !role) {
      return res.status(400).json({ error: "Email and role required" });
    }

    if (!['VIEWER', 'ANALYST', 'ADMIN'].includes(role)) {
      return res.status(400).json({ error: "Role must be VIEWER, ANALYST, or ADMIN" });
    }

    // Update the user's role
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role },
      select: { id: true, email: true, role: true }
    });

    res.json({ 
      message: "Role updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Role update error:", error);
    res.status(500).json({ error: "Failed to update role" });
  }
});

// ── Global error handler ────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`✅ Finance Data Processing Backend running on http://localhost:${PORT}`);
});