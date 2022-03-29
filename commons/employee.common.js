const Employee = require("../models/employee.model");
const Office = require("../models/office.model");
const Customer = require("../models/customer.model");
const { raw } = require("objection");
const getAll = async (
    page = 1,
    size = 10,
    orderBy = "employeeNumber",
    type = "asc",
    searchQuery,
) => {
    try {
        let employees;
        let array = [];
        let string = "";
        for (let key in searchQuery) {
            array.push(`${key} like "%${searchQuery[key]}%"`);
        }

        if (array.length == 1) {
            string += array[0];
        }

        if (array.length > 1) {
            string = array.join(" and ");
        }

        employees = await Employee.query()
            .where(raw(string))
            .orderBy(orderBy, type)
            .page(page - 1, size);

        return {
            page: page,
            total: employees.results.length,
            employees: employees.results,
        };
    } catch (error) {
        throw error;
    }
};

const getById = async (employeeNumber) => {
    try {
        const employee = await Employee.query().findOne({ employeeNumber: employeeNumber });
        return employee;
    } catch (error) {
        throw error;
    }
};

const getByEmail = async (email) => {
    try {
        const employee = await Employee.query().findOne({ email: email });
        return employee;
    } catch (error) {
        throw error;
    }
};

const getByReportTo = async (reportsTo) => {
    try {
        const employee = await Employee.query().findOne({ reportsTo: reportsTo });
        return employee;
    } catch (error) {
        throw error;
    }
};

const getByIdAndLastNameDefault = async (employeeNumber, lastNameDefault) => {
    try {
        const employee = await Employee.query().findOne({
            employeeNumber: employeeNumber,
            lastName: lastNameDefault,
        });
        return employee;
    } catch (error) {
        throw error;
    }
};
const getByOfficeCodeAndDefaultLastName = async (officeCode, headerInfo) => {
    try {
        const employee = await Employee.query().findOne({
            lastName: "99999",
            officeCode,
        });
        return employee;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const deleteEmployee = async (employeeNumber) => {
    const result = Employee.query().delete().where({ employeeNumber });
    return result;
};

const updateEmployee = async (employeeInfo, employeeNumber) => {
    const result = Employee.query().update(employeeInfo).findOne("employeeNumber", employeeNumber);
    return result;
};

const employeeNumberOrWhereNot99999 = async (employeeNumber) => {
    const result = Employee.query()
        .findOne({
            employeeNumber,
        })
        .whereNot({ lastName: "99999" });

    return result;
};
const updateMutipleCustomer = async (condition, employeeNumber, headerInfo) => {
    try {
        const customer = await Customer.query()
            .select("customerNumber")
            .where("salesRepEmployeeNumber", employeeNumber);

        console.log("Line 90", customer);
        const customerNumberArray = customer.map((item) => {
            return item.customerNumber;
        });
        const result = await Customer.query()
            .patch(condition)
            .whereIn("customerNumber", customerNumberArray);
        if (result) {
            return result;
        }
    } catch (error) {
        throw error;
    }
};

const getEmployeeInOfficeUseModifyGraph = async (officeCode, reportsTo, order) => {
    const employee = await Employee.query()
        .where({ officeCode, reportsTo })
        .orWhere({ employeeNumber: reportsTo })
        .withGraphFetched("customers")
        .modifyGraph("customers", (builder) => {
            builder.where({ customerNumber: order.customerNumber });
        });
    return employee;
};

const getEmployeeInOffice = async (officeCode, reportsTo) => {
    const employees = await Employee.query()
        .where({ officeCode, reportsTo })
        .orWhere({ employeeNumber: reportsTo })
        .withGraphFetched("customers");
    return employees;
};

module.exports = {
    getAll,
    getById,
    getByEmail,
    getByReportTo,
    getByIdAndLastNameDefault,
    getByOfficeCodeAndDefaultLastName,
    deleteEmployee,
    updateMutipleCustomer,
    employeeNumberOrWhereNot99999,
    updateEmployee,
    getEmployeeInOfficeUseModifyGraph,
    getEmployeeInOffice,
};
