const prisma = require("../utils/prismaClient");
const { validationResult } = require("express-validator");

/**
 * GET /api/products
 * Returns all products for the authenticated org.
 * Supports optional ?search= query param (name or SKU).
 */
exports.getProducts = async (req, res) => {
  const { search } = req.query;
  const { organizationId } = req.user;

  try {
    const where = {
      organizationId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { sku: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return res.json(products);
  } catch (err) {
    console.error("Get products error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET /api/products/:id
 * Returns a single product by ID (must belong to org).
 */
exports.getProduct = async (req, res) => {
  const { id } = req.params;
  const { organizationId } = req.user;

  try {
    const product = await prisma.product.findFirst({
      where: { id, organizationId },
    });

    if (!product) return res.status(404).json({ error: "Product not found" });

    return res.json(product);
  } catch (err) {
    console.error("Get product error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * POST /api/products
 * Creates a new product scoped to the authenticated org.
 */
exports.createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, sku, description, quantity, costPrice, sellingPrice, lowStock } = req.body;
  const { organizationId } = req.user;

  try {
    const existing = await prisma.product.findFirst({
      where: { sku, organizationId },
    });
    if (existing) {
      return res.status(409).json({ error: "SKU already exists in your organization" });
    }

    const product = await prisma.product.create({
      data: {
        name,
        sku,
        description,
        quantity: quantity ?? 0,
        costPrice,
        sellingPrice,
        lowStock,
        organizationId,
      },
    });

    return res.status(201).json(product);
  } catch (err) {
    console.error("Create product error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * PUT /api/products/:id
 * Updates any field of a product (including quantity directly).
 */
exports.updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { organizationId } = req.user;
  const { name, sku, description, quantity, costPrice, sellingPrice, lowStock } = req.body;

  try {
    const product = await prisma.product.findFirst({ where: { id, organizationId } });
    if (!product) return res.status(404).json({ error: "Product not found" });

    // If SKU is changing, check for conflicts
    if (sku && sku !== product.sku) {
      const skuConflict = await prisma.product.findFirst({
        where: { sku, organizationId, NOT: { id } },
      });
      if (skuConflict) {
        return res.status(409).json({ error: "SKU already exists in your organization" });
      }
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(sku !== undefined && { sku }),
        ...(description !== undefined && { description }),
        ...(quantity !== undefined && { quantity }),
        ...(costPrice !== undefined && { costPrice }),
        ...(sellingPrice !== undefined && { sellingPrice }),
        ...(lowStock !== undefined && { lowStock }),
      },
    });

    return res.json(updated);
  } catch (err) {
    console.error("Update product error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * PATCH /api/products/:id/adjust-stock
 * Adjusts quantity by a delta (+/-). More explicit than full update.
 */
exports.adjustStock = async (req, res) => {
  const { id } = req.params;
  const { delta, note } = req.body; // delta: number (can be negative)
  const { organizationId } = req.user;

  if (typeof delta !== "number") {
    return res.status(400).json({ error: "delta must be a number" });
  }

  try {
    const product = await prisma.product.findFirst({ where: { id, organizationId } });
    if (!product) return res.status(404).json({ error: "Product not found" });

    const newQuantity = product.quantity + delta;
    if (newQuantity < 0) {
      return res.status(400).json({ error: "Stock cannot go below zero" });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: { quantity: newQuantity },
    });

    return res.json({ ...updated, note });
  } catch (err) {
    console.error("Adjust stock error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * DELETE /api/products/:id
 * Hard-deletes a product (acceptable for MVP).
 */
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  const { organizationId } = req.user;

  try {
    const product = await prisma.product.findFirst({ where: { id, organizationId } });
    if (!product) return res.status(404).json({ error: "Product not found" });

    await prisma.product.delete({ where: { id } });

    return res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Delete product error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};