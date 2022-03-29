const express = require("express");
const auth = require("../middlewares/auth");
const { validateEmployee } = require("../middlewares/validators/employee.validator");
const { validateEmployeeCus } = require("../middlewares/validators/employeeCus.validator");
const employeeController = require("../controllers/employee.controller");

const router = express.Router();

router.get(
    "/",
    auth(["President", "Manager", "Leader"]),
    employeeController.getAllemployeeController,
);

router.get(
    "/:employeeNumber",
    auth(["President", "Manager", "Leader"]),
    employeeController.getEmployeeByIDController,
);

router.post(
    "/",
    auth(["President", "Manager"]),
    validateEmployee,
    employeeController.createEmployeeController,
);

router.post(
    "/advance",
    auth(["President", "Manager"]),
    validateEmployeeCus,
    employeeController.createAdvance,
);

router.delete("/advance/:employeeNumber", auth(["President"]), employeeController.deleteAdvance);

router.put(
    "/:employeeNumber",
    auth(["President", "Manager"]),
    validateEmployee,
    employeeController.updateEmployeeController,
);

router.patch(
    "/update-office-code/by-boss/:employeeNumber",
    auth(["President"]),
    employeeController.updateOfficeCode,
);

router.delete("/:employeeNumber", auth(["President"]), employeeController.deleteEmployeeController);

module.exports = router;
