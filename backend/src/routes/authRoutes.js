const router = require("express").Router();
const { body } = require("express-validator");
const controller = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

const signupValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("organizationName").trim().notEmpty().withMessage("Organization name required"),
];

const loginValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
];

router.post("/signup", signupValidation, controller.signup);
router.post("/login", loginValidation, controller.login);
router.get("/me", authenticate, controller.me);

module.exports = router;