const prisma = require("../utils/prismaClient");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

/**
 * GET /api/users
 * Get all users in the organization (Admin only)
 */
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 50, role, status, search } = req.query;

    const where = {
      organizationId: req.user.organizationId,
    };

    if (role) {
      where.role = role.toUpperCase();
    }

    if (status) {
      where.status = status.toUpperCase();
    }

    if (search) {
      where.email = { contains: search, mode: "insensitive" };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit),
      }),
      prisma.user.count({ where })
    ]);

    return res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error("Get users error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * GET /api/users/:id
 * Get a specific user (Admin only)
 */
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        id,
        organizationId: req.user.organizationId,
      },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(user);
  } catch (err) {
    console.error("Get user error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * POST /api/users
 * Create a new user (Admin only)
 */
exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, role = "VIEWER", status = "ACTIVE" } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role.toUpperCase(),
        status: status.toUpperCase(),
        organizationId: req.user.organizationId,
      },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return res.status(201).json(user);
  } catch (err) {
    console.error("Create user error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * PUT /api/users/:id
 * Update a user (Admin only)
 */
exports.updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { email, role, status, password } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        id,
        organizationId: req.user.organizationId,
      },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if email is being changed and if it's already in use
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists) {
        return res.status(409).json({ error: "Email already in use" });
      }
    }

    const updateData = {};
    if (email) updateData.email = email;
    if (role) updateData.role = role.toUpperCase();
    if (status) updateData.status = status.toUpperCase();
    if (password) updateData.password = await bcrypt.hash(password, SALT_ROUNDS);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        updatedAt: true,
      },
    });

    return res.json(updatedUser);
  } catch (err) {
    console.error("Update user error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * DELETE /api/users/:id
 * Delete a user (Admin only)
 */
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        id,
        organizationId: req.user.organizationId,
      },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prevent admins from deleting themselves
    if (id === req.user.userId) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }

    await prisma.user.delete({
      where: { id },
    });

    return res.status(204).send();
  } catch (err) {
    console.error("Delete user error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
