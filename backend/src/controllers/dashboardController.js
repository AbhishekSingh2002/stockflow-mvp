const prisma = require("../utils/prismaClient");

/**
 * GET /api/dashboard
 * Returns aggregated inventory stats for the org:
 * - totalProducts
 * - totalQuantity
 * - lowStockItems (products at or below their threshold)
 */
exports.getDashboard = async (req, res) => {
  const { organizationId } = req.user;

  try {
    // Fetch settings and all products in parallel
    const [settings, products] = await Promise.all([
      prisma.settings.findUnique({ where: { organizationId } }),
      prisma.product.findMany({ where: { organizationId } }),
    ]);

    const defaultThreshold = settings?.defaultLowStockThreshold ?? 5;

    const totalProducts = products.length;
    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

    const lowStockItems = products.filter((p) => {
      const threshold = p.lowStock ?? defaultThreshold;
      return p.quantity <= threshold;
    });

    return res.json({
      totalProducts,
      totalQuantity,
      defaultThreshold,
      lowStockItems: lowStockItems.map((p) => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        quantity: p.quantity,
        lowStock: p.lowStock ?? defaultThreshold,
      })),
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};