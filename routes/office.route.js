const express = require("express");
const auth = require("../middlewares/auth");
const {
    validateOfficePost,
    validateOfficePut,
} = require("../middlewares/validators/office.validator");
const officeController = require("../controllers/office.controller");

const router = express.Router();

router.post("/", auth(["President"]), validateOfficePost, officeController.createOffice);

router.get("/", auth(["President"]), officeController.getAllOffice);

router.get("/:officeCode", auth(["President"]), officeController.getOfficeById);

router.get("/current-office/manager-office", auth(["Manager"]), officeController.getOneOffice);

router.put("/:officeCode", auth(["President"]), validateOfficePut, officeController.updateOffice);

router.delete("/:officeCode", auth(["President"]), officeController.deleteOffice);

module.exports = router;
