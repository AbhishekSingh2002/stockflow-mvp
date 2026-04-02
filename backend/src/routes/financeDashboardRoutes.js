const express = require("express");
const router = express.Router();

const financeDashboardController = require("../controllers/financeDashboardController");
const { authenticate } = require("../middleware/authMiddleware");
const { requireViewer, requireAnalyst } = require("../middleware/roleMiddleware");

// Apply authentication to all routes
router.use(authenticate);

// GET /api/dashboard - Basic dashboard summary (Viewer+)
router.get("/", 
  requireViewer, 
  financeDashboardController.getDashboardSummary
);

// GET /api/dashboard/analytics - Detailed analytics (Analyst+)
router.get("/analytics", 
  requireAnalyst, 
  financeDashboardController.getAnalytics
);

module.exports = router;
