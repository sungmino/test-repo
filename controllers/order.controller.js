const {
    getAllOrders,
    createNewOrder,
    updateInfoOrder,
    deleteOrder,
    getOrderById,
    getOrdersByIdMadeByLeader,
    getAllOrdersByLeader,
    getAllOrdersByStaff,
    getOrdersByIdMadeByStaff,
    getAllOrdersByCustomer,
    getOrdersByIdMadeByCustomer,
    updateStatus,
    updateStatusOnHold,
} = require("../services/order.service");

const { handleErrorInAsync } = require("../middlewares/handleError/error");

exports.getAllOrdersController = handleErrorInAsync(async (req, res) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };
    let orders;
    const paramsFilter = req.query;
    const { employeeNumber, customerNumber, officeCode, jobTitle } = res.locals.authData;
    switch (jobTitle) {
        case "Leader":
            orders = await getAllOrdersByLeader(officeCode, employeeNumber, headerInfo);

            res.status(200).send(orders);

            break;
        case "Customer":
            orders = await getAllOrdersByCustomer(customerNumber, headerInfo);

            res.status(200).send(orders);

            break;
        case "Staff":
            orders = await getAllOrdersByStaff(employeeNumber, headerInfo);

            res.status(200).send(orders);
            break;
        case "President":
        case "Manager":
            orders = await getAllOrders(paramsFilter, headerInfo);

            res.status(200).send({ success: true, ...orders });
            break;
        default:
            break;
    }
});

exports.getOrdersByIdController = handleErrorInAsync(async (req, res) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };
    const { orderNumber } = req.params;
    const { employeeNumber, customerNumber, officeCode, jobTitle } = res.locals.authData;
    let order;
    switch (jobTitle) {
        case "Leader":
            order = await getOrdersByIdMadeByLeader(
                orderNumber,
                officeCode,
                employeeNumber,
                headerInfo,
            );

            res.status(200).send({
                success: true,
                message: "Information a order by orderNumber",
                data: order,
            });
            break;
        case "Staff":
            order = await getOrdersByIdMadeByStaff(orderNumber, employeeNumber, headerInfo);
            res.status(200).send({
                success: true,
                data: order,
            });
            break;
        case "Customer":
            order = await getOrdersByIdMadeByCustomer(orderNumber, customerNumber, headerInfo);
            res.status(200).send({
                success: true,
                data: order,
            });
            break;
        case "President":
        case "Manager":
            order = await getOrderById(orderNumber, headerInfo);

            res.status(200).send({
                success: true,
                data: order,
            });
            break;
        default:
            break;
    }
});

exports.createOrderController = handleErrorInAsync(async (req, res) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };
    const input = req.body || {};
    const { customerNumber } = res.locals.authData;

    let newOrder = await createNewOrder(input, customerNumber);
    res.status(201).send({
        success: true,
        message: "Create a new order successfully",
        data: newOrder,
    });
});

exports.updateOrderController = handleErrorInAsync(async (req, res) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };
    const order = req.body || {};
    const { orderNumber } = req.params;
    const { jobTitle } = res.locals.authData;

    switch (jobTitle) {
        case "Customer":
            await updateInfoOrder(order, orderNumber, headerInfo);

            res.status(200).send({
                success: true,
                message: "Update information successfully",
            });

            break;
        default:
            break;
    }
});

exports.deleteOrderController = handleErrorInAsync(async (req, res, next) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };
    const { orderNumber } = req.params;
    const { jobTitle } = res.locals.authData;
    switch (jobTitle) {
        case "Manager":
            await deleteOrder(orderNumber, headerInfo);
            res.status(200).send({ success: true, message: "Delete successfully" });

            break;
        default:
            break;
    }
});

exports.updateStatusShippedController = handleErrorInAsync(async (req, res) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };
    const input = req.body;

    const result = await updateStatus(input, headerInfo);
    res.status(200).send({ success: true, message: "Update successfully" });
});

exports.updateStatusOnHoldController = handleErrorInAsync(async (req, res) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };
    const result = await updateStatusOnHold(headerInfo);
    res.status(200).send({ success: result, message: "Update successfully" });
});
