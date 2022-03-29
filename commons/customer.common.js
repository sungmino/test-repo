const { AppError } = require("../middlewares/handleError/error");
const Customer = require("../models/customer.model");
const Employee = require("../models/employee.model");
const { raw } = require("objection");
const getAll = async (
    page = 1,
    size = 10,
    orderBy = "customerNumber",
    type = "asc",
    searchQuery,
) => {
    try {
        let customers;
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

        customers = await Customer.query()
            .where(raw(string))
            .orderBy(orderBy, type)
            .page(page - 1, size);

        return {
            page: page,
            total: customers.results.length,
            customers: customers.results,
        };
    } catch (error) {
        throw error;
    }
};

const getById = async (customerNumber) => {
    try {
        const customer = await Customer.query().findOne({ customerNumber: customerNumber });
        return customer;
    } catch (error) {
        throw error;
    }
};

const getCustomerFromEmployeeLeader = async (officeCode, reportsTo, paramsFilter) => {
    const { page, pageSize, ...queryFilter } = paramsFilter;
    const employees = await Employee.query()
        .where({ officeCode, reportsTo })
        .withGraphFetched("customers");

    if (!employees.length) {
        throw new AppError("Unable to find data that meets the requirements !", 404);
    }
    const customers = employees.map((item) => {
        return item.customers;
    });

    if (Object.keys(queryFilter).length > 0) {
        let filteredCustomer;

        for (let key in queryFilter) {
            filteredCustomer = customers.flat().filter((item) => {
                return item[`${key}`] == queryFilter[`${key}`];
            });
        }

        return filteredCustomer;
    }

    return customers.flat();
};

const getCustomerByIDFromEmployeeLeader = async (officeCode, reportsTo, customerNumber) => {
    const result = Employee.query()
        .where({ officeCode, reportsTo })
        .withGraphFetched("customers")
        .modifyGraph("customers", (builder) => {
            builder.where({ customerNumber });
        });
    return result;
};

const getEmployeeByOfficeAndReport = async (reportsTo, officeCode) => {
    const result = Employee.query().where({
        reportsTo,
        officeCode,
    });
    return result;
};

const upCustomer = async (updateCustomer, customerNumber) => {
    const result = Customer.query()
        .update(updateCustomer)
        .where({ customerNumber: customerNumber });
    return result;
};

const deleteCustomer = async (customerNumber) => {
    const result = Customer.query().delete().where({
        customerNumber: customerNumber,
    });
    return result;
};

const getCustomerOfStaffWithGraphFetched = async (employeeNumber) => {
    const customers = await Customer.query()
        .where({
            salesRepEmployeeNumber: employeeNumber,
        })
        .withGraphFetched("orders");
    return customers;
};

const getCustomerOfStaffUseModifyGraph = async (employeeNumber, orderNumber) => {
    const customers = await Customer.query()
        .where({ salesRepEmployeeNumber: employeeNumber })
        .withGraphFetched("orders")
        .modifyGraph("orders", (builder) => {
            builder.where({ orderNumber });
        });
    return customers;
};

module.exports = {
    getAll,
    getById,
    getCustomerFromEmployeeLeader,
    getCustomerByIDFromEmployeeLeader,
    getEmployeeByOfficeAndReport,
    upCustomer,
    deleteCustomer,
    getCustomerOfStaffWithGraphFetched,
    getCustomerOfStaffUseModifyGraph,
};
