const {
    getAllEmployees,
    getEmployeeById,
    createNewEmployee,
    updateInfoEmployee,
    updateOfficeCode,
    deleteEmployee,
    createEmployeeAdvance,
    deleteEmployeeAdvance,
} = require("../services/employees.service");
const {
    employeeResArrValidate,
    employeeSchema,
    employeeResByIDValidate,
} = require("../middlewares/validators/employee.validator");

const { handleErrorInAsync } = require("../middlewares/handleError/error");

exports.getAllemployeeController = handleErrorInAsync(async (req, res) => {
    const paramsFilter = req.query;
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };

    const employees = await getAllEmployees(paramsFilter, headerInfo);
    await employeeResArrValidate(employeeSchema, employees.employees);

    if (employees) {
        res.status(200).send({
            success: true,
            ...employees,
        });
    }
});

exports.getEmployeeByIDController = handleErrorInAsync(async (req, res) => {
    const { employeeNumber } = req.params;
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };
    const result = await getEmployeeById(employeeNumber, headerInfo);
    await employeeResByIDValidate(employeeSchema, result);

    res.status(200).send({
        success: true,
        message: "Info of employee",
        data: result,
    });
});

exports.createEmployeeController = handleErrorInAsync(async (req, res) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };
    const employee = req.body || {};

    const result = await createNewEmployee(employee, headerInfo);
    res.status(201).send({
        success: true,
        message: "Create successfully",
        data: result,
    });
});

exports.updateEmployeeController = handleErrorInAsync(async (req, res) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };
    const employeeInfo = req.body;
    const { employeeNumber } = req.params;

    await updateInfoEmployee(employeeInfo, employeeNumber, headerInfo);
    res.status(200).send({
        success: true,
        message: "Update successfully",
    });
});

exports.updateOfficeCode = handleErrorInAsync(async (req, res) => {
    const input = req.body;
    const employeeNumber = req.params.employeeNumber;
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };

    const result = await updateOfficeCode(employeeNumber, input, headerInfo);

    res.status(200).send({
        success: true,
        message: "Update successfully",
        data: result,
    });
});

exports.deleteEmployeeController = handleErrorInAsync(async (req, res) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };
    const { employeeNumber } = req.params;
    await deleteEmployee(employeeNumber, headerInfo);

    res.status(200).send({
        success: true,
        message: "Delete successfully",
    });
});

exports.createAdvance = handleErrorInAsync(async (req, res, next) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };
    const employee = req.body;
    const employees = await createEmployeeAdvance(employee, headerInfo);
    res.status(201).send({
        success: true,
        message: "Create successfully",
        data: employees,
    });
});

exports.deleteAdvance = handleErrorInAsync(async (req, res, next) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };
    const { employeeNumber } = req.params;
    const result = await deleteEmployeeAdvance(employeeNumber, headerInfo);
    if (result) {
        res.status(200).send({
            success: true,
            message: "Delete and transfer customers successfully",
        });
    }
});
