const express = require("express");
const auth = require("../middlewares/auth");
const {
    validateProduct,
    validateProductUpdate,
} = require("../middlewares/validators/product.validator");
const productController = require("../controllers/product.controller");

const router = express.Router();

router.get(
    "/",
    auth(["President", "Manager", "Leader", "Staff"]),
    productController.getAllProductController,
);

router.get(
    "/:productCode",
    auth(["President", "Manager", "Leader", "Staff"]),
    productController.getProductByIDController,
);

router.post(
    "/",
    auth(["President", "Manager", "Leader", "Staff"]),
    validateProduct,
    productController.createProductController,
);

router.put(
    "/:productCode",
    auth(["President", "Manager", "Leader", "Staff"]),
    validateProductUpdate,
    productController.updateProductController,
);

router.delete(
    "/:productCode",
    auth(["President", "Manager", "Leader", "Staff"]),
    productController.deleteProductController,
);
module.exports = router;
