const express = require("express");
const auth = require("../middlewares/auth");

const customerController = require("../controllers/customer.controller");
const { createCustomer } = require("../services/customers.service");
const { validateAccCustomer } = require("../middlewares/validators/user.validator");
const {
    validateCustomer,
    validateParams,
} = require("../middlewares/validators/customer.validator");

const router = express.Router();

//get all customers
router.get(
    "/",
    auth(["President", "Manager", "Leader", "Staff"]),
    validateParams,
    customerController.getAllCustomerController,
);

// get customer by id
router.get(
    "/:customerNumber",
    auth(["President", "Manager", "Leader", "Staff"]),
    customerController.getCustomerByIdController,
);

router.post(
    "/",
    auth(["President", "Manager", "Leader", "Staff"]),
    validateCustomer,
    customerController.createCustomerController,
);

router.put(
    "/:customerNumber",
    auth(["President", "Manager", "Leader"]),
    validateCustomer,
    customerController.updateCustomerController,
);

router.delete(
    "/:customerNumber",
    auth(["President", "Manager", "Leader"]),
    customerController.deleteCustomerController,
);

module.exports = router;
