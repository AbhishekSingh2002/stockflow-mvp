const prisma = require("../utils/prismaClient");

/**
 * GET /api/settings
 * Returns org-level settings.
 */
exports.getSettings = async (req, res) => {
  const { organizationId } = req.user;

  try {
    const settings = await prisma.settings.findUnique({ where: { organizationId } });

    if (!settings) {
      return res.status(404).json({ error: "Settings not found" });
    }

    return res.json(settings);
  } catch (err) {
    console.error("Get settings error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * PUT /api/settings
 * Upserts org settings. Uses upsert so it works even if settings row is missing.
 */
exports.updateSettings = async (req, res) => {
  const { organizationId } = req.user;
  const { defaultLowStockThreshold } = req.body;

  if (
    defaultLowStockThreshold === undefined ||
    typeof defaultLowStockThreshold !== "number" ||
    defaultLowStockThreshold < 0
  ) {
    return res.status(400).json({ error: "defaultLowStockThreshold must be a non-negative number" });
  }

  try {
    const settings = await prisma.settings.upsert({
      where: { organizationId },
      update: { defaultLowStockThreshold },
      create: { organizationId, defaultLowStockThreshold },
    });

    return res.json(settings);
  } catch (err) {
    console.error("Update settings error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};