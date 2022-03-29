const express = require("express");
const auth = require("../middlewares/auth");
const reportController = require("../controllers/report.controller");

const router = express.Router();

router.get("/revenue/by-offices", auth(["President"]), reportController.revenueByOffice);

router.get("/revenue/by-customers", auth(["President"]), reportController.revenueByCustomers);

router.get(
    "/revenue/by-product-line/:officeCode",
    auth(["President"]),
    reportController.revenueByProductLine,
);

module.exports = router;
