const { loggerToDb, loggerCustomerToDb } = require("../commons/logger.common");
const { AppError } = require("../middlewares/handleError/error");
const orderCommon = require("../commons/order.common");
const orderDetailsCommon = require("../commons/orderdetails.common");
const customerCommon = require("../commons/customer.common");
const employeeCommon = require("../commons/employee.common");
const moment = require("moment");
const paymentCommon = require("../commons/payment.common");
const productCommon = require("../commons/product.common");

const getAllOrders = async (paramsFilter, headerInfo) => {
    let { page, size, orderBy, type, ...searchQuery } = paramsFilter;
    const orders = await orderCommon.getOrder(page, size, orderBy, type, searchQuery);
    return orders;
};

const getAllOrdersByCustomer = async (customerNumber, headerInfo) => {
    try {
        const orders = await orderCommon.getOrderOfCustomer(customerNumber);
        if (!orders.length) {
            throw new AppError("Orders is empty!", 400);
        }

        return {
            totalOrders: orders.length,
            orders: orders,
        };
    } catch (error) {
        loggerCustomerToDb(error, headerInfo);
        throw error;
    }
};

const getAllOrdersByLeader = async (officeCode, reportsTo, headerInfo) => {
    try {
        const employees = await employeeCommon.getEmployeeInOffice(officeCode, reportsTo);
        if (!employees.length) {
            throw new AppError("Employees in office is empty!", 400);
        }

        const customers = employees.map((item) => {
            return item.customers;
        });

        if (!customers.flat().length) {
            throw new AppError("Customers in office is empty!", 400);
        }

        const customerNumbers = customers.flat().map((item) => {
            return item.customerNumber;
        });

        const orders = await orderCommon.getOrderInOffice(customerNumbers);
        if (!orders.length) {
            throw new AppError("Orders in office is empty!", 400);
        }

        return {
            officeCode: officeCode,
            totalEmployee: employees.length,
            totalOrders: orders.length,
            orders: orders,
        };
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const getAllOrdersByStaff = async (employeeNumber, headerInfo) => {
    try {
        const customers = await customerCommon.getCustomerOfStaffWithGraphFetched(employeeNumber);
        if (!customers.length) {
            throw new AppError("Customers is empty!");
        }

        const orders = customers.map((item) => {
            return item.orders;
        });
        if (!orders.flat().length) {
            throw new AppError("Orders is empty!");
        }

        return {
            employeeNumber: employeeNumber,
            totalCustomer: customers.length,
            totalOrders: orders.flat().length,
            orders: orders.flat(),
        };
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const getOrderById = async (orderNumber, headerInfo) => {
    try {
        const order = await orderCommon.getByIdWithGraph(orderNumber);
        if (!order) {
            throw new AppError(`Order by id=${orderNumber} not found!`, 400, "Not Found!");
        }
        return order;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const getOrdersByIdMadeByLeader = async (orderNumber, officeCode, reportsTo, headerInfo) => {
    try {
        const order = await orderCommon.getByIdWithGraph(orderNumber);
        if (!order) {
            throw new AppError(`Order by id=${orderNumber} not found!`, 400, "Not Found!");
        }

        const employee = await employeeCommon.getEmployeeInOfficeUseModifyGraph(
            officeCode,
            reportsTo,
            order,
        );

        const isValidOrderInOffice = employee.filter((item) => {
            return item.customers.length > 0;
        });

        if (!isValidOrderInOffice.length) {
            throw new AppError("Order does not belong to Office", 400);
        }

        return order;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const getOrdersByIdMadeByStaff = async (orderNumber, employeeNumber, headerInfo) => {
    try {
        const order = await orderCommon.getByIdWithGraph(orderNumber);
        if (!order) {
            throw new AppError(`Order by id=${orderNumber} not found!`, 400, "Not Found!");
        }

        const customers = await customerCommon.getCustomerOfStaffUseModifyGraph(
            employeeNumber,
            orderNumber,
        );

        const isValidOrderOfEmployee = customers.filter((item) => {
            return item.orders.length > 0;
        });

        if (!isValidOrderOfEmployee.length) {
            throw new AppError("orderNumber does not belong to Employee", 400);
        }

        return order;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const getOrdersByIdMadeByCustomer = async (orderNumber, customerNumber, headerInfo) => {
    try {
        const order = await orderCommon.getByIdWithGraph(orderNumber);
        if (!order) {
            throw new AppError(`Order by id=${orderNumber} not found!`, 400, "Not Found!");
        }
        const orders = await orderCommon.getOrderOfCustomer(customerNumber);
        const check = orders.filter((item) => item.orderNumber == order.orderNumber);

        if (!check.length) {
            throw new AppError("orderNumber does not belong to Customer", 400);
        }
        return order;
    } catch (error) {
        loggerCustomerToDb(error, headerInfo);
        throw error;
    }
};

// Manager
const createNewOrder = async (input, customerNumber) => {
    // get priceEach in database
    let priceEach, product;
    const products = await Promise.all(
        input.products.map(async (item) => {
            product = await productCommon.getById(item.productCode);

            priceEach = product.buyPrice;
            return {
                ...item,
                priceEach,
            };
        }),
    );

    input.products = products;

    if (input.COD === true) {
        // get sum total field in all payment of orders with not status shipped, cancelled
        const orders = await orderCommon.getOrderWithStatus(customerNumber);
        const orderDetails = orders.map((order) => order.orderdetails);

        const totalInDatabase = orderDetails.flat().reduce((initValue, currentValue) => {
            return initValue + currentValue.quantityOrdered * currentValue.priceEach;
        }, 0);

        const totalInInput = input.products.reduce((initValue, currentValue) => {
            return initValue + currentValue.quantityOrdered * currentValue.priceEach;
        }, 0);

        const total = totalInDatabase + totalInInput;
        const customer = await customerCommon.getById(customerNumber);
        if (total > customer.creditLimit) {
            throw new AppError("You can not create order COD because it exceed creditLimit", 400);
        }
    }

    const newOrder = await orderCommon.insertOrder(input, customerNumber);
    const newPayment = await paymentCommon.insertPayment(newOrder);
    return newOrder;
};

const updateStatus = async (input) => {
    try {
        let updateShipped;
        const orderInDB = await orderCommon.getByIdWithGraph(input.orderNumber);
        const statusInDB = orderInDB.status;
        const statusInput = input.status;

        const arrNotUpdate = ["Cancelled", "Shipped"];

        if (arrNotUpdate.includes(statusInDB)) {
            throw new AppError(
                "You can not update status of order with status Cancelled or Shipped",
                400,
            );
        }

        if (statusInDB === "In Process") {
            if (statusInput === "Resolved") {
                throw new AppError("You can not update status from In Process to Resolved", 400);
            }
            updateShipped = await orderCommon.updateStatus(orderInDB, input);
            return updateShipped;
        }
        if (statusInDB === "On Hold") {
            if (statusInput === "Disputed" || input.status === "Resolved") {
                throw new AppError(
                    "You can not update status from in On Hold to Disputed or Resolved",
                    400,
                );
            }
            updateShipped = await orderCommon.updateStatus(orderInDB, input);
            return updateShipped;
        }

        if (statusInDB === "Disputed") {
            if (statusInput === "Resolved") {
                updateShipped = await orderCommon.updateStatus(orderInDB, input);
                return updateShipped;
            } else {
                throw new AppError("You can only update status from Disputed to Resolved", 400);
            }
        }

        if (statusInDB === "Resolved") {
            if (statusInput === "Shipped" || input.status === "Cancelled") {
                updateShipped = await orderCommon.updateStatus(orderInDB, input);
                return updateShipped;
            }
            throw new AppError(
                "You can only update status from Resolved to Shipped or Cancelled",
                400,
            );
        }
    } catch (error) {
        throw error;
    }
};

const updateInfoOrder = async (order, orderNumber, headerInfo) => {
    try {
        const checkOrderNumber = await orderCommon.getById(orderNumber);
        if (!checkOrderNumber) {
            throw new AppError(`Order by id=${orderNumber} not found!`, 400, "Not Found!");
        }

        const checkCustomerNumber = await customerCommon.getById(checkOrderNumber.customerNumber);
        if (!checkCustomerNumber) {
            throw new AppError(
                `Customer by id=${order.customerNumber} not found!`,
                400,
                "Not Found!",
            );
        }
        const results = await orderCommon.updateOrder(order, orderNumber);
        return results;
    } catch (error) {
        loggerCustomerToDb(error, headerInfo);
        throw error;
    }
};

const deleteOrder = async (orderNumber, headerInfo) => {
    try {
        const order = await orderCommon.getById(orderNumber);
        if (!order) {
            throw new AppError(`Order by id=${orderNumber} not found!`, 400, "Not Found!");
        }

        const { customerNumber, orderDate } = order;
        const created_at = moment(orderDate).format("YYYY-MM-DD");
        const updateDeletedPayment = await paymentCommon.deletePayment(customerNumber, created_at);
        const updateDeletedOrderDetail = await orderDetailsCommon.deleteOrderDetails(
            orderNumber,
            created_at,
        );
        const result = await orderCommon.deleteOrderById(orderNumber);
        return result;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const updateStatusOnHold = async (headerInfo) => {
    const orders = await orderCommon.getStatusNotOnHold();

    let today = moment().format("YYYY-MM-DD");
    const dayOfToDay =
        new Date(today).getDate() +
        (new Date(today).getMonth() + 1) * 30 +
        new Date(today).getFullYear() * 365;

    const arrayDate = orders.filter((item) => {
        const day = new Date(item.orderDate).getDate();
        const month = new Date(item.orderDate).getMonth() + 1;
        const year = new Date(item.orderDate).getFullYear();

        return dayOfToDay - (year * 365 + month * 30 + day) > 30;
    });

    const orderNumberList = arrayDate.map((item) => {
        return item.orderNumber;
    });

    const result = await orderCommon.updateStatusOnHod(orderNumberList);
    return result;
};
module.exports = {
    getAllOrders,
    getAllOrdersByLeader,
    getAllOrdersByStaff,
    getAllOrdersByCustomer,
    getOrderById,
    getOrdersByIdMadeByLeader,
    getOrdersByIdMadeByStaff,
    getOrdersByIdMadeByCustomer,
    createNewOrder,
    updateInfoOrder,
    deleteOrder,
    updateStatus,
    updateStatusOnHold,
};
