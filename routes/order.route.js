const express = require("express");
const auth = require("../middlewares/auth");

const ordersController = require("../controllers/order.controller");
const {
    validateBodyPost,
    validateBodyUpdateStatus,
} = require("../middlewares/validators/order.validator");

const router = express.Router();

//get all orders
router.get(
    "/",
    auth(["President", "Manager", "Leader", "Staff", "Customer"]),
    ordersController.getAllOrdersController,
);

// get orders by id
router.get(
    "/:orderNumber",
    auth(["President", "Manager", "Leader", "Staff", "Customer"]),
    ordersController.getOrdersByIdController,
);

router.post("/", auth(["Customer"]), validateBodyPost, ordersController.createOrderController);

router.patch("/:orderNumber", auth(["Customer"]), ordersController.updateOrderController);

router.patch(
    "/update/status-to-onhold",
    auth(["Manager"]),
    ordersController.updateStatusOnHoldController,
);

router.patch(
    "/update/status-shipped/",
    auth(["Manager"]),
    validateBodyUpdateStatus,
    ordersController.updateStatusShippedController,
);
router.delete("/:orderNumber", auth(["Manager"]), ordersController.deleteOrderController);

module.exports = router;
