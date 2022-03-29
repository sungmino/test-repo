const { AppError } = require("../middlewares/handleError/error");
const Employee = require("../models/employee.model");
const { loggerToDb } = require("../commons/logger.common");

const officeCommon = require("../commons/office.common");
const employeeCommon = require("../commons/employee.common");

/*-------------------------- Service----------------------------*/

const getAllEmployees = async (paramsFilter) => {
    let { page, size, orderBy, type, ...searchQuery } = paramsFilter;
    const employees = await employeeCommon.getAll(page, size, orderBy, type, searchQuery);
    return employees;
};

const getEmployeeById = async (employeeNumber, headerInfo) => {
    try {
        const employee = await employeeCommon.getById(employeeNumber);
        if (!employee) {
            throw new AppError("EmployeeNumber is invalid", 400);
        }
        return employee;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const createNewEmployee = async (employee, headerInfo) => {
    try {
        const isValidReportsTo = await employeeCommon.getById(employee.reportsTo);
        if (!isValidReportsTo) {
            throw new AppError("ReportsTo is invalid", 400);
        }

        const isValidOfficeCode = await officeCommon.getById(employee.officeCode);
        if (!isValidOfficeCode) {
            throw new AppError("OfficeCode is invalid", 400);
        }
        const isDuplicateEmail = await employeeCommon.getByEmail(employee.email);
        if (isDuplicateEmail) {
            throw new AppError("Email cannot be dupplicate", 409);
        }

        const newEmployee = await Employee.query().insert(employee);
        return newEmployee;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const updateInfoEmployee = async (employeeInfo, employeeNumber, headerInfo) => {
    try {
        const employee = await employeeCommon.getById(employeeNumber);
        if (!employee) {
            throw new AppError("EmployeeNumber is invalid", 400);
        }

        const isValidReportsTo = await employeeCommon.getByReportTo(employeeInfo.reportsTo);

        if (!isValidReportsTo) {
            throw new AppError("ReportsTo is invalid", 400);
        }

        const { lastName, firstName } = employee;
        if (employeeInfo.lastName !== lastName || employeeInfo.firstName !== firstName) {
            throw new AppError("LastName or FirstName can not change", 400);
        }

        const isValidOfficeCode = await officeCommon.getById(employeeInfo.officeCode);

        if (!isValidOfficeCode) {
            throw new AppError("OfficeCode is invalid", 400);
        }

        const isDuplicateEmail = await employeeCommon.getByEmail(
            employee.email === employeeInfo.email ? "" : employeeInfo.email,
        );

        if (isDuplicateEmail) {
            throw new AppError("Email cannot be dupplicate", 409);
        }

        const result = await employeeCommon.updateEmployee(employeeInfo, employeeNumber);

        return result;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const deleteEmployee = async (employeeNumber, headerInfo) => {
    try {
        const isValidEmployeeNumber = await employeeCommon.getById(employeeNumber);

        if (!isValidEmployeeNumber) {
            throw new AppError("EmployeeNumber is invalid or Cannot delete this employee", 400);
        }

        const lastNameDefault = "99999";
        const isDefaultEmployee = await employeeCommon.getByIdAndLastNameDefault(
            employeeNumber,
            lastNameDefault,
        );

        if (isDefaultEmployee) {
            throw new AppError("You cannot delete this employee!", 400);
        }

        const result = await employeeCommon.deleteEmployee(employeeNumber);

        return result;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const createEmployeeAdvance = async (employee, headerInfo) => {
    try {
        const isValidReportsTo = await employeeCommon.getById(employee.reportsTo);
        if (!isValidReportsTo) {
            throw new AppError("ReportsTo is invalid", 400);
        }

        const isValidOfficeCode = await officeCommon.getById(employee.officeCode);
        if (!isValidOfficeCode) {
            throw new AppError("OfficeCode is invalid", 400);
        }
        const isDuplicateEmail = await employeeCommon.getByEmail(employee.email);
        if (isDuplicateEmail) {
            throw new AppError("Email cannot be dupplicate", 409);
        }

        const employees = await Employee.query().insertGraph(employee);
        return employees;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const deleteEmployeeAdvance = async (employeeNumber, headerInfo) => {
    try {
        const employee = await employeeCommon.employeeNumberOrWhereNot99999(employeeNumber);
        if (!employee) {
            throw new AppError("EmployeeNumber is invalid or Cannot delete this employee", 400);
        }
        const { officeCode } = employee;

        const defaultEmployee = await employeeCommon.getByOfficeCodeAndDefaultLastName(officeCode);

        const { employeeNumber: newEmployeeNumber } = defaultEmployee;

        const update = await employeeCommon.updateMutipleCustomer(
            { salesRepEmployeeNumber: newEmployeeNumber },
            employeeNumber,
        );

        const result = await employeeCommon.deleteEmployee(employeeNumber);
        return result;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createNewEmployee,
    updateInfoEmployee,
    deleteEmployee,
    createEmployeeAdvance,
    deleteEmployeeAdvance,
};
