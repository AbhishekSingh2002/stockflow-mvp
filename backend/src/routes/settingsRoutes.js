const router = require("express").Router();
const controller = require("../controllers/settingsController");
const { authenticate } = require("../middleware/authMiddleware");

router.use(authenticate);

router.get("/", controller.getSettings);
router.put("/", controller.updateSettings);

module.exports = router;