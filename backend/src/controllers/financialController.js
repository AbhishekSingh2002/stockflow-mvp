const prisma = require("../utils/prismaClient");
const { validationResult } = require("express-validator");

/**
 * GET /api/financial-records
 * Get all financial records for the organization with filtering
 */
exports.getFinancialRecords = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      type,
      category,
      startDate,
      endDate,
      search
    } = req.query;

    const where = {
      organizationId: req.user.organizationId,
    };

    // Apply filters
    if (type) {
      where.type = type.toUpperCase();
    }

    if (category) {
      where.category = category.toUpperCase();
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    if (search) {
      where.OR = [
        { description: { contains: search, mode: "insensitive" } },
        { notes: { contains: search, mode: "insensitive" } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [records, total] = await Promise.all([
      prisma.financialRecord.findMany({
        where,
        orderBy: { date: "desc" },
        skip,
        take: parseInt(limit),
      }),
      prisma.financialRecord.count({ where })
    ]);

    return res.json({
      records,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error("Get financial records error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET /api/financial-records/:id
 * Get a specific financial record
 */
exports.getFinancialRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await prisma.financialRecord.findFirst({
      where: {
        id,
        organizationId: req.user.organizationId,
      },
    });

    if (!record) {
      return res.status(404).json({ error: "Financial record not found" });
    }

    return res.json(record);
  } catch (err) {
    console.error("Get financial record error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * POST /api/financial-records
 * Create a new financial record
 */
exports.createFinancialRecord = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    amount,
    type,
    category,
    date,
    description,
    notes
  } = req.body;

  try {
    const record = await prisma.financialRecord.create({
      data: {
        amount: parseFloat(amount),
        type: type.toUpperCase(),
        category: category.toUpperCase(),
        date: new Date(date),
        description,
        notes,
        organizationId: req.user.organizationId,
      },
    });

    return res.status(201).json(record);
  } catch (err) {
    console.error("Create financial record error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * PUT /api/financial-records/:id
 * Update a financial record
 */
exports.updateFinancialRecord = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const {
    amount,
    type,
    category,
    date,
    description,
    notes
  } = req.body;

  try {
    const existingRecord = await prisma.financialRecord.findFirst({
      where: {
        id,
        organizationId: req.user.organizationId,
      },
    });

    if (!existingRecord) {
      return res.status(404).json({ error: "Financial record not found" });
    }

    const updatedRecord = await prisma.financialRecord.update({
      where: { id },
      data: {
        amount: amount ? parseFloat(amount) : undefined,
        type: type ? type.toUpperCase() : undefined,
        category: category ? category.toUpperCase() : undefined,
        date: date ? new Date(date) : undefined,
        description,
        notes,
      },
    });

    return res.json(updatedRecord);
  } catch (err) {
    console.error("Update financial record error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * DELETE /api/financial-records/:id
 * Delete a financial record
 */
exports.deleteFinancialRecord = async (req, res) => {
  const { id } = req.params;

  try {
    const existingRecord = await prisma.financialRecord.findFirst({
      where: {
        id,
        organizationId: req.user.organizationId,
      },
    });

    if (!existingRecord) {
      return res.status(404).json({ error: "Financial record not found" });
    }

    await prisma.financialRecord.delete({
      where: { id },
    });

    return res.status(204).send();
  } catch (err) {
    console.error("Delete financial record error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
