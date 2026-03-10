const router = require("express").Router();
const { body } = require("express-validator");
const controller = require("../controllers/productController");
const { authenticate } = require("../middleware/authMiddleware");

// All product routes require authentication
router.use(authenticate);

const productValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("sku").trim().notEmpty().withMessage("SKU is required"),
  body("quantity").optional().isInt({ min: 0 }).withMessage("Quantity must be a non-negative integer"),
  body("costPrice").optional({ nullable: true }).isFloat({ min: 0 }),
  body("sellingPrice").optional({ nullable: true }).isFloat({ min: 0 }),
  body("lowStock").optional({ nullable: true }).isInt({ min: 0 }),
];

router.get("/", controller.getProducts);
router.get("/:id", controller.getProduct);
router.post("/", productValidation, controller.createProduct);
router.put("/:id", productValidation, controller.updateProduct);
router.patch("/:id/adjust-stock", controller.adjustStock);
router.delete("/:id", controller.deleteProduct);

module.exports = router;