const { expect } = require("chai");
const customerService = require("../../services/customers.service");
const Customer = require("../../models/customer.model");
const Employee = require("../../models/employee.model");
const sinon = require("sinon");
const { assert } = require("chai");
const customerCommon = require("../../commons/customer.common");
const employeeCommon = require("../../commons/employee.common");

describe("Test method customer", () => {
    const getAllCustomers = [
        {
            customerNumber: 103,
            customerName: "adaaa",
            contactLastName: "sdasaa",
            contactFirstName: "csdasds",
            phone: "035976565",
            addressLine1: "edasdaaaaaa",
            addressLine2: "fdsddsaaaaa",
            city: "gdsds",
            state: "hdsasd",
            postalCode: "jdasd",
            country: "kdsds",
            salesRepEmployeeNumber: 1702,
            creditLimit: 2,
        },
    ];

    const customer = {
        customerNumber: 114,
        customerName: "Australian Collectors, Co.",
        contactLastName: "sdasdb11",
        contactFirstName: "csdasds31",
        phone: "03597656",
        addressLine1: "edasdadsfsf",
        addressLine2: "fdsddsaaaa",
        city: "gdsds",
        state: "hdsasd",
        postalCode: "jdasdd",
        country: "kdsds",
        salesRepEmployeeNumber: 1702,
        creditLimit: 2,
    };

    const customerToEmployeeNumber = {
        customerNumber: 114,
        customerName: "Australian Collectors, Co.",
        contactLastName: "sdasdb11",
        contactFirstName: "csdasds31",
        phone: "03597656",
        addressLine1: "edasdadsfsf",
        addressLine2: "fdsddsaaaa",
        city: "gdsds",
        state: "hdsasd",
        postalCode: "jdasdd",
        country: "kdsds",
        salesRepEmployeeNumber: 1337,
        creditLimit: 2,
    };

    const employeeLeader = {
        employeeNumber: 1102,
        lastName: "Murphy",
        firstName: "Diane",
        extension: "x5800",
        email: "dmurphy@classicmodelcars.com",
        officeCode: "1",
        reportsTo: 1,
        jobTitle: "Leader",
    };

    const employeeStaff = {
        employeeNumber: 1702,
        lastName: "Gerard",
        firstName: "Martin",
        extension: "x2312",
        email: "mgerard@classicmodelcars.com",
        officeCode: "1",
        reportsTo: 1102,
        jobTitle: "Staff",
    };

    const arrayEmployees = [
        {
            employeeNumber: 1337,
            lastName: "Bow",
            firstName: "Anthony",
            extension: "x5428",
            email: "abow@classicmodelcars.com",
            officeCode: "1",
            reportsTo: 1102,
            jobTitle: "Staff",
        },
        {
            employeeNumber: 1401,
            lastName: "Jennings",
            firstName: "Leslie",
            extension: "x3291",
            email: "ljennings@classicmodelcars.com",
            officeCode: "1",
            reportsTo: 1102,
            jobTitle: "Staff",
        },
    ];

    const mockInsert = () => {
        return {
            insert: sinon.fake.returns(customer),
        };
    };

    const mockInsertCustomerToEmployee = () => {
        return {
            insert: sinon.fake.returns(customerToEmployeeNumber),
        };
    };
    const func = () => {
        return {
            findOne: sinon.fake.returns(null),
        };
    };

    const funcEmployeeStaff = () => {
        return {
            findOne: sinon.fake.returns(employeeStaff),
        };
    };

    afterEach(() => {
        sinon.restore();
    });

    it("Test function getAllCustomers", async () => {
        const customerFilter = {
            page: 1,
            total: 1,
            customers: [
                {
                    customerNumber: 481,
                    customerName: "Raanan Stores, Inc",
                    contactLastName: "Altagar,G M",
                    contactFirstName: "Raanan",
                    phone: "+ 972 9 959 8555",
                    addressLine1: "3 Hagalim Blv.",
                    addressLine2: null,
                    city: "Herzlia",
                    state: null,
                    postalCode: "47625",
                    country: "Israel",
                    salesRepEmployeeNumber: null,
                    creditLimit: 345,
                },
            ],
        };

        const paramsFilter = {
            page: 1,
            size: 3,
            orderBy: "customerNumber",
            type: "asc",
            searchQuery: "customerNumber=101",
        };

        sinon.replace(customerCommon, "getAll", sinon.fake.returns(customerFilter));

        const result = await customerService.getAllCustomers(paramsFilter);
        expect(result).to.be.an("object");
    });

    it("Test function getAllCustomerOfEmployeeInSameOffice throw error Unable to find data that meets the requirements", async () => {
        try {
            sinon.replace(customerCommon, "getCustomerFromEmployeeLeader", sinon.fake.returns([]));
            const result = await customerService.getAllCustomerOfEmployeeInSameOffice();
        } catch (error) {
            expect(error.message).to.equal("Unable to find data that meets the requirements !");
        }
    });

    it("Test function getAllCustomerOfEmployeeInSameOffice success", async () => {
        const getAllCustomerOfEmployeeInSameOffice = [
            {
                ...employeeStaff,
                customers: [{ ...customer }],
            },
        ];

        const getAllCustomerInEmployee = [
            {
                ...customer,
            },
        ];
        sinon.replace(
            customerCommon,
            "getCustomerFromEmployeeLeader",
            sinon.fake.returns(getAllCustomerOfEmployeeInSameOffice),
        );

        const result = await customerService.getAllCustomerOfEmployeeInSameOffice(
            getAllCustomerInEmployee,
        );

        expect(result).to.be.an("array");
    });

    it("Test function getAllCustomerOfOwnEmployee success", async () => {
        const func = () => {
            return {
                where: sinon.fake.returns(getAllCustomers),
            };
        };
        sinon.replace(Customer, "query", func);

        const result = await customerService.getAllCustomerOfOwnEmployee(
            employeeStaff.employeeNumber,
        );

        expect(result).to.be.an("array");
    });

    it("Test function getCustomerById throw Customer not found!", async () => {
        try {
            sinon.replace(customerCommon, "getById", sinon.fake.returns(null));
            const result = await customerService.getCustomerById(customer.customerNumber);
        } catch (error) {
            expect(error.message).to.equal(`Customer not found!`);
        }
    });

    it("Test function getCustomerById success", async () => {
        sinon.replace(customerCommon, "getById", sinon.fake.returns(customer));
        const result = await customerService.getCustomerById(customer.customerNumber);
        expect(result).to.be.an("object");
    });

    //get customer by id belongs to current employees in the same office code
    it("Test function getCustomerByIdReportToOfficeCode throw error Customer not found! ", async () => {
        try {
            const func = () => {
                return {
                    findOne: sinon.fake.returns(null),
                };
            };
            sinon.replace(Customer, "query", func);
            const result = await customerService.getCustomerByIdReportToOfficeCode(
                customer.customerNumber,
            );
        } catch (error) {
            expect(error.message).to.equal(`Customer not found!`);
        }
    });

    it("Test function getCustomerByIdReportToOfficeCode throw error Do not param customer in employee ", async () => {
        const employeeStaffWithCustomer = [
            {
                ...employeeStaff,
                customers: [],
            },
        ];
        try {
            const func = () => {
                return {
                    findOne: sinon.fake.returns(customer),
                };
            };
            sinon.replace(Customer, "query", func);

            sinon.replace(
                customerCommon,
                "getCustomerByIDFromEmployeeLeader",
                sinon.fake.returns(employeeStaffWithCustomer),
            );

            const result = await customerService.getCustomerByIdReportToOfficeCode(
                employeeLeader.officeCode,
                employeeLeader.reportsTo,
                customer.customerNumber,
            );
        } catch (error) {
            expect(error.message).to.equal(`Do not param customer in employee`);
        }
    });

    it("Test function getCustomerByIdReportToOfficeCode success", async () => {
        const employeeStaffWithCustomer = [
            {
                ...employeeStaff,
                customers: [{ ...customer }],
            },
        ];

        const func = () => {
            return {
                findOne: sinon.fake.returns(customer),
            };
        };
        sinon.replace(Customer, "query", func);

        sinon.replace(
            customerCommon,
            "getCustomerByIDFromEmployeeLeader",
            sinon.fake.returns(employeeStaffWithCustomer),
        );

        const result = await customerService.getCustomerByIdReportToOfficeCode(
            employeeLeader.officeCode,
            employeeLeader.reportsTo,
            customer.customerNumber,
        );
        expect(result).to.be.an("object");
    });

    //get customer by id Own Employee
    it("Test function getCustomerByIdOwnEmployee throw error Customer not found! ", async () => {
        try {
            sinon.replace(customerCommon, "getById", sinon.fake.returns(null));
            const result = await customerService.getCustomerByIdOwnEmployee(
                customer.customerNumber,
            );
        } catch (error) {
            expect(error.message).to.equal(`Customer not found!`);
        }
    });

    it("Test function getCustomerByIdOwnEmployee throw error You do not have access to this customer information", async () => {
        try {
            sinon.replace(customerCommon, "getById", sinon.fake.returns(customer));

            const func = () => {
                return {
                    findOne: sinon.fake.returns(null),
                };
            };

            sinon.replace(Customer, "query", func);
            const result = await customerService.getCustomerByIdOwnEmployee(
                customer.customerNumber,
                employeeStaff.employeeNumber,
            );
        } catch (error) {
            expect(error.message).to.equal(`You do not have access to this customer information`);
        }
    });

    it("Test function getCustomerByIdOwnEmployee success", async () => {
        sinon.replace(customerCommon, "getById", sinon.fake.returns(customer));

        const func = () => {
            return {
                findOne: sinon.fake.returns(customer),
            };
        };
        sinon.replace(Customer, "query", func);
        const result = await customerService.getCustomerByIdOwnEmployee(
            customer.customerNumber,
            employeeStaff.employeeNumber,
        );
        expect(result).to.be.an("object");
    });

    //createCustomer President, Manager
    it("Test function createNewCustomer throw error salesRepEmployeeNumber=${customer.salesRepEmployeeNumber} is invalid!", async () => {
        try {
            sinon.replace(Employee, "query", func);
            const result = await customerService.createNewCustomer(customer);
        } catch (error) {
            expect(error.message).to.equal(
                `salesRepEmployeeNumber=${customer.salesRepEmployeeNumber} is invalid!`,
            );
        }
    });

    it("Test function createNewCustomer success", async () => {
        sinon.replace(customerCommon, "getById", sinon.fake.returns(customer));
        sinon.replace(Employee, "query", funcEmployeeStaff);
        sinon.replace(Customer, "query", mockInsert);
        const result = await customerService.createNewCustomer(customer);
        expect(result).to.be.an("object");
    });

    // createCustomer Staff
    it("Test function createCustomerBelongToCurrentEmployee throw error `salesRepEmployeeNumber=${customer.salesRepEmployeeNumber} is invalid!`", async () => {
        try {
            sinon.replace(Employee, "query", func);
            const result = await customerService.createCustomerBelongToCurrentEmployee(customer);
        } catch (error) {
            expect(error.message).to.equal(
                `salesRepEmployeeNumber=${customer.salesRepEmployeeNumber} is invalid!`,
            );
        }
    });

    it("Test function createCustomerBelongToCurrentEmployee throw error `Customer only create by salesRepEmployeeNumber=${employeeNumber} ! Try again!`", async () => {
        try {
            sinon.replace(Employee, "query", funcEmployeeStaff);
            const result = await customerService.createCustomerBelongToCurrentEmployee(
                customer,
                employeeLeader.employeeNumber,
            );
        } catch (error) {
            expect(error.message).to.equal(
                `Customer only create by salesRepEmployeeNumber=${employeeLeader.employeeNumber} ! Try again!`,
            );
        }
    });

    it("Test function createCustomerBelongToCurrentEmployee success", async () => {
        sinon.replace(Employee, "query", funcEmployeeStaff);

        sinon.replace(Customer, "query", mockInsert);
        const result = await customerService.createCustomerBelongToCurrentEmployee(
            customer,
            employeeStaff.employeeNumber,
        );
        expect(result).to.be.an("object");
    });

    //createCustomer Leader
    it("Test function createCustomerBelongToEmployeeOffice throw error `salesRepEmployeeNumber=${customer.salesRepEmployeeNumber} is invalid!`", async () => {
        try {
            sinon.replace(employeeCommon, "getById", sinon.fake.returns(null));
            const result = await customerService.createCustomerBelongToEmployeeOffice(customer);
        } catch (error) {
            expect(error.message).to.equal(
                `salesRepEmployeeNumber=${customer.salesRepEmployeeNumber} is invalid!`,
            );
        }
    });

    it("Test function createCustomerBelongToEmployeeOffice throw error `Customer only create by employees who reports to ${reportsTo} and in the same office`", async () => {
        try {
            sinon.replace(employeeCommon, "getById", sinon.fake.returns(employeeStaff));

            sinon.replace(
                customerCommon,
                "getEmployeeByOfficeAndReport",
                sinon.fake.returns(arrayEmployees),
            );
            const result = await customerService.createCustomerBelongToEmployeeOffice(
                customer,
                employeeLeader.employeeNumber,
                employeeLeader.officeCode,
            );
        } catch (error) {
            expect(error.message).to.equal(
                `Customer only create by employees who reports to ${employeeLeader.employeeNumber} and in the same office`,
            );
        }
    });

    it("Test function createCustomerBelongToEmployeeOffice success`", async () => {
        sinon.replace(employeeCommon, "getById", sinon.fake.returns(employeeStaff));
        sinon.replace(
            customerCommon,
            "getEmployeeByOfficeAndReport",
            sinon.fake.returns(arrayEmployees),
        );

        sinon.replace(Customer, "query", mockInsertCustomerToEmployee);
        const result = await customerService.createCustomerBelongToEmployeeOffice(
            customerToEmployeeNumber,
            employeeLeader.employeeNumber,
            employeeLeader.officeCode,
        );
        expect(result).to.be.an("object");
    });

    //updateCustomer Manager, President
    it("Test function updateInfoCustomer throw error CustomerNumber is invalid!", async () => {
        try {
            sinon.replace(customerCommon, "getById", sinon.fake.returns(null));
            const result = await customerService.updateInfoCustomer(
                customer,
                customer.customerNumber,
            );
        } catch (error) {
            expect(error.message).to.equal("CustomerNumber is invalid!");
        }
    });

    it("Test function updateInfoCustomer throw error `salesRepEmployeeNumber=${updateCustomer.salesRepEmployeeNumber} is invalid!`", async () => {
        try {
            sinon.replace(customerCommon, "getById", sinon.fake.returns(customer));

            sinon.replace(employeeCommon, "getById", sinon.fake.returns(null));
            const result = await customerService.updateInfoCustomer(customer);
        } catch (error) {
            expect(error.message).to.equal(
                `salesRepEmployeeNumber=${customer.salesRepEmployeeNumber} is invalid!`,
            );
        }
    });

    it("Test function updateInfoCustomer success", async () => {
        sinon.replace(customerCommon, "getById", sinon.fake.returns(customer));

        sinon.replace(employeeCommon, "getById", sinon.fake.returns(employeeStaff));

        sinon.replace(customerCommon, "upCustomer", sinon.fake.returns(1));
        const result = await customerService.updateInfoCustomer(customer, customer.customerNumber);

        expect(result).to.equal(1);
    });

    //updateCustomer Leader,
    it("Test function updateCustomerBelongToEmployeeOffice throw error CustomerNumber is invalid!", async () => {
        try {
            sinon.replace(customerCommon, "getById", sinon.fake.returns(null));

            const result = await customerService.updateCustomerBelongToEmployeeOffice(customer);
        } catch (error) {
            expect(error.message).to.equal("CustomerNumber is invalid!");
        }
    });

    it("Test function updateCustomerBelongToEmployeeOffice throw error CustomerNumber is invalid!", async () => {
        try {
            sinon.replace(customerCommon, "getById", sinon.fake.returns(customer));

            sinon.replace(Employee, "query", func);
            const result = await customerService.updateCustomerBelongToEmployeeOffice(customer);
        } catch (error) {
            expect(error.message).to.equal("EmployeeNumber is invalid!");
        }
    });

    it("Test function updateCustomerBelongToEmployeeOffice throw error CustomerNumber is invalid!", async () => {
        try {
            sinon.replace(customerCommon, "getById", sinon.fake.returns(customer));

            sinon.replace(Employee, "query", funcEmployeeStaff);

            sinon.replace(
                customerCommon,
                "getEmployeeByOfficeAndReport",
                sinon.fake.returns(arrayEmployees),
            );
            const result = await customerService.updateCustomerBelongToEmployeeOffice(
                customer,
                employeeLeader.employeeNumber,
                employeeLeader.officeCode,
            );
        } catch (error) {
            expect(error.message).to.equal(
                `Customer only update by employees who reports to ${employeeLeader.employeeNumber} and in the same office`,
            );
        }
    });

    it("Test function updateCustomerBelongToEmployeeOffice success", async () => {
        sinon.replace(customerCommon, "getById", sinon.fake.returns(customer));

        sinon.replace(Employee, "query", funcEmployeeStaff);

        sinon.replace(
            customerCommon,
            "getEmployeeByOfficeAndReport",
            sinon.fake.returns(arrayEmployees),
        );

        sinon.replace(customerCommon, "upCustomer", sinon.fake.returns(1));
        const result = await customerService.updateCustomerBelongToEmployeeOffice(
            customerToEmployeeNumber,
            employeeLeader.employeeNumber,
            employeeLeader.officeCode,
            customer.customerNumber,
        );
        expect(result).to.equal(1);
    });

    //deleteCustomer Manager, President
    it("Test function deleteCustomer throw error CustomerNumber is invalid", async () => {
        try {
            sinon.replace(customerCommon, "getById", sinon.fake.returns(null));
            const result = await customerService.deleteCustomer(customer.customerNumber);
        } catch (error) {
            expect(error.message).to.equal("CustomerNumber is invalid");
        }
    });

    it("Test function deleteCustomer success", async () => {
        sinon.replace(customerCommon, "getById", sinon.fake.returns(customer));
        sinon.replace(customerCommon, "deleteCustomer", sinon.fake.returns(1));
        const result = await customerService.deleteCustomer(customer.customerNumber);
        expect(result).to.equal(1);
    });

    //deleteCustomer Leader
    it("Test function deleteCustomerBelongToEmployeeOffice throw error CustomerNumber is invalid!", async () => {
        try {
            sinon.replace(customerCommon, "getById", sinon.fake.returns(null));
            const result = await customerService.deleteCustomerBelongToEmployeeOffice(
                employeeLeader.employeeNumber,
                employeeLeader.officeCode,
                customer.customerNumber,
            );
        } catch (error) {
            expect(error.message).to.equal("CustomerNumber is invalid!");
        }
    });

    it("Test function deleteCustomerBelongToEmployeeOffice throw error EmployeeNumber is invalid!", async () => {
        try {
            sinon.replace(customerCommon, "getById", sinon.fake.returns(customer));
            sinon.replace(Employee, "query", func);
            const result = await customerService.deleteCustomerBelongToEmployeeOffice(
                employeeLeader.employeeNumber,
                employeeLeader.officeCode,
                customer.customerNumber,
            );
        } catch (error) {
            expect(error.message).to.equal("EmployeeNumber is invalid!");
        }
    });

    it("Test function deleteCustomerBelongToEmployeeOffice throw error You do not have permission to delete this customer", async () => {
        try {
            sinon.replace(customerCommon, "getById", sinon.fake.returns(customer));
            sinon.replace(Employee, "query", funcEmployeeStaff);

            sinon.replace(
                customerCommon,
                "getEmployeeByOfficeAndReport",
                sinon.fake.returns(arrayEmployees),
            );
            const result = await customerService.deleteCustomerBelongToEmployeeOffice(
                employeeLeader.employeeNumber,
                employeeLeader.officeCode,
                customer.customerNumber,
            );
        } catch (error) {
            expect(error.message).to.equal("You do not have permission to delete this customer");
        }
    });

    it("Test function deleteCustomerBelongToEmployeeOffice success", async () => {
        sinon.replace(customerCommon, "getById", sinon.fake.returns(customerToEmployeeNumber));
        sinon.replace(Employee, "query", funcEmployeeStaff);

        sinon.replace(
            customerCommon,
            "getEmployeeByOfficeAndReport",
            sinon.fake.returns(arrayEmployees),
        );

        sinon.replace(customerCommon, "deleteCustomer", sinon.fake.returns(1));
        const result = await customerService.deleteCustomerBelongToEmployeeOffice(
            employeeLeader.employeeNumber,
            employeeLeader.officeCode,
            customerToEmployeeNumber.customerNumber,
        );
        expect(result).to.equal(1);
    });
});
