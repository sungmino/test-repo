const { expect } = require("chai");
const { AppError } = require("../../middlewares/handleError/error");
const employeeService = require("../../services/employees.service");
const { Model } = require("objection");
const Employee = require("../../models/employee.model");
const sinon = require("sinon");
const { assert } = require("chai");
const employeeCommon = require("../../commons/employee.common");
const officeCommon = require("../../commons/office.common");

describe("Test method employee", () => {
    afterEach(() => {
        sinon.restore();
    });
    it("Test function getAllEmployees", async () => {
        const employeeFilters = {
            page: 1,
            total: 1,
            employees: [
                {
                    employeeNumber: 1002,
                    lastName: "Murphy",
                    firstName: "Diane",
                    extension: "x5800",
                    email: "dmurphy@classicmodelcars.com",
                    officeCode: "1",
                    reportsTo: 1,
                    jobTitle: "President",
                },
            ],
        };

        const paramsFilter = {
            page: 1,
            size: 3,
            orderBy: "employeeNumber",
            type: "asc",
            searchQuery: "employeeNumber=100",
        };
        const mockGetAll = sinon.fake.returns(employeeFilters);
        sinon.replace(employeeCommon, "getAll", mockGetAll);
        const result = await employeeService.getAllEmployees(paramsFilter);
        expect(result).to.be.an("object");
    });

    it("Test function getByIDEmployees must throw error", async () => {
        try {
            const obj = {
                employeeNumber: 1165,
                lastName: "Jennings",
                firstName: "Leslie",
                extension: "x3291",
                email: "ljennings@classicmodelcars.com",
                officeCode: "1",
                reportsTo: 1143,
                jobTitle: "Staff",
            };

            const mockGetByID = sinon.fake.returns(null);
            sinon.replace(employeeCommon, "getById", mockGetByID);
            const result = await employeeService.getEmployeeById(obj.employeeNumber);
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal("EmployeeNumber is invalid");
        }
    });

    it("Test function getByIDEmployees success", async () => {
        const obj = {
            employeeNumber: 1165,
            lastName: "Jennings",
            firstName: "Leslie",
            extension: "x3291",
            email: "ljennings@classicmodelcars.com",
            officeCode: "1",
            reportsTo: 1143,
            jobTitle: "Staff",
        };

        const mockGetByID = sinon.fake.returns(obj);
        sinon.replace(employeeCommon, "getById", mockGetByID);
        const result = await employeeService.getEmployeeById(obj.employeeNumber);
        expect(result.reportsTo).to.equal(1143);
    });

    it("Test function createEmployee throw error isValidReportsTo", async () => {
        try {
            const obj = {
                employeeNumber: 1165,
                lastName: "Jennings",
                firstName: "Leslie",
                extension: "x3291",
                email: "ljennings@classicmodelcars.com",
                officeCode: "1",
                reportsTo: 1143,
                jobTitle: "Staff",
            };

            const mockReportTo = sinon.fake.returns(null);
            sinon.replace(employeeCommon, "getById", mockReportTo);
            const result = await employeeService.createNewEmployee(obj.reportsTo);
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal("ReportsTo is invalid");
        }
    });

    it("Test function createEmployee throw error OfficeCode", async () => {
        try {
            const objEmployee = {
                employeeNumber: 1165,
                lastName: "Jennings",
                firstName: "Leslie",
                extension: "x3291",
                email: "ljennings@classicmodelcars.com",
                officeCode: "1",
                reportsTo: 1143,
                jobTitle: "Staff",
            };

            const objOffice = {
                officeCode: "1",
                city: "San Francisco",
                phone: "+1 650 219 4782",
                addressLine1: "100 Market Street",
                addressLine2: "Suite 300",
                state: "CA",
                country: "USA",
                postalCode: "94080",
                territory: "NA",
            };

            const mockReportTo = sinon.fake.returns(objEmployee);
            sinon.replace(employeeCommon, "getById", mockReportTo);

            const mockOfficeCode = sinon.fake.returns(null);
            sinon.replace(officeCommon, "getById", mockOfficeCode);
            const result = await employeeService.createNewEmployee(objOffice.officeCode);
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal("OfficeCode is invalid");
        }
    });

    it("Test function createEmployee throw error isDuplicateEmail", async () => {
        try {
            const objEmployee = {
                employeeNumber: 1165,
                lastName: "Jennings",
                firstName: "Leslie",
                extension: "x3291",
                email: "ljennings@classicmodelcars.com",
                officeCode: "1",
                reportsTo: 1143,
                jobTitle: "Staff",
            };

            const objOffice = {
                officeCode: "1",
                city: "San Francisco",
                phone: "+1 650 219 4782",
                addressLine1: "100 Market Street",
                addressLine2: "Suite 300",
                state: "CA",
                country: "USA",
                postalCode: "94080",
                territory: "NA",
            };

            const mockReportTo = sinon.fake.returns(objEmployee);
            sinon.replace(employeeCommon, "getById", mockReportTo);

            const mockOfficeCode = sinon.fake.returns(objOffice);
            sinon.replace(officeCommon, "getById", mockOfficeCode);

            const mockEmail = sinon.fake.returns(objEmployee);
            sinon.replace(employeeCommon, "getByEmail", mockEmail);
            const result = await employeeService.createNewEmployee(objEmployee.email);
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal("Email cannot be dupplicate");
        }
    });

    it("Test function createEmployee success", async () => {
        const objEmployee = {
            employeeNumber: 1165,
            lastName: "Jennings",
            firstName: "Leslie",
            extension: "x3291",
            email: "ljennings@classicmodelcars.com",
            officeCode: "1",
            reportsTo: 1143,
            jobTitle: "Staff",
        };

        const objOffice = {
            officeCode: "1",
            city: "San Francisco",
            phone: "+1 650 219 4782",
            addressLine1: "100 Market Street",
            addressLine2: "Suite 300",
            state: "CA",
            country: "USA",
            postalCode: "94080",
            territory: "NA",
        };

        const mockReportTo = sinon.fake.returns(objEmployee);
        sinon.replace(employeeCommon, "getById", mockReportTo);

        const mockOfficeCode = sinon.fake.returns(objOffice);
        sinon.replace(officeCommon, "getById", mockOfficeCode);

        const mockEmail = sinon.fake.returns(null);
        sinon.replace(employeeCommon, "getByEmail", mockEmail);

        const func = () => {
            return {
                insert: sinon.fake.returns(objEmployee),
            };
        };
        sinon.replace(Employee, "query", func);
        const result = await employeeService.createNewEmployee(objEmployee);
        expect(result.employeeNumber).to.equal(1165);
    });

    it("Test function updateInfoEmployee throw error EmployeeNumber is invalid", async () => {
        try {
            const objEmployee = {
                employeeNumber: 1733,
                lastName: "caaaaa",
                firstName: "bcds",
                extension: "adssaa",
                email: "ykato@classiacmqodelcars13.com",
                officeCode: "1",
                reportsTo: 1705,
                jobTitle: "Staff",
            };

            const mockEmployeeNumber = sinon.fake.returns(null);
            sinon.replace(employeeCommon, "getById", mockEmployeeNumber);
            const result = await employeeService.updateInfoEmployee(objEmployee);
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal("EmployeeNumber is invalid");
        }
    });

    it("Test function updateInfoEmployee throw error ReportsTo is invalid", async () => {
        try {
            const objEmployee = {
                employeeNumber: 1733,
                lastName: "caaaaa",
                firstName: "bcds",
                extension: "adssaa",
                email: "ykato@classiacmqodelcars13.com",
                officeCode: "1",
                reportsTo: 1705,
                jobTitle: "Staff",
            };

            const mockEmployeeNumber = sinon.fake.returns(objEmployee);
            sinon.replace(employeeCommon, "getById", mockEmployeeNumber);

            const mockReportTo = sinon.stub().returns(null);
            sinon.replace(employeeCommon, "getByReportTo", mockReportTo);
            const result = await employeeService.updateInfoEmployee(objEmployee);
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal("ReportsTo is invalid");
        }
    });

    it("Test function updateInfoEmployee throw error LastName or FirstName can not change", async () => {
        try {
            const inputBody = {
                employeeNumber: 1733,
                lastName: "caaaaa",
                firstName: "bcds",
                extension: "adssaa",
                email: "ykato@classiacmqodelcars13.com",
                officeCode: "1",
                reportsTo: 1705,
                jobTitle: "Staff",
            };

            const resultOfGetByID = {
                employeeNumber: 1733,
                lastName: "caaaaa1",
                firstName: "bcds1",
                extension: "adssaa1",
                email: "ykato@classiacmqodelcars131.com",
                officeCode: "1",
                reportsTo: 1220,
                jobTitle: "Staff",
            };
            const mockEmployeeNumber = sinon.fake.returns(resultOfGetByID);
            sinon.replace(employeeCommon, "getById", mockEmployeeNumber);

            const mockReportTo = sinon.fake.returns(inputBody);
            sinon.replace(employeeCommon, "getByReportTo", mockReportTo);

            const result = await employeeService.updateInfoEmployee(inputBody);
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal("LastName or FirstName can not change");
        }
    });

    it("Test function updateInfoEmployee throw error OfficeCode is invalid", async () => {
        try {
            const inputBody = {
                employeeNumber: 1733,
                lastName: "caaaaa",
                firstName: "bcds",
                extension: "adssaa",
                email: "ykato@classiacmqodelcars13.com",
                officeCode: "1",
                reportsTo: 1705,
                jobTitle: "Staff",
            };

            const resultOfGetByID = {
                employeeNumber: 1733,
                lastName: "caaaaa",
                firstName: "bcds",
                extension: "adssaa1",
                email: "ykato@classiacmqodelcars131.com",
                officeCode: "1",
                reportsTo: 1220,
                jobTitle: "Staff",
            };

            const objOffice = {
                officeCode: "1",
                city: "San Francisco",
                phone: "+1 650 219 4782",
                addressLine1: "100 Market Street",
                addressLine2: "Suite 300",
                state: "CA",
                country: "USA",
                postalCode: "94080",
                territory: "NA",
            };
            const mockEmployeeNumber = sinon.fake.returns(resultOfGetByID);
            sinon.replace(employeeCommon, "getById", mockEmployeeNumber);

            const mockReportTo = sinon.fake.returns(resultOfGetByID);
            sinon.replace(employeeCommon, "getByReportTo", mockReportTo);

            const mockOfficeCode = sinon.fake.returns(null);
            sinon.replace(officeCommon, "getById", mockOfficeCode);
            const result = await employeeService.updateInfoEmployee(inputBody);
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal("OfficeCode is invalid");
        }
    });

    it("Test function updateInfoEmployee throw error Email cannot be dupplicate", async () => {
        try {
            const inputBody = {
                employeeNumber: 1733,
                lastName: "caaaaa",
                firstName: "bcds",
                extension: "adssaa",
                email: "ykato@classiacmqodelcars13.com",
                officeCode: "1",
                reportsTo: 1705,
                jobTitle: "Staff",
            };

            const resultOfGetByID = {
                employeeNumber: 1733,
                lastName: "caaaaa",
                firstName: "bcds",
                extension: "adssaa1",
                email: "ykato@classiacmqodelcars13.com",
                officeCode: "1",
                reportsTo: 1220,
                jobTitle: "Staff",
            };

            const objOffice = {
                officeCode: "1",
                city: "San Francisco",
                phone: "+1 650 219 4782",
                addressLine1: "100 Market Street",
                addressLine2: "Suite 300",
                state: "CA",
                country: "USA",
                postalCode: "94080",
                territory: "NA",
            };
            const mockEmployeeNumber = sinon.fake.returns(resultOfGetByID);
            sinon.replace(employeeCommon, "getById", mockEmployeeNumber);

            const mockReportTo = sinon.fake.returns(resultOfGetByID);
            sinon.replace(employeeCommon, "getByReportTo", mockReportTo);

            const mockOfficeCode = sinon.fake.returns(objOffice);
            sinon.replace(officeCommon, "getById", mockOfficeCode);

            const mockEmail = sinon.fake.returns(resultOfGetByID);
            sinon.replace(employeeCommon, "getByEmail", mockEmail);
            const result = await employeeService.updateInfoEmployee(inputBody);
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal("Email cannot be dupplicate");
        }
    });

    it("Test function updateInfoEmployee success", async () => {
        const inputBody = {
            employeeNumber: 1733,
            lastName: "caaaaa",
            firstName: "bcds",
            extension: "adssaa",
            email: "ykato@classiacmqodelcars131.com",
            officeCode: "1",
            reportsTo: 1705,
            jobTitle: "Staff",
        };

        const resultOfGetByID = {
            employeeNumber: 1733,
            lastName: "caaaaa",
            firstName: "bcds",
            extension: "adssaa1",
            email: "ykato@classiacmqodelcars13.com",
            officeCode: "1",
            reportsTo: 1220,
            jobTitle: "Staff",
        };

        const objOffice = {
            officeCode: "1",
            city: "San Francisco",
            phone: "+1 650 219 4782",
            addressLine1: "100 Market Street",
            addressLine2: "Suite 300",
            state: "CA",
            country: "USA",
            postalCode: "94080",
            territory: "NA",
        };

        const mockEmployeeNumber = sinon.fake.returns(resultOfGetByID);
        sinon.replace(employeeCommon, "getById", mockEmployeeNumber);

        const mockReportTo = sinon.fake.returns(resultOfGetByID);
        sinon.replace(employeeCommon, "getByReportTo", mockReportTo);

        const mockOfficeCode = sinon.fake.returns(objOffice);
        sinon.replace(officeCommon, "getById", mockOfficeCode);

        const mockEmail = sinon.fake.returns(null);
        sinon.replace(employeeCommon, "getByEmail", mockEmail);

        const mockUpdateEmployee = sinon.fake.returns(1);
        sinon.replace(employeeCommon, "updateEmployee", mockUpdateEmployee);
        const result = await employeeService.updateInfoEmployee(
            inputBody,
            inputBody.employeeNumber,
        );
        expect(result).to.equal(1);
    });

    it("Test function deleteEmployee throw error EmployeeNumber is invalid or Cannot delete this employee", async () => {
        try {
            const employee = {
                employeeNumber: 1733,
                lastName: "caaaaa",
                firstName: "bcds",
                extension: "adssaa",
                email: "ykato@classiacmqodelcars131.com",
                officeCode: "1",
                reportsTo: 1705,
                jobTitle: "Staff",
            };
            const mockEmployeeNumber = sinon.fake.returns(null);
            sinon.replace(employeeCommon, "getById", mockEmployeeNumber);
            const result = await employeeService.deleteEmployee(employee.employeeNumber);
        } catch (error) {
            expect(error.message).to.equal(
                "EmployeeNumber is invalid or Cannot delete this employee",
            );
        }
    });

    it("Test function deleteEmployee throw error You cannot delete this employee!", async () => {
        try {
            const employee = {
                employeeNumber: 1733,
                lastName: "caaaaa",
                firstName: "bcds",
                extension: "adssaa",
                email: "ykato@classiacmqodelcars131.com",
                officeCode: "1",
                reportsTo: 1705,
                jobTitle: "Staff",
            };

            const employeeDefault = {
                employeeNumber: 1733,
                lastName: "99999",
                firstName: "bcds",
                extension: "adssaa",
                email: "ykato@classiacmqodelcars131.com",
                officeCode: "1",
                reportsTo: 1705,
                jobTitle: "Staff",
            };

            const mockEmployeeNumber = sinon.fake.returns(employee);
            sinon.replace(employeeCommon, "getById", mockEmployeeNumber);

            const mockDefaultEmployee = sinon.fake.returns(employeeDefault);
            sinon.replace(employeeCommon, "getByIdAndLastNameDefault", mockDefaultEmployee);
            const result = await employeeService.deleteEmployee(employee.employeeNumber);
        } catch (error) {
            expect(error.message).to.equal("You cannot delete this employee!");
        }
    });

    it("Test function deleteEmployee success", async () => {
        const employee = {
            employeeNumber: 1733,
            lastName: "caaaaa",
            firstName: "bcds",
            extension: "adssaa",
            email: "ykato@classiacmqodelcars131.com",
            officeCode: "1",
            reportsTo: 1705,
            jobTitle: "Staff",
        };

        const mockEmployeeNumber = sinon.fake.returns(employee);
        sinon.replace(employeeCommon, "getById", mockEmployeeNumber);

        const mockDefaultEmployee = sinon.fake.returns(null);
        sinon.replace(employeeCommon, "getByIdAndLastNameDefault", mockDefaultEmployee);

        const mockDeleteEmployee = sinon.fake.returns(1);
        sinon.replace(employeeCommon, "deleteEmployee", mockDeleteEmployee);
        const result = await employeeService.deleteEmployee(employee.employeeNumber);

        expect(result).to.equal(1);
    });

    it("Test function createEmployeeAdvance throw error isValidReportsTo", async () => {
        try {
            const obj = {
                lastName: "caaa",
                firstName: "baaa",
                extension: "adss",
                email: "ykato@classiacmqodelcars31.com",
                officeCode: "1",
                reportsTo: 1102,
                jobTitle: "Staff",
                customers: [
                    {
                        customerName: "adaaaa",
                        contactLastName: "sdasdb",
                        contactFirstName: "csdasds",
                        phone: "035976565",
                        addressLine1: "edasdsasdfdsfdf",
                        addressLine2: "fdsddsafdsfdf",
                        city: "gdsds",
                        state: "hdsasd",
                        postalCode: "jdasd",
                        country: "kdsds",
                        creditLimit: 2,
                        customerNumber: 533,
                    },
                    {
                        customerName: "adaaaa",
                        contactLastName: "sdasdb",
                        contactFirstName: "csdasds",
                        phone: "035976565",
                        addressLine1: "edasdsasdfdsfdf",
                        addressLine2: "fdsddsafdsfdf",
                        city: "gdsds",
                        state: "hdsasd",
                        postalCode: "jdasd",
                        country: "kdsds",
                        creditLimit: 2,
                        customerNumber: 534,
                    },
                ],
                id: 1754,
            };

            const mockReportTo = sinon.fake.returns(null);
            sinon.replace(employeeCommon, "getById", mockReportTo);
            const result = await employeeService.createEmployeeAdvance(obj.reportsTo);
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal("ReportsTo is invalid");
        }
    });

    it("Test function createEmployeeAdvance throw error OfficeCode", async () => {
        try {
            const objEmployee = {
                lastName: "caaa",
                firstName: "baaa",
                extension: "adss",
                email: "ykato@classiacmqodelcars31.com",
                officeCode: "1",
                reportsTo: 1102,
                jobTitle: "Staff",
                customers: [
                    {
                        customerName: "adaaaa",
                        contactLastName: "sdasdb",
                        contactFirstName: "csdasds",
                        phone: "035976565",
                        addressLine1: "edasdsasdfdsfdf",
                        addressLine2: "fdsddsafdsfdf",
                        city: "gdsds",
                        state: "hdsasd",
                        postalCode: "jdasd",
                        country: "kdsds",
                        creditLimit: 2,
                        customerNumber: 533,
                    },
                    {
                        customerName: "adaaaa",
                        contactLastName: "sdasdb",
                        contactFirstName: "csdasds",
                        phone: "035976565",
                        addressLine1: "edasdsasdfdsfdf",
                        addressLine2: "fdsddsafdsfdf",
                        city: "gdsds",
                        state: "hdsasd",
                        postalCode: "jdasd",
                        country: "kdsds",
                        creditLimit: 2,
                        customerNumber: 534,
                    },
                ],
                id: 1754,
            };

            const objOffice = {
                officeCode: "1",
                city: "San Francisco",
                phone: "+1 650 219 4782",
                addressLine1: "100 Market Street",
                addressLine2: "Suite 300",
                state: "CA",
                country: "USA",
                postalCode: "94080",
                territory: "NA",
            };

            const mockReportTo = sinon.fake.returns(objEmployee);
            sinon.replace(employeeCommon, "getById", mockReportTo);

            const mockOfficeCode = sinon.fake.returns(null);
            sinon.replace(officeCommon, "getById", mockOfficeCode);
            const result = await employeeService.createEmployeeAdvance(objOffice.officeCode);
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal("OfficeCode is invalid");
        }
    });

    it("Test function createEmployeeAdvance throw error isDuplicateEmail", async () => {
        try {
            const objEmployee = {
                lastName: "caaa",
                firstName: "baaa",
                extension: "adss",
                email: "ykato@classiacmqodelcars31.com",
                officeCode: "1",
                reportsTo: 1102,
                jobTitle: "Staff",
                customers: [
                    {
                        customerName: "adaaaa",
                        contactLastName: "sdasdb",
                        contactFirstName: "csdasds",
                        phone: "035976565",
                        addressLine1: "edasdsasdfdsfdf",
                        addressLine2: "fdsddsafdsfdf",
                        city: "gdsds",
                        state: "hdsasd",
                        postalCode: "jdasd",
                        country: "kdsds",
                        creditLimit: 2,
                        customerNumber: 533,
                    },
                    {
                        customerName: "adaaaa",
                        contactLastName: "sdasdb",
                        contactFirstName: "csdasds",
                        phone: "035976565",
                        addressLine1: "edasdsasdfdsfdf",
                        addressLine2: "fdsddsafdsfdf",
                        city: "gdsds",
                        state: "hdsasd",
                        postalCode: "jdasd",
                        country: "kdsds",
                        creditLimit: 2,
                        customerNumber: 534,
                    },
                ],
                id: 1754,
            };

            const objOffice = {
                officeCode: "1",
                city: "San Francisco",
                phone: "+1 650 219 4782",
                addressLine1: "100 Market Street",
                addressLine2: "Suite 300",
                state: "CA",
                country: "USA",
                postalCode: "94080",
                territory: "NA",
            };

            const mockReportTo = sinon.fake.returns(objEmployee);
            sinon.replace(employeeCommon, "getById", mockReportTo);

            const mockOfficeCode = sinon.fake.returns(objOffice);
            sinon.replace(officeCommon, "getById", mockOfficeCode);

            const mockEmail = sinon.fake.returns(objEmployee);
            sinon.replace(employeeCommon, "getByEmail", mockEmail);
            const result = await employeeService.createEmployeeAdvance(objEmployee.email);
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal("Email cannot be dupplicate");
        }
    });

    it("Test function createEmployeeAdvance success", async () => {
        const objEmployee = {
            lastName: "caaa",
            firstName: "baaa",
            extension: "adss",
            email: "ykato@classiacmqodelcars31.com",
            officeCode: "1",
            reportsTo: 1102,
            jobTitle: "Staff",
            customers: [
                {
                    customerName: "adaaaa",
                    contactLastName: "sdasdb",
                    contactFirstName: "csdasds",
                    phone: "035976565",
                    addressLine1: "edasdsasdfdsfdf",
                    addressLine2: "fdsddsafdsfdf",
                    city: "gdsds",
                    state: "hdsasd",
                    postalCode: "jdasd",
                    country: "kdsds",
                    creditLimit: 2,
                    customerNumber: 533,
                },
                {
                    customerName: "adaaaa",
                    contactLastName: "sdasdb",
                    contactFirstName: "csdasds",
                    phone: "035976565",
                    addressLine1: "edasdsasdfdsfdf",
                    addressLine2: "fdsddsafdsfdf",
                    city: "gdsds",
                    state: "hdsasd",
                    postalCode: "jdasd",
                    country: "kdsds",
                    creditLimit: 2,
                    customerNumber: 534,
                },
            ],
            id: 1754,
        };

        const objOffice = {
            officeCode: "1",
            city: "San Francisco",
            phone: "+1 650 219 4782",
            addressLine1: "100 Market Street",
            addressLine2: "Suite 300",
            state: "CA",
            country: "USA",
            postalCode: "94080",
            territory: "NA",
        };

        const mockReportTo = sinon.fake.returns(objEmployee);
        sinon.replace(employeeCommon, "getById", mockReportTo);

        const mockOfficeCode = sinon.fake.returns(objOffice);
        sinon.replace(officeCommon, "getById", mockOfficeCode);

        const mockEmail = sinon.fake.returns(null);
        sinon.replace(employeeCommon, "getByEmail", mockEmail);

        const func = () => {
            return {
                insertGraph: sinon.fake.returns(objEmployee),
            };
        };
        sinon.replace(Employee, "query", func);
        const result = await employeeService.createEmployeeAdvance(objEmployee);
        expect(result.id).to.equal(1754);
    });

    it("Test function deleteEmployeeAdvance throw error EmployeeNumber is invalid or Cannot delete this employee", async () => {
        try {
            const employee = {
                employeeNumber: 1056,
                lastName: "Patterson",
                firstName: "Mary",
                extension: "x4611",
                email: "mpatterso@classicmodelcars.com",
                officeCode: "1",
                reportsTo: 1002,
                jobTitle: "Manager",
            };
            const mockReportTo = sinon.fake.returns(null);
            sinon.replace(employeeCommon, "employeeNumberOrWhereNot99999", mockReportTo);
            const result = await employeeService.deleteEmployeeAdvance(employee.employeeNumber);
        } catch (error) {
            expect(error.message).to.equal(
                "EmployeeNumber is invalid or Cannot delete this employee",
            );
        }
    });

    it("Test function deleteEmployeeAdvance success", async () => {
        const employee = {
            employeeNumber: 1056,
            lastName: "Patterson",
            firstName: "Mary",
            extension: "x4611",
            email: "mpatterso@classicmodelcars.com",
            officeCode: "1",
            reportsTo: 1002,
            jobTitle: "Manager",
        };

        const employeeGetByOfficeCodeAndDefaultLastName = {
            employeeNumber: 1023,
            lastName: "99999",
            firstName: "Mary",
            extension: "x4611",
            email: "mpatterso@classicmodelcars1.com",
            officeCode: "1",
            reportsTo: 1002,
            jobTitle: "Manager",
        };
        const mockReportTo = sinon.fake.returns(employee);
        sinon.replace(employeeCommon, "employeeNumberOrWhereNot99999", mockReportTo);

        const mockDefaultEmployee = sinon.fake.returns(employeeGetByOfficeCodeAndDefaultLastName);
        sinon.replace(employeeCommon, "getByOfficeCodeAndDefaultLastName", mockDefaultEmployee);

        const mockUpdateCustomer = sinon.fake.returns(2);
        sinon.replace(employeeCommon, "updateMutipleCustomer", mockUpdateCustomer);

        const mockDeleteEmployee = sinon.fake.returns(1);
        sinon.replace(employeeCommon, "deleteEmployee", mockDeleteEmployee);
        const result = await employeeService.deleteEmployeeAdvance(employee.employeeNumber);
        expect(result).to.equal(1);
    });
});
