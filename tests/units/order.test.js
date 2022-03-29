const { expect } = require("chai");
const ordersService = require("../../services/order.service");
const sinon = require("sinon");
const orderCommon = require("../../commons/order.common");
const customerCommon = require("../../commons/customer.common");
const employeeCommon = require("../../commons/employee.common");
const orderDetailsCommon = require("../../commons/orderdetails.common");
const paymentCommon = require("../../commons/payment.common");
const productCommon = require("../../commons/product.common");

describe("Test order service", () => {
    const paramsFilter = {};
    const orderNumber = 99999;

    const ordersOutput = [
        {
            orderNumber: 10587,
            orderDate: "2021-12-08",
            requiredDate: "2021-12-15",
            shippedDate: "2021-12-12",
            status: "On Hold",
            comments: "Sai",
            customerNumber: 112,
            deleted: 1,
            updated_at: "2021-12-08",
        },
    ];

    const ordersOutputGetById = {
        orderNumber: 10117,
        orderDate: "2021-12-08",
        requiredDate: "2021-12-15",
        shippedDate: "2021-12-12",
        status: "On Hold",
        comments: "Sai",
        customerNumber: 112,
        deleted: 1,
        updated_at: "2021-12-08",
        orderdetails: [],
    };

    const ordersOutputByGraph = [
        {
            orderNumber: 10587,
            orderDate: "2021-12-08",
            requiredDate: "2021-12-15",
            shippedDate: "2021-12-12",
            status: "In Process",
            comments: "Sai",
            customerNumber: 112,
            deleted: 1,
            updated_at: "2021-12-08",
            orderdetails: [],
        },
    ];

    const inputUpdateStatus = {
        orderNumber: 10587,
        comments: "Sai",
        status: "Shipped",
    };

    const listOrderOutput = [
        {
            orderNumber: 10100,
            orderDate: "2003-01-05",
            requiredDate: "2003-01-12",
            shippedDate: "2003-01-09",
            status: "Shipped",
            comments: null,
            customerNumber: 363,
        },
        {
            orderNumber: 10117,
            orderDate: "2003-01-05",
            requiredDate: "2003-01-12",
            shippedDate: "2003-01-09",
            status: "Shipped",
            comments: null,
            customerNumber: 363,
        },
    ];

    describe("Test method get", () => {
        afterEach(() => {
            sinon.restore();
        });
        it("Test function getAllOrder suscess", async () => {
            const mockGetOrder = sinon.fake.returns(ordersOutput);
            sinon.replace(orderCommon, "getOrder", mockGetOrder);
            const result = await ordersService.getAllOrders(paramsFilter);
            expect(result).to.be.an("array");
            expect(result).to.have.lengthOf.at.least(1);
        });

        it("Test function getAllOrdersByCustomer suscess", async () => {
            const mockGetOrderOfCustomer = sinon.fake.returns(ordersOutput);
            sinon.replace(orderCommon, "getOrderOfCustomer", mockGetOrderOfCustomer);
            const result = await ordersService.getAllOrdersByCustomer();
            expect(result.orders).to.be.an("array");
            expect(result.orders).to.have.lengthOf.at.least(1);
        });

        it("Test function getAllOrdersByCustomer throw error with message: 'Orders is empty!'", async () => {
            try {
                const mockGetOrderOfCustomer = sinon.fake.returns([]);
                sinon.replace(orderCommon, "getOrderOfCustomer", mockGetOrderOfCustomer);
                const result = await ordersService.getAllOrdersByCustomer();
            } catch (error) {
                expect(error.message).to.equal("Orders is empty!");
            }
        });

        it("Test function getAllOrdersByLeader suscess", async () => {
            const employeesOutput = [
                {
                    employeeNumber: 1621,
                    lastName: "Nishi",
                    firstName: "Mami",
                    extension: "x101",
                    email: "mnishi@classicmodelcars.com",
                    officeCode: "1",
                    reportsTo: 1076,
                    jobTitle: "Staff",
                    customers: [
                        {
                            customerNumber: 148,
                            customerName: "Dragon Souveniers, Ltd.",
                            contactLastName: "Natividad",
                            contactFirstName: "Eric",
                            phone: "+65 221 7555",
                            addressLine1: "Bronz Sok.",
                            addressLine2: "Bronz Apt. 3/6 Tesvikiye",
                            city: "Singapore",
                            state: null,
                            postalCode: "079903",
                            country: "Singapore",
                            salesRepEmployeeNumber: 1621,
                            creditLimit: 103800,
                        },
                    ],
                },
            ];

            const mockGetEmployeeInOffice = sinon.fake.returns(employeesOutput);
            sinon.replace(employeeCommon, "getEmployeeInOffice", mockGetEmployeeInOffice);

            const mockGetOrderInOffice = sinon.fake.returns(ordersOutput);
            sinon.replace(orderCommon, "getOrderInOffice", mockGetOrderInOffice);
            const result = await ordersService.getAllOrdersByLeader();
            expect(result.orders).to.be.an("array");
            expect(result.orders).to.have.lengthOf.at.least(1);
        });

        it("Test function getAllOrdersByLeader throw error with message: 'Employees in office is empty!'", async () => {
            try {
                const employeesOutput = [];

                const mockGetEmployeeInOffice = sinon.fake.returns(employeesOutput);
                sinon.replace(employeeCommon, "getEmployeeInOffice", mockGetEmployeeInOffice);

                const result = await ordersService.getAllOrdersByLeader();
            } catch (error) {
                expect(error.message).to.equal("Employees in office is empty!");
            }
        });

        it("Test function getAllOrdersByLeader throw error with message: 'Customers in office is empty!'", async () => {
            try {
                const employeesOutput = [
                    {
                        employeeNumber: 1621,
                        lastName: "Nishi",
                        firstName: "Mami",
                        extension: "x101",
                        email: "mnishi@classicmodelcars.com",
                        officeCode: "1",
                        reportsTo: 1076,
                        jobTitle: "Staff",
                        customers: [],
                    },
                ];

                const mockGetEmployeeInOffice = sinon.fake.returns(employeesOutput);
                sinon.replace(employeeCommon, "getEmployeeInOffice", mockGetEmployeeInOffice);

                const result = await ordersService.getAllOrdersByLeader();
            } catch (error) {
                expect(error.message).to.equal("Customers in office is empty!");
            }
        });

        it("Test function getAllOrdersByLeader throw error with message: 'Orders in office is empty!'", async () => {
            try {
                const employeesOutput = [
                    {
                        employeeNumber: 1621,
                        lastName: "Nishi",
                        firstName: "Mami",
                        extension: "x101",
                        email: "mnishi@classicmodelcars.com",
                        officeCode: "1",
                        reportsTo: 1076,
                        jobTitle: "Staff",
                        customers: [
                            {
                                customerNumber: 148,
                                customerName: "Dragon Souveniers, Ltd.",
                                contactLastName: "Natividad",
                                contactFirstName: "Eric",
                                phone: "+65 221 7555",
                                addressLine1: "Bronz Sok.",
                                addressLine2: "Bronz Apt. 3/6 Tesvikiye",
                                city: "Singapore",
                                state: null,
                                postalCode: "079903",
                                country: "Singapore",
                                salesRepEmployeeNumber: 1621,
                                creditLimit: 103800,
                            },
                        ],
                    },
                ];

                const mockGetEmployeeInOffice = sinon.fake.returns(employeesOutput);
                sinon.replace(employeeCommon, "getEmployeeInOffice", mockGetEmployeeInOffice);

                const mockGetOrderInOffice = sinon.fake.returns([]);
                sinon.replace(orderCommon, "getOrderInOffice", mockGetOrderInOffice);

                const result = await ordersService.getAllOrdersByLeader();
            } catch (error) {
                expect(error.message).to.equal("Orders in office is empty!");
            }
        });

        it("Test function getAllOrdersByStaff suscess", async () => {
            const customersOutput = [
                {
                    customerNumber: 177,
                    customerName: "Osaka Souveniers Co.",
                    contactLastName: "Kentary",
                    contactFirstName: "Mory",
                    phone: "+81 06 6342 5555",
                    addressLine1: "1-6-20 Dojima",
                    addressLine2: null,
                    city: "Kita-ku",
                    state: "Osaka",
                    postalCode: " 530-0003",
                    country: "Japan",
                    salesRepEmployeeNumber: 1621,
                    creditLimit: 81200,
                    orders: [
                        {
                            orderNumber: 10210,
                            orderDate: "2004-01-11",
                            requiredDate: "2004-01-21",
                            shippedDate: "2004-01-19",
                            status: "Shipped",
                            comments: null,
                            customerNumber: 177,
                        },
                    ],
                },
            ];

            const mockGetCustomerOfStaffWithGraphFetched = sinon.fake.returns(customersOutput);
            sinon.replace(
                customerCommon,
                "getCustomerOfStaffWithGraphFetched",
                mockGetCustomerOfStaffWithGraphFetched,
            );
            const result = await ordersService.getAllOrdersByStaff();
            expect(result.orders).to.be.an("array");
            expect(result.orders).to.have.lengthOf.at.least(1);
        });

        it("Test function getAllOrdersByStaff throw error with message: 'Custorders is empty!'", async () => {
            try {
                const mockGetCustomerOfStaffWithGraphFetched = sinon.fake.returns([]);
                sinon.replace(
                    customerCommon,
                    "getCustomerOfStaffWithGraphFetched",
                    mockGetCustomerOfStaffWithGraphFetched,
                );
                const result = await ordersService.getAllOrdersByStaff();
            } catch (error) {
                expect(error.message).to.equal("Customers is empty!");
            }
        });

        it("Test function getAllOrdersByStaff throw error with message: 'Orders is empty!'", async () => {
            try {
                const customersOutput = [
                    {
                        customerNumber: 177,
                        customerName: "Osaka Souveniers Co.",
                        contactLastName: "Kentary",
                        contactFirstName: "Mory",
                        phone: "+81 06 6342 5555",
                        addressLine1: "1-6-20 Dojima",
                        addressLine2: null,
                        city: "Kita-ku",
                        state: "Osaka",
                        postalCode: " 530-0003",
                        country: "Japan",
                        salesRepEmployeeNumber: 1621,
                        creditLimit: 81200,
                        orders: [],
                    },
                ];

                const mockGetCustomerOfStaffWithGraphFetched = sinon.fake.returns(customersOutput);
                sinon.replace(
                    customerCommon,
                    "getCustomerOfStaffWithGraphFetched",
                    mockGetCustomerOfStaffWithGraphFetched,
                );
                const result = await ordersService.getAllOrdersByStaff();
            } catch (error) {
                expect(error.message).to.equal("Orders is empty!");
            }
        });

        it("Test function getOrderById suscess", async () => {
            const mockGetById = sinon.fake.returns(ordersOutputGetById);
            sinon.replace(orderCommon, "getByIdWithGraph", mockGetById);
            const result = await ordersService.getOrderById();
            expect(result).to.be.an("object");
        });

        it("Test function getOrderById throw error with message: 'Order by id=99999 not found!'", async () => {
            try {
                const mockGetById = sinon.fake.returns(undefined);
                sinon.replace(orderCommon, "getByIdWithGraph", mockGetById);
                const result = await ordersService.getOrderById(orderNumber);
            } catch (error) {
                expect(error.message).to.equal("Order by id=99999 not found!");
            }
        });

        it("Test function getOrdersByIdMadeByCustomer suscess", async () => {
            const mockGetById = sinon.fake.returns(ordersOutputGetById);
            sinon.replace(orderCommon, "getByIdWithGraph", mockGetById);
            const mockGetOrderOfCustomer = sinon.fake.returns(listOrderOutput);
            sinon.replace(orderCommon, "getOrderOfCustomer", mockGetOrderOfCustomer);
            const result = await ordersService.getOrdersByIdMadeByCustomer();
            expect(result).to.be.an("object");
        });

        it("Test function getOrdersByIdMadeByCustomer throw error with message: 'Order by id=99999 not found!'", async () => {
            try {
                const mockGetById = sinon.fake.returns(undefined);
                sinon.replace(orderCommon, "getByIdWithGraph", mockGetById);
                const result = await ordersService.getOrdersByIdMadeByCustomer(orderNumber);
            } catch (error) {
                expect(error.message).to.equal("Order by id=99999 not found!");
            }
        });

        it("Test function getOrdersByIdMadeByCustomer throw error with message: 'orderNumber does not belong to Customer'", async () => {
            try {
                ordersOutputGetById.orderNumber = 10118;

                const mockGetById = sinon.fake.returns(ordersOutputGetById);
                sinon.replace(orderCommon, "getByIdWithGraph", mockGetById);
                const mockGetOrderOfCustomer = sinon.fake.returns(listOrderOutput);
                sinon.replace(orderCommon, "getOrderOfCustomer", mockGetOrderOfCustomer);
                const result = await ordersService.getOrdersByIdMadeByCustomer();
            } catch (error) {
                expect(error.message).to.equal("orderNumber does not belong to Customer");
            }
        });

        it("Test function getOrdersByIdMadeByStaff suscess", async () => {
            const ordersOutput = {
                orderNumber: 10117,
                orderDate: "2003-01-05",
                requiredDate: "2003-01-12",
                shippedDate: "2003-01-09",
                status: "Shipped",
                comments: null,
                customerNumber: 363,
            };

            const customersOutput = [
                {
                    customerNumber: 148,
                    customerName: "Osaka Souveniers Co.",
                    contactLastName: "Kentary",
                    contactFirstName: "Mory",
                    phone: "+81 06 6342 5555",
                    addressLine1: "1-6-20 Dojima",
                    addressLine2: null,
                    city: "Kita-ku",
                    state: "Osaka",
                    postalCode: " 530-0003",
                    country: "Japan",
                    salesRepEmployeeNumber: 1621,
                    creditLimit: 81200,
                    orders: [
                        {
                            orderNumber: 10117,
                            orderDate: "2003-01-05",
                            requiredDate: "2003-01-12",
                            shippedDate: "2003-01-09",
                            status: "Shipped",
                            comments: null,
                            customerNumber: 363,
                        },
                    ],
                },
            ];

            const mockGetById = sinon.fake.returns(ordersOutput);
            sinon.replace(orderCommon, "getByIdWithGraph", mockGetById);
            const mockGetCustomerOfStaffUseModifyGraph = sinon.fake.returns(customersOutput);
            sinon.replace(
                customerCommon,
                "getCustomerOfStaffUseModifyGraph",
                mockGetCustomerOfStaffUseModifyGraph,
            );
            const result = await ordersService.getOrdersByIdMadeByStaff();
            expect(result).to.be.an("object");
        });

        it("Test function getOrdersByIdMadeByStaff throw error with message: 'Order by id=99999 not found!'", async () => {
            try {
                const mockGetById = sinon.fake.returns(undefined);
                sinon.replace(orderCommon, "getByIdWithGraph", mockGetById);
                const result = await ordersService.getOrdersByIdMadeByStaff(orderNumber);
            } catch (error) {
                expect(error.message).to.equal("Order by id=99999 not found!");
            }
        });

        it("Test function getOrdersByIdMadeByStaff throw error with message: 'orderNumber does not belong to Employee'", async () => {
            try {
                const customersOutput = [
                    {
                        customerNumber: 148,
                        customerName: "Osaka Souveniers Co.",
                        contactLastName: "Kentary",
                        contactFirstName: "Mory",
                        phone: "+81 06 6342 5555",
                        addressLine1: "1-6-20 Dojima",
                        addressLine2: null,
                        city: "Kita-ku",
                        state: "Osaka",
                        postalCode: " 530-0003",
                        country: "Japan",
                        salesRepEmployeeNumber: 1621,
                        creditLimit: 81200,
                        orders: [],
                    },
                ];

                const mockGetById = sinon.fake.returns(ordersOutput);
                sinon.replace(orderCommon, "getByIdWithGraph", mockGetById);
                const mockGetCustomerOfStaffUseModifyGraph = sinon.fake.returns(customersOutput);
                sinon.replace(
                    customerCommon,
                    "getCustomerOfStaffUseModifyGraph",
                    mockGetCustomerOfStaffUseModifyGraph,
                );
                const result = await ordersService.getOrdersByIdMadeByStaff();
            } catch (error) {
                expect(error.message).to.equal("orderNumber does not belong to Employee");
            }
        });

        it("Test function getOrdersByIdMadeByLeader suscess", async () => {
            const employeesOutput = [
                {
                    employeeNumber: 1621,
                    lastName: "Nishi",
                    firstName: "Mami",
                    extension: "x101",
                    email: "mnishi@classicmodelcars.com",
                    officeCode: "1",
                    reportsTo: 1076,
                    jobTitle: "Staff",
                    customers: [
                        {
                            customerNumber: 148,
                            customerName: "Dragon Souveniers, Ltd.",
                            contactLastName: "Natividad",
                            contactFirstName: "Eric",
                            phone: "+65 221 7555",
                            addressLine1: "Bronz Sok.",
                            addressLine2: "Bronz Apt. 3/6 Tesvikiye",
                            city: "Singapore",
                            state: null,
                            postalCode: "079903",
                            country: "Singapore",
                            salesRepEmployeeNumber: 1621,
                            creditLimit: 103800,
                        },
                    ],
                },
            ];

            const mockGetById = sinon.fake.returns(ordersOutput);
            sinon.replace(orderCommon, "getByIdWithGraph", mockGetById);
            const mockGetEmployeeInOfficeUseModifyGraph = sinon.fake.returns(employeesOutput);
            sinon.replace(
                employeeCommon,
                "getEmployeeInOfficeUseModifyGraph",
                mockGetEmployeeInOfficeUseModifyGraph,
            );
            const result = await ordersService.getOrdersByIdMadeByLeader();
            expect(result).to.be.an("array");
            expect(result).to.have.lengthOf.at.least(1);
        });

        it("Test function getOrdersByIdMadeByLeader throw error with message: 'Order by id=99999 not found!'", async () => {
            try {
                const mockGetById = sinon.fake.returns(undefined);
                sinon.replace(orderCommon, "getByIdWithGraph", mockGetById);
                const result = await ordersService.getOrdersByIdMadeByLeader(orderNumber);
            } catch (error) {
                expect(error.message).to.equal("Order by id=99999 not found!");
            }
        });

        it("Test function getOrdersByIdMadeByLeader throw error with message: 'Order does not belong to Office'", async () => {
            try {
                const employeesOutput = [
                    {
                        employeeNumber: 1621,
                        lastName: "Nishi",
                        firstName: "Mami",
                        extension: "x101",
                        email: "mnishi@classicmodelcars.com",
                        officeCode: "1",
                        reportsTo: 1076,
                        jobTitle: "Staff",
                        customers: [],
                    },
                ];

                const mockGetById = sinon.fake.returns(ordersOutput);
                sinon.replace(orderCommon, "getByIdWithGraph", mockGetById);
                const mockGetEmployeeInOfficeUseModifyGraph = sinon.fake.returns(employeesOutput);
                sinon.replace(
                    employeeCommon,
                    "getEmployeeInOfficeUseModifyGraph",
                    mockGetEmployeeInOfficeUseModifyGraph,
                );
                const result = await ordersService.getOrdersByIdMadeByLeader();
            } catch (error) {
                expect(error.message).to.equal("Order does not belong to Office");
            }
        });
    });

    describe("Test method delete", () => {
        afterEach(() => {
            sinon.restore();
        });
        it("Test function deleteOrder suscess", async () => {
            const mockGetById = sinon.fake.returns(ordersOutput);
            sinon.replace(orderCommon, "getById", mockGetById);
            const mockDeletePayment = sinon.fake.returns(1);
            sinon.replace(paymentCommon, "deletePayment", mockDeletePayment);
            const mockDeleteOrderDetails = sinon.fake.returns(1);
            sinon.replace(orderDetailsCommon, "deleteOrderDetails", mockDeleteOrderDetails);
            const mockDeleteOrderById = sinon.fake.returns(1);
            sinon.replace(orderCommon, "deleteOrderById", mockDeleteOrderById);
            const result = await ordersService.deleteOrder();
            expect(result).to.equal(1);
        });

        it("Test function deleteOrder throw error with message: 'Order by id=99999 not found!'", async () => {
            try {
                const mockGetById = sinon.fake.returns(undefined);
                sinon.replace(orderCommon, "getById", mockGetById);
                const result = await ordersService.deleteOrder(orderNumber);
            } catch (error) {
                expect(error.message).to.equal("Order by id=99999 not found!");
            }
        });
    });

    describe("Order: Test method create", () => {
        const input = {
            comments: "dat hang",
            COD: false,
            products: [
                {
                    productCode: "S10_4962",
                    quantityOrdered: 1000,
                },
            ],
        };

        const input2 = {
            ...input,
            COD: true,
        };

        const productOutput = {
            productCode: "S10_4962",
            productName: "1962 LanciaA Delta 16V",
            productLine: "Classic Cars",
            productScale: "1:10",
            productVendor: "Second Gear Diecast",
            productDescription:
                "Features include: Turnable front wheels; steering function; detailed interior; detailed engine; opening hood; opening trunk; opening doors; and detailed chassis.",
            quantityInStock: 6791,
            buyPrice: 103.42,
            MSRP: 147.74,
        };

        const orderOutputOfGetOrderWithStatus = [
            {
                orderDate: "2021-12-12",
                requiredDate: "2021-12-19",
                shippedDate: "2021-12-16",
                status: "COD",
                comments: "dat hang",
                customerNumber: 112,
                deleted: 0,
                updated_at: "2021-12-12",
                orderdetails: [
                    {
                        productCode: "S10_4962",
                        quantityOrdered: 100,
                        priceEach: 103.42,
                        orderLineNumber: 1,
                        deleted: 0,
                        created_at: "2021 - 12 - 12",
                        orderNumber: 10634,
                    },
                    {
                        productCode: "S18_2238",
                        quantityOrdered: 200,
                        priceEach: 101.51,
                        orderLineNumber: 2,
                        deleted: 0,
                        created_at: "2021 - 12 - 12",
                        orderNumber: 10634,
                    },
                ],
            },
        ];

        const paymentOutput = {
            customerNumber: 112,
            checkNumber: "b3d75b5c-89c8-446b-b2bc-dd494635756a",
            paymentDate: "2021-12-11",
            amount: 3000,
            deleted: 0,
            created_at: "2021-12-09",
        };

        const customersOutput = {
            customerNumber: 148,
            customerName: "Osaka Souveniers Co.",
            contactLastName: "Kentary",
            contactFirstName: "Mory",
            phone: "+81 06 6342 5555",
            addressLine1: "1-6-20 Dojima",
            addressLine2: null,
            city: "Kita-ku",
            state: "Osaka",
            postalCode: " 530-0003",
            country: "Japan",
            salesRepEmployeeNumber: 1621,
            creditLimit: 8120,
        };

        afterEach(() => {
            sinon.restore();
        });
        it("Test function createNewOrder suscess", async () => {
            const mockGetProductById = sinon.fake.returns(productOutput);
            sinon.replace(productCommon, "getById", mockGetProductById);
            const mockInsertOrder = sinon.fake.returns(ordersOutputGetById);
            sinon.replace(orderCommon, "insertOrder", mockInsertOrder);
            const mockPaymentCommon = sinon.fake.returns(paymentOutput);
            sinon.replace(paymentCommon, "insertPayment", mockPaymentCommon);
            const result = await ordersService.createNewOrder(input);
            expect(result).to.equal(ordersOutputGetById);
        });

        it("Test function createNewOrder throw error with message: 'You can not create order COD because it exceed creditLimit'", async () => {
            try {
                const mockGetProductById = sinon.fake.returns(productOutput);
                sinon.replace(productCommon, "getById", mockGetProductById);
                const mockGetOrderWithStatus = sinon.fake.returns(orderOutputOfGetOrderWithStatus);
                sinon.replace(orderCommon, "getOrderWithStatus", mockGetOrderWithStatus);
                const mockGetCustomerById = sinon.fake.returns(customersOutput);
                sinon.replace(customerCommon, "getById", mockGetCustomerById);
                const result = await ordersService.createNewOrder(input2);
            } catch (error) {
                expect(error.message).to.equal(
                    "You can not create order COD because it exceed creditLimit",
                );
            }
        });
    });

    describe("Order: Test method update", () => {
        afterEach(() => {
            sinon.restore();
        });
        it("Test function updateStatusOnHold suscess", async () => {
            const orderOutput = [
                { orderNumber: 10164, orderDate: "2021-12-06" },
                { orderNumber: 10420, orderDate: "2005-05-28" },
            ];

            const mockGetStatusNotOnHold = sinon.fake.returns(orderOutput);
            sinon.replace(orderCommon, "getStatusNotOnHold", mockGetStatusNotOnHold);
            const mockUpdateStatusOnHod = sinon.fake.returns(1);
            sinon.replace(orderCommon, "updateStatusOnHod", mockUpdateStatusOnHod);
            const result = await ordersService.updateStatusOnHold();
            expect(result).to.equal(1);
        });
        it("Test function updateInfoOrder suscess", async () => {
            const customersOutput = [
                {
                    customerNumber: 148,
                    customerName: "Osaka Souveniers Co.",
                    contactLastName: "Kentary",
                    contactFirstName: "Mory",
                    phone: "+81 06 6342 5555",
                    addressLine1: "1-6-20 Dojima",
                    addressLine2: null,
                    city: "Kita-ku",
                    state: "Osaka",
                    postalCode: " 530-0003",
                    country: "Japan",
                    salesRepEmployeeNumber: 1621,
                    creditLimit: 81200,
                },
            ];

            const ordersOutput = {
                orderNumber: 10117,
                orderDate: "2003-01-05",
                requiredDate: "2003-01-12",
                shippedDate: "2003-01-09",
                status: "Shipped",
                comments: null,
                customerNumber: 148,
            };

            const mockGetById = sinon.fake.returns(ordersOutput);
            sinon.replace(orderCommon, "getById", mockGetById);
            const mockGetCustomerById = sinon.fake.returns(customersOutput);
            sinon.replace(customerCommon, "getById", mockGetCustomerById);
            const mockUpdateOrder = sinon.fake.returns(1);
            sinon.replace(orderCommon, "updateOrder", mockUpdateOrder);
            const result = await ordersService.updateInfoOrder();
            expect(result).to.equal(1);
        });

        it("Test function updateInfoOrder throw error with message: 'Order by id=99999 not found!'", async () => {
            try {
                const ordersInput = {
                    orderDate: "2003-01-05",
                    requiredDate: "2003-01-12",
                    shippedDate: "2003-01-09",
                    status: "Shipped",
                    comments: null,
                    customerNumber: 148,
                };

                const mockGetById = sinon.fake.returns(undefined);
                sinon.replace(orderCommon, "getById", mockGetById);
                const result = await ordersService.updateInfoOrder(ordersInput, orderNumber);
            } catch (error) {
                expect(error.message).to.equal("Order by id=99999 not found!");
            }
        });

        it("Test function updateInfoOrder throw error with message: 'Customer by id=99999 not found!'", async () => {
            try {
                const ordersOutput = {
                    orderNumber: 10117,
                    orderDate: "2003-01-05",
                    requiredDate: "2003-01-12",
                    shippedDate: "2003-01-09",
                    status: "Shipped",
                    comments: null,
                    customerNumber: 148,
                };

                const ordersInput = {
                    orderDate: "2003-01-05",
                    requiredDate: "2003-01-12",
                    shippedDate: "2003-01-09",
                    status: "Shipped",
                    comments: null,
                    customerNumber: 99999,
                };

                const mockGetById = sinon.fake.returns(ordersOutput);
                sinon.replace(orderCommon, "getById", mockGetById);
                const mockGetCustomerById = sinon.fake.returns(undefined);
                sinon.replace(customerCommon, "getById", mockGetCustomerById);
                const result = await ordersService.updateInfoOrder(ordersInput);
            } catch (error) {
                expect(error.message).to.equal("Customer by id=99999 not found!");
            }
        });

        it("Test function updateStatus suscess 1", async () => {
            ordersOutputByGraph.status = "In Process";
            inputUpdateStatus.status = "Disputed";

            const mockFindByIdWithGraph = sinon.fake.returns(ordersOutputByGraph);
            sinon.replace(orderCommon, "getByIdWithGraph", mockFindByIdWithGraph);
            const mockUpdateStatus = sinon.fake.returns(1);
            sinon.replace(orderCommon, "updateStatus", mockUpdateStatus);
            const result = await ordersService.updateStatus(inputUpdateStatus);
            expect(result).to.equal(1);
        });

        it("Test function updateStatus suscess 2", async () => {
            ordersOutputByGraph.status = "On Hold";
            inputUpdateStatus.status = "Shipped";

            const mockFindByIdWithGraph = sinon.fake.returns(ordersOutputByGraph);
            sinon.replace(orderCommon, "getByIdWithGraph", mockFindByIdWithGraph);
            const mockUpdateStatus = sinon.fake.returns(1);
            sinon.replace(orderCommon, "updateStatus", mockUpdateStatus);
            const result = await ordersService.updateStatus(inputUpdateStatus);
            expect(result).to.equal(1);
        });

        it("Test function updateStatus suscess 3", async () => {
            ordersOutputByGraph.status = "Disputed";
            inputUpdateStatus.status = "Resolved";

            const mockFindByIdWithGraph = sinon.fake.returns(ordersOutputByGraph);
            sinon.replace(orderCommon, "getByIdWithGraph", mockFindByIdWithGraph);
            const mockUpdateStatus = sinon.fake.returns(1);
            sinon.replace(orderCommon, "updateStatus", mockUpdateStatus);
            const result = await ordersService.updateStatus(inputUpdateStatus);
            expect(result).to.equal(1);
        });

        it("Test function updateStatus suscess 4", async () => {
            ordersOutputByGraph.status = "Resolved";
            inputUpdateStatus.status = "Shipped";

            const mockFindByIdWithGraph = sinon.fake.returns(ordersOutputByGraph);
            sinon.replace(orderCommon, "getByIdWithGraph", mockFindByIdWithGraph);
            const mockUpdateStatus = sinon.fake.returns(1);
            sinon.replace(orderCommon, "updateStatus", mockUpdateStatus);
            const result = await ordersService.updateStatus(inputUpdateStatus);
            expect(result).to.equal(1);
        });

        it("Test function updateStatus suscess 5", async () => {
            ordersOutputByGraph.status = "Resolved";
            inputUpdateStatus.status = "Cancelled";

            const mockFindByIdWithGraph = sinon.fake.returns(ordersOutputByGraph);
            sinon.replace(orderCommon, "getByIdWithGraph", mockFindByIdWithGraph);
            const mockUpdateStatus = sinon.fake.returns(1);
            sinon.replace(orderCommon, "updateStatus", mockUpdateStatus);
            const result = await ordersService.updateStatus(inputUpdateStatus);
            expect(result).to.equal(1);
        });

        it("Test function updateStatus throw error with message: 'You can not update status from In Process to Resolved", async () => {
            try {
                ordersOutputByGraph.status = "In Process";
                inputUpdateStatus.status = "Resolved";

                const mockFindByIdWithGraph = sinon.fake.returns(ordersOutputByGraph);
                sinon.replace(orderCommon, "getByIdWithGraph", mockFindByIdWithGraph);
                const result = await ordersService.updateStatus(inputUpdateStatus);
            } catch (error) {
                expect(error.message).to.equal(
                    "You can not update status from In Process to Resolved",
                );
            }
        });

        it("Test function updateStatus throw error with message: 'You can not update status from in On Hold to Disputed or Resolved' (1)", async () => {
            try {
                ordersOutputByGraph.status = "On Hold";
                inputUpdateStatus.status = "Disputed";

                const mockFindByIdWithGraph = sinon.fake.returns(ordersOutputByGraph);
                sinon.replace(orderCommon, "getByIdWithGraph", mockFindByIdWithGraph);
                const result = await ordersService.updateStatus(inputUpdateStatus);
            } catch (error) {
                expect(error.message).to.equal(
                    "You can not update status from in On Hold to Disputed or Resolved",
                );
            }
        });

        it("Test function updateStatus throw error with message: 'You can not update status from in On Hold to Disputed or Resolved' (2)", async () => {
            try {
                ordersOutputByGraph.status = "On Hold";
                inputUpdateStatus.status = "Resolved";

                const mockFindByIdWithGraph = sinon.fake.returns(ordersOutputByGraph);
                sinon.replace(orderCommon, "getByIdWithGraph", mockFindByIdWithGraph);
                const result = await ordersService.updateStatus(inputUpdateStatus);
            } catch (error) {
                expect(error.message).to.equal(
                    "You can not update status from in On Hold to Disputed or Resolved",
                );
            }
        });

        it("Test function updateStatus throw error with message: 'You can only update status from Disputed to Resolved'", async () => {
            try {
                ordersOutputByGraph.status = "Disputed";
                inputUpdateStatus.status = "Shipped";

                const mockFindByIdWithGraph = sinon.fake.returns(ordersOutputByGraph);
                sinon.replace(orderCommon, "getByIdWithGraph", mockFindByIdWithGraph);
                const result = await ordersService.updateStatus(inputUpdateStatus);
            } catch (error) {
                expect(error.message).to.equal(
                    "You can only update status from Disputed to Resolved",
                );
            }
        });

        it("Test function updateStatus throw error with message: 'You can only update status from Resolved to Shipped or Cancelled'", async () => {
            try {
                ordersOutputByGraph.status = "Resolved";
                inputUpdateStatus.status = "On Hold";

                const mockFindByIdWithGraph = sinon.fake.returns(ordersOutputByGraph);
                sinon.replace(orderCommon, "getByIdWithGraph", mockFindByIdWithGraph);
                const result = await ordersService.updateStatus(inputUpdateStatus);
            } catch (error) {
                expect(error.message).to.equal(
                    "You can only update status from Resolved to Shipped or Cancelled",
                );
            }
        });

        it("Test function updateStatus throw error with message: 'You can not update status of order with status Cancelled or Shipped'", async () => {
            try {
                ordersOutputByGraph.status = "Cancelled";
                inputUpdateStatus.status = "Shipped";

                const mockFindByIdWithGraph = sinon.fake.returns(ordersOutputByGraph);
                sinon.replace(orderCommon, "getByIdWithGraph", mockFindByIdWithGraph);
                const result = await ordersService.updateStatus(inputUpdateStatus);
            } catch (error) {
                expect(error.message).to.equal(
                    "You can not update status of order with status Cancelled or Shipped",
                );
            }
        });
    });
});
