const { body } = require("express-validator");

// Financial record validation
exports.createFinancialRecordValidation = [
  body("amount")
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be a positive number"),
  body("type")
    .isIn(["INCOME", "EXPENSE"])
    .withMessage("Type must be either INCOME or EXPENSE"),
  body("category")
    .isIn(["SALARY", "RENT", "UTILITIES", "FOOD", "TRANSPORT", "ENTERTAINMENT", "HEALTHCARE", "EDUCATION", "INVESTMENT", "OTHER"])
    .withMessage("Invalid category"),
  body("date")
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),
  body("description")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Description must be less than 255 characters"),
  body("notes")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Notes must be less than 1000 characters")
];

exports.updateFinancialRecordValidation = [
  body("amount")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("Amount must be a positive number"),
  body("type")
    .optional()
    .isIn(["INCOME", "EXPENSE"])
    .withMessage("Type must be either INCOME or EXPENSE"),
  body("category")
    .optional()
    .isIn(["SALARY", "RENT", "UTILITIES", "FOOD", "TRANSPORT", "ENTERTAINMENT", "HEALTHCARE", "EDUCATION", "INVESTMENT", "OTHER"])
    .withMessage("Invalid category"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),
  body("description")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 255 })
    .withMessage("Description must be less than 255 characters"),
  body("notes")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Notes must be less than 1000 characters")
];

// User management validation
exports.createUserValidation = [
  body("email")
    .isEmail()
    .withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(["VIEWER", "ANALYST", "ADMIN"])
    .withMessage("Role must be VIEWER, ANALYST, or ADMIN"),
  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Status must be ACTIVE or INACTIVE")
];

exports.updateUserValidation = [
  body("email")
    .optional()
    .isEmail()
    .withMessage("Valid email is required"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .optional()
    .isIn(["VIEWER", "ANALYST", "ADMIN"])
    .withMessage("Role must be VIEWER, ANALYST, or ADMIN"),
  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE"])
    .withMessage("Status must be ACTIVE or INACTIVE")
];
