const router = require("express").Router();
const controller = require("../controllers/dashboardController");
const { authenticate } = require("../middleware/authMiddleware");

router.get("/", authenticate, controller.getDashboard);

module.exports = router;