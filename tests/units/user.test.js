const { expect } = require("chai");
const userService = require("../../services/user.service");
const User = require("../../models/user.model");
const sinon = require("sinon");
const { assert } = require("chai");
const userCommon = require("../../commons/user.common");
const employeeCommon = require("../../commons/employee.common");
const customerCommon = require("../../commons/customer.common");

describe("Test createUser function ", () => {
    const inputWithEmployee = {
        username: "test",
        password: "12345",
        employeeNumber: 1002,
    };
    const inputWithCustomer = {
        username: "test",
        password: "12345",
        customerNumber: 112,
    };
    afterEach(() => {
        sinon.restore();
    });
    it("Must be register success with employee role", async () => {
        const resultGetEmployeeById = {
            employeeNumber: 1002,
            lastName: "Murphy",
            firstName: "Diane",
            extension: "x5800",
            email: "dmurphy@classicmodelcars.com",
            officeCode: "1",
            reportsTo: 1,
            jobTitle: "President",
        };

        sinon.replace(userCommon, "getByEmployeeNumber", sinon.fake.returns(null));
        sinon.replace(employeeCommon, "getById", sinon.fake.returns(resultGetEmployeeById));
        sinon.replace(userCommon, "hashPassword", sinon.fake.returns(inputWithEmployee.password));

        const spyFn = sinon.spy();
        const func = () => {
            return {
                findOne: sinon.fake.returns(null),
                insert: spyFn,
            };
        };
        sinon.replace(User, "query", func);
        const result = await userService.createUser(inputWithEmployee);

        expect(result.message).to.equal("Successfully created user test");
    });

    it("Must be register fail and throw error User is already exists!", async () => {
        try {
            const resultGetUser = {
                username: "test",
                password: "123456",
                employeeNumber: 1002,
            };
            // const func = () => {
            //     return {
            //         findOne: sinon.fake.returns(resultGetUser),
            //     };
            // };

            // sinon.replace(User, "query", func);
            sinon.replace(userCommon, "getByEmployeeNumber", sinon.fake.returns(resultGetUser));
            const result = await userService.createUser(inputWithEmployee);
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal("User is already exists!");
        }
    });

    it("Must be register fail and throw error Employee does not exist to create an account", async () => {
        try {
            sinon.replace(userCommon, "getByEmployeeNumber", sinon.fake.returns(null));
            sinon.replace(employeeCommon, "getById", sinon.fake.returns(null));

            const result = await userService.createUser(inputWithEmployee);
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal("Employee does not exist to create an account");
        }
    });

    it("Must be register success with customer role", async () => {
        const resultGetCustomerById = {
            customerNumber: 112,
            customerName: "Signal Gift Stores",
            contactLastName: "King",
            contactFirstName: "Jean",
            phone: "7025551838",
            addressLine1: "8489 Strong St.",
            addressLine2: null,
            city: "Las Vegas",
            state: "NV",
            postalCode: "83030",
            country: "USA",
            salesRepEmployeeNumber: 1166,
            creditLimit: 71800,
        };

        sinon.replace(userCommon, "getByCustomerNumber", sinon.fake.returns(null));
        sinon.replace(customerCommon, "getById", sinon.fake.returns(resultGetCustomerById));
        sinon.replace(userCommon, "hashPassword", sinon.fake.returns(inputWithCustomer.password));

        const spyFn = sinon.spy();
        const func = () => {
            return {
                findOne: sinon.fake.returns(null),
                insert: spyFn,
            };
        };
        sinon.replace(User, "query", func);
        const result = await userService.createUser(inputWithCustomer);

        expect(result.message).to.equal("Successfully created user test");
    });

    it("Must be register fail and throw error User is already exists!", async () => {
        try {
            const resultGetCustomerById = {
                username: "test",
                password: "123456",
                customerNumber: 112,
            };
            sinon.replace(
                userCommon,
                "getByCustomerNumber",
                sinon.fake.returns(resultGetCustomerById),
            );
            const result = await userService.createUser(inputWithCustomer);
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal("User is already exists!");
        }
    });

    it("Must be register fail and throw error Customer does not exist to create an account", async () => {
        try {
            sinon.replace(userCommon, "getByCustomerNumber", sinon.fake.returns(null));
            sinon.replace(customerCommon, "getById", sinon.fake.returns(null));

            const result = await userService.createUser(inputWithCustomer);
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal("Customer does not exist to create an account");
        }
    });
});

describe("Test login function ", () => {
    const input = {
        username: "test",
        password: "123456",
    };
    afterEach(() => {
        sinon.restore();
    });

    it("Must be login success with employee role", async () => {
        const employeeAccount = {
            username: "test",
            password: "12345",
            employeeNumber: 1002,
            isEmployee: 1,
            isCustomer: 0,
            customerName: null,
        };
        sinon.replace(userCommon, "getUserByUsername", sinon.fake.returns(employeeAccount));
        sinon.replace(userCommon, "isPasswordValid", sinon.fake.returns(true));
        sinon.replace(
            userCommon,
            "generateTokenWithEmployee",
            sinon.fake.returns("eyJhbGciOiJIUzI1NiIsInR5cCI6I"),
        );
        const result = await userService.login(input);

        expect(result.token).to.equal("eyJhbGciOiJIUzI1NiIsInR5cCI6I");
    });

    it("Must be login success with customer role", async () => {
        const customerAccount = {
            username: "test",
            password: "123456",
            customerNumber: 112,
            isEmployee: 0,
            isCustomer: 1,
            employeeNumber: null,
        };
        sinon.replace(userCommon, "getUserByUsername", sinon.fake.returns(customerAccount));
        sinon.replace(userCommon, "isPasswordValid", sinon.fake.returns(true));
        sinon.replace(
            userCommon,
            "generateTokenWithCustomer",
            sinon.fake.returns("eyJhbGciOiJIUzI1NiIsInR5cCI6Idd"),
        );
        const result = await userService.login(input);

        expect(result.token).to.equal("eyJhbGciOiJIUzI1NiIsInR5cCI6Idd");
    });

    it("Must be login fail and throw error Some errors occurred while handle password", async () => {
        try {
            const customerAccount = {
                username: "test",
                password: "123456",
                customerNumber: 112,
                isEmployee: 0,
                isCustomer: 1,
                employeeNumber: null,
            };
            sinon.replace(userCommon, "getUserByUsername", sinon.fake.returns(customerAccount));
            sinon.replace(userCommon, "isPasswordValid", sinon.fake.returns(false));

            const result = await userService.login(input);
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal("Some errors occurred while handle password");
        }
    });

    it("Must be login fail and throw error Invalid username or password", async () => {
        try {
            sinon.replace(userCommon, "getUserByUsername", sinon.fake.returns(null));
            const result = await userService.login(input);
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal("Invalid username or password");
        }
    });
});
