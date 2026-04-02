const express = require("express");
const router = express.Router();

const financialController = require("../controllers/financialController");
const { authenticate } = require("../middleware/authMiddleware");
const { requireViewer, requireAnalyst, requireAdmin } = require("../middleware/roleMiddleware");
const { 
  createFinancialRecordValidation, 
  updateFinancialRecordValidation 
} = require("../utils/validation");

// Apply authentication to all routes
router.use(authenticate);

// GET /api/financial-records - View records (Viewer+)
router.get("/", 
  requireViewer, 
  financialController.getFinancialRecords
);

// GET /api/financial-records/:id - View specific record (Viewer+)
router.get("/:id", 
  requireViewer, 
  financialController.getFinancialRecord
);

// POST /api/financial-records - Create record (Analyst+)
router.post("/", 
  requireAnalyst,
  createFinancialRecordValidation,
  financialController.createFinancialRecord
);

// PUT /api/financial-records/:id - Update record (Analyst+)
router.put("/:id", 
  requireAnalyst,
  updateFinancialRecordValidation,
  financialController.updateFinancialRecord
);

// DELETE /api/financial-records/:id - Delete record (Admin only)
router.delete("/:id", 
  requireAdmin, 
  financialController.deleteFinancialRecord
);

module.exports = router;
