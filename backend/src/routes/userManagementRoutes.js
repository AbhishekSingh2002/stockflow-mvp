const express = require("express");
const router = express.Router();

const userManagementController = require("../controllers/userManagementController");
const { authenticate } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");
const { createUserValidation, updateUserValidation } = require("../utils/validation");

// Apply authentication to all routes
router.use(authenticate);

// All user management routes require Admin role
router.use(requireAdmin);

// GET /api/users - Get all users
router.get("/", userManagementController.getUsers);

// GET /api/users/:id - Get specific user
router.get("/:id", userManagementController.getUser);

// POST /api/users - Create new user
router.post("/", 
  createUserValidation,
  userManagementController.createUser
);

// PUT /api/users/:id - Update user
router.put("/:id", 
  updateUserValidation,
  userManagementController.updateUser
);

// DELETE /api/users/:id - Delete user
router.delete("/:id", userManagementController.deleteUser);

module.exports = router;
