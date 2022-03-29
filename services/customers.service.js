const { AppError } = require("../middlewares/handleError/error");
const { loggerToDb } = require("../commons/logger.common");
const Customer = require("../models/customer.model");
const Employee = require("../models/employee.model");
const customerCommon = require("../commons/customer.common");
const employCommon = require("../commons/employee.common");

const getAllCustomers = async (paramsFilter) => {
    let { page, size, orderBy, type, ...searchQuery } = paramsFilter;
    const results = await customerCommon.getAll(page, size, orderBy, type, searchQuery);

    return results;
};

const getAllCustomerOfEmployeeInSameOffice = async (
    officeCode,
    reportsTo,
    headerInfo,
    paramsFilter,
) => {
    try {
        const customers = await customerCommon.getCustomerFromEmployeeLeader(
            officeCode,
            reportsTo,
            paramsFilter,
        );
        if (!customers.length) {
            throw new AppError("Unable to find data that meets the requirements !", 404);
        }

        return customers;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const getAllCustomerOfOwnEmployee = async (employeeNumber, headerInfo, paramsFilter) => {
    const customers = await Customer.query().where({
        ...paramsFilter,
        salesRepEmployeeNumber: employeeNumber,
    });
    return customers;
};

const getCustomerById = async (customerNumber, headerInfo) => {
    try {
        const customer = await customerCommon.getById(customerNumber);
        if (!customer) {
            throw new AppError(`Customer not found!`, 400, "Not Found!");
        }
        return customer;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

// // get customer by id belongs to current employees in the same office code
const getCustomerByIdReportToOfficeCode = async (
    customerNumber,
    officeCode,
    reportsTo,
    headerInfo,
) => {
    try {
        const isValidCustomerNumber = await Customer.query().findOne({ customerNumber });
        if (!isValidCustomerNumber) {
            throw new AppError(`Customer not found!`, 400, "Not Found!");
        }

        const employee = await customerCommon.getCustomerByIDFromEmployeeLeader(
            officeCode,
            reportsTo,
            customerNumber,
        );

        const isValidCustomerInEmployee = employee.every((item) => {
            return item.customers.length === 0;
        });

        if (isValidCustomerInEmployee) {
            throw new AppError("Do not param customer in employee", 400);
        }

        const result = employee.filter((item) => {
            return item.customers.length;
        });

        return result[0].customers[0];
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const getCustomerByIdOwnEmployee = async (salesRepEmployeeNumber, customerNumber, headerInfo) => {
    try {
        const isValidCustomerNumber = await customerCommon.getById(customerNumber);
        if (!isValidCustomerNumber) {
            throw new AppError(`Customer not found!`, 400, "Not Found!");
        }

        const customer = await Customer.query().findOne({
            customerNumber,
            salesRepEmployeeNumber,
        });

        if (!customer) {
            throw new AppError(`You do not have access to this customer information`, 400);
        }
        return customer;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

// President, Manager
const createNewCustomer = async (customer, headerInfo) => {
    try {
        const isValidEmployeeNumber = await Employee.query().findOne({
            employeeNumber: customer.salesRepEmployeeNumber,
        });

        if (!isValidEmployeeNumber) {
            throw new AppError(
                `salesRepEmployeeNumber=${customer.salesRepEmployeeNumber} is invalid!`,
                400,
            );
        }
        const newCustomer = await Customer.query().insert(customer);
        return newCustomer;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

// Staff
const createCustomerBelongToCurrentEmployee = async (customer, employeeNumber, headerInfo) => {
    try {
        const isValidEmployeeNumber = await Employee.query().findOne({
            employeeNumber: customer.salesRepEmployeeNumber,
        });

        if (!isValidEmployeeNumber) {
            throw new AppError(
                `salesRepEmployeeNumber=${customer.salesRepEmployeeNumber} is invalid!`,
                400,
            );
        }
        if (customer.salesRepEmployeeNumber !== employeeNumber) {
            throw new AppError(
                `Customer only create by salesRepEmployeeNumber=${employeeNumber} ! Try again!`,
                400,
            );
        }
        const result = await Customer.query().insert(customer);
        return result;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

// Leader
const createCustomerBelongToEmployeeOffice = async (
    customer,
    reportsTo,
    officeCode,
    headerInfo,
) => {
    try {
        const isValidEmployeeNumber = await employCommon.getById(customer.salesRepEmployeeNumber);

        if (!isValidEmployeeNumber) {
            throw new AppError(
                `salesRepEmployeeNumber=${customer.salesRepEmployeeNumber} is invalid!`,
                400,
            );
        }
        const employees = await customerCommon.getEmployeeByOfficeAndReport(reportsTo, officeCode);

        const arrayEmployees = employees.map((item) => {
            return item.employeeNumber;
        });

        if (!arrayEmployees.includes(customer.salesRepEmployeeNumber)) {
            throw new AppError(
                `Customer only create by employees who reports to ${reportsTo} and in the same office`,
                400,
                "Failed",
            );
        }
        const result = await Customer.query().insert(customer);
        return result;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const updateInfoCustomer = async (updateCustomer, customerNumber, headerInfo) => {
    try {
        const isValidCustomerNumber = await customerCommon.getById(customerNumber);

        if (!isValidCustomerNumber) {
            throw new AppError("CustomerNumber is invalid!", 400);
        }
        const isValidEmployeeNumber = await employCommon.getById(
            updateCustomer.salesRepEmployeeNumber,
        );

        if (!isValidEmployeeNumber) {
            throw new AppError(
                `salesRepEmployeeNumber=${updateCustomer.salesRepEmployeeNumber} is invalid!`,
                400,
            );
        }

        const results = await customerCommon.upCustomer(updateCustomer, customerNumber);
        return results;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const updateCustomerBelongToEmployeeOffice = async (
    customer,
    reportsTo,
    officeCode,
    customerNumber,
    headerInfo,
) => {
    try {
        const isValidCustomerNumber = await customerCommon.getById(customerNumber);

        if (!isValidCustomerNumber) {
            throw new AppError("CustomerNumber is invalid!", 400);
        }

        const isValidEmployeeNumber = await Employee.query().findOne({
            employeeNumber: customer.salesRepEmployeeNumber,
        });

        if (!isValidEmployeeNumber) {
            throw new AppError("EmployeeNumber is invalid!", 400);
        }

        const employees = await customerCommon.getEmployeeByOfficeAndReport(reportsTo, officeCode);
        const arrayOfEmployees = employees.map((item) => {
            return item.employeeNumber;
        });

        if (!arrayOfEmployees.includes(customer.salesRepEmployeeNumber)) {
            throw new AppError(
                `Customer only update by employees who reports to ${reportsTo} and in the same office`,
                400,
                "Failed",
            );
        }

        const result = await customerCommon.upCustomer(customer, customerNumber);

        return result;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const deleteCustomer = async (customerNumber, headerInfo) => {
    try {
        const isValidCustomerNumber = await customerCommon.getById(customerNumber);

        if (!isValidCustomerNumber) {
            throw new AppError("CustomerNumber is invalid", 400, "Failed");
        }
        const result = await customerCommon.deleteCustomer(customerNumber);
        return result;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const deleteCustomerBelongToEmployeeOffice = async (
    reportsTo,
    officeCode,
    customerNumber,
    headerInfo,
) => {
    try {
        const customer = await customerCommon.getById(customerNumber);

        if (!customer) {
            throw new AppError("CustomerNumber is invalid!", 400);
        }

        const isValidEmployeeNumber = await Employee.query().findOne({
            employeeNumber: customer.salesRepEmployeeNumber,
        });

        if (!isValidEmployeeNumber) {
            throw new AppError("EmployeeNumber is invalid!", 400);
        }

        const employees = await customerCommon.getEmployeeByOfficeAndReport(reportsTo, officeCode);

        const arrayEmployees = employees.map((item) => {
            return item.employeeNumber;
        });

        if (!arrayEmployees.includes(customer.salesRepEmployeeNumber)) {
            throw new AppError("You do not have permission to delete this customer", 401);
        }
        const result = await customerCommon.deleteCustomer(customerNumber);
        return result;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};
module.exports = {
    getAllCustomers,
    createNewCustomer,
    updateInfoCustomer,
    deleteCustomer,
    getCustomerById,
    getAllCustomerOfEmployeeInSameOffice,
    getAllCustomerOfOwnEmployee,
    getCustomerByIdReportToOfficeCode,
    getCustomerByIdOwnEmployee,
    createCustomerBelongToCurrentEmployee,
    createCustomerBelongToEmployeeOffice,
    updateCustomerBelongToEmployeeOffice,
    deleteCustomerBelongToEmployeeOffice,
};
