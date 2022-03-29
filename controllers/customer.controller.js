const {
    getAllCustomers,
    createNewCustomer,
    updateInfoCustomer,
    deleteCustomer,
    getCustomerById,
    getCustomerByIdReportToOfficeCode,
    getAllCustomerOfEmployeeInSameOffice,
    getAllCustomerOfOwnEmployee,
    getCustomerByIdOwnEmployee,
    createCustomerBelongToCurrentEmployee,
    createCustomerBelongToEmployeeOffice,
    updateCustomerBelongToEmployeeOffice,
    deleteCustomerBelongToEmployeeOffice,
} = require("../services/customers.service");
const {
    customerSchema,
    customerResArrValidate,
    customerResByIDValidate,
} = require("../middlewares/validators/customer.validator");

const { handleErrorInAsync } = require("../middlewares/handleError/error");

exports.getAllCustomerController = handleErrorInAsync(async (req, res) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };

    const paramsFilter = req.query;

    let customers;
    const { employeeNumber, officeCode, jobTitle } = res.locals.authData;
    switch (jobTitle) {
        case "Leader":
            customers = await getAllCustomerOfEmployeeInSameOffice(
                officeCode,
                employeeNumber,
                headerInfo,
                paramsFilter,
            );
            // Validate response
            await customerResArrValidate(customerSchema, customers);

            res.status(200).send({
                success: true,
                total: customers.length,
                data: customers,
            });

            break;
        case "Staff":
            customers = await getAllCustomerOfOwnEmployee(employeeNumber, headerInfo, paramsFilter);
            // Validate response
            await customerResArrValidate(customerSchema, customers.data);
            res.status(200).send({
                success: true,
                total: customers.length,
                data: customers.data,
            });
            break;
        case "President":
        case "Manager":
            customers = await getAllCustomers(paramsFilter);

            // Validate response
            await customerResArrValidate(customerSchema, customers.customers);

            res.status(200).send({
                success: true,
                ...customers,
            });
            break;
        default:
            break;
    }
});

exports.getCustomerByIdController = handleErrorInAsync(async (req, res) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };
    const { customerNumber } = req.params;
    const { employeeNumber, officeCode, jobTitle } = res.locals.authData;
    let customer;
    switch (jobTitle) {
        case "Leader":
            customer = await getCustomerByIdReportToOfficeCode(
                customerNumber,
                officeCode,
                employeeNumber,
                headerInfo,
            );
            // Validate response
            await customerResByIDValidate(customerSchema, customer);
            res.status(200).send({
                success: true,
                message: "Information a customer by customerNumber",
                data: customer,
            });
            break;
        case "Staff":
            customer = await getCustomerByIdOwnEmployee(employeeNumber, customerNumber, headerInfo);
            res.status(200).send({
                success: true,
                data: customer,
            });
            // Validate response
            await customerResByIDValidate(customerSchema, customer);
            break;
        case "President":
        case "Manager":
            customer = await getCustomerById(customerNumber, headerInfo);

            // Validate response
            await customerResByIDValidate(customerSchema, customer);

            res.status(200).send({
                success: true,
                data: customer,
            });
            break;
        default:
            break;
    }
});

exports.createCustomerController = handleErrorInAsync(async (req, res) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };

    const customer = req.body || {};
    const { employeeNumber, officeCode, jobTitle } = res.locals.authData;
    let newCustomer;
    switch (jobTitle) {
        case "Staff":
            newCustomer = await createCustomerBelongToCurrentEmployee(
                customer,
                employeeNumber,
                headerInfo,
            );
            res.status(201).send({
                success: true,
                message: "Create a new customer successfully",
                data: newCustomer,
            });
            break;
        case "Leader":
            newCustomer = await createCustomerBelongToEmployeeOffice(
                customer,
                employeeNumber,
                officeCode,
                headerInfo,
            );
            res.status(201).send({
                success: true,
                message: "Create a new customer successfully",
                data: newCustomer,
            });
            break;
        case "President":
        case "Manager":
            newCustomer = await createNewCustomer(customer, headerInfo);
            res.status(201).send({
                success: true,
                message: "Create a new customer successfully",
                data: newCustomer,
            });
            break;
        default:
            break;
    }
});

exports.updateCustomerController = handleErrorInAsync(async (req, res) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };
    const customer = req.body || {};
    const { customerNumber } = req.params;
    const { employeeNumber, officeCode, jobTitle } = res.locals.authData;

    switch (jobTitle) {
        case "Leader":
            await updateCustomerBelongToEmployeeOffice(
                customer,
                employeeNumber,
                officeCode,
                customerNumber,
                headerInfo,
            );

            res.status(200).send({
                success: true,
                message: "Update information successfully",
            });

            break;
        case "President":
        case "Manager":
            await updateInfoCustomer(customer, customerNumber, headerInfo);

            res.status(200).send({
                success: true,
                message: "Update information successfully",
            });

            break;
        default:
            break;
    }
});

exports.deleteCustomerController = handleErrorInAsync(async (req, res, next) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };
    const { customerNumber } = req.params;
    const { employeeNumber, officeCode, jobTitle } = res.locals.authData;
    switch (jobTitle) {
        case "Leader":
            await deleteCustomerBelongToEmployeeOffice(
                employeeNumber,
                officeCode,
                customerNumber,
                headerInfo,
            );
            res.status(200).send({ success: true, message: "Delete successfully" });

            break;
        case "President":
        case "Manager":
            await deleteCustomer(customerNumber, headerInfo);
            res.status(200).send({ success: true, message: "Delete successfully" });

            break;
        default:
            break;
    }
});
