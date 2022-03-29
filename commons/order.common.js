const Orders = require("../models/orders.model");
const moment = require("moment");
const { raw } = require("objection");

const getOrder = async (
    page = 1,
    size = 10,
    orderBy = "orderNumber",
    type = "asc",
    searchQuery,
) => {
    try {
        let orders;
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

        orders = await Orders.query()
            .where({ deleted: 0 })
            .andWhere(raw(string))
            .orderBy(orderBy, type)
            .page(page - 1, size);

        return {
            page: page,
            total: orders.results.length,
            orders: orders.results,
        };
    } catch (error) {
        throw error;
    }
};

const getOrderWithStatus = async (customerNumber) => {
    try {
        const orders = await Orders.query()
            .where({ customerNumber })
            .whereNotIn("status", ["shipped", "cancelled"])
            .withGraphFetched("orderdetails");

        return orders;
    } catch (error) {
        throw error;
    }
};

const getOrderOfCustomer = async (customerNumber) => {
    try {
        const results = await Orders.query().where({ customerNumber, deleted: 0 });
        return results;
    } catch (error) {
        throw error;
    }
};

const getById = async (orderNumber) => {
    try {
        const orders = await Orders.query().findOne({ orderNumber, deleted: 0 });
        return orders;
    } catch (error) {
        throw error;
    }
};

const getByIdWithGraph = async (orderNumber) => {
    try {
        const order = await Orders.query()
            .findOne({ orderNumber, deleted: 0 })
            .withGraphFetched("orderdetails");

        return order;
    } catch (error) {
        throw error;
    }
};

const getOrderInOffice = async (customerNumbers) => {
    const orders = await Orders.query()
        .whereIn("customerNumber", customerNumbers)
        .andWhere({ deleted: 0 });
    return orders;
};

const deleteOrderById = async (orderNumber) => {
    const result = await Orders.query().patch({ deleted: 1 }).where({
        orderNumber: orderNumber,
    });
    return result;
};

const insertOrder = async (input, customerNumber) => {
    try {
        let newOrderDetail;
        const orderDetails = input.products.map((item, index) => {
            newOrderDetail = {
                productCode: item.productCode,
                quantityOrdered: item.quantityOrdered,
                priceEach: item.priceEach,
                orderLineNumber: index + 1,
                deleted: 0,
                created_at: moment().format("YYYY-MM-DD"),
            };
            return newOrderDetail;
        });

        const order = {
            orderDate: moment().format("YYYY-MM-DD"),
            requiredDate: moment().add(7, "days").format("YYYY-MM-DD"),
            shippedDate: moment().add(4, "days").format("YYYY-MM-DD"),
            status: "In Process",
            comments: input.comments,
            customerNumber: customerNumber,
            deleted: 0,
            updated_at: moment().format("YYYY-MM-DD"),
            orderdetails: orderDetails,
        };

        if (input.COD === true) {
            order.status = "COD";
        }

        const newOrder = await Orders.query().insertGraph(order);
        return newOrder;
    } catch (error) {
        throw error;
    }
};
const updateOrder = async (order, orderNumber) => {
    const customOrder = {
        ...order,
        updated_at: moment().format("YYYY-MM-DD"),
    };
    console.log(customOrder);
    const results = await Orders.query().patch(customOrder).where({ orderNumber });

    return results;
};

const updateStatus = async (newOrder, input) => {
    try {
        const update = {
            comments: input.comments,
            status: input.status,
        };
        const result = Orders.query().patch(update).where({
            orderNumber: newOrder.orderNumber,
        });
        return result;
    } catch (error) {
        throw error;
    }
};

const getStatusNotOnHold = async () => {
    try {
        const orders = await Orders.query()
            .select("orderNumber", "orderDate")
            .whereNotIn("status", ["Shipped", "Cancelled", "On Hold"]);
        return orders;
    } catch (error) {
        throw error;
    }
};

const updateStatusOnHod = async (orderNumberList) => {
    try {
        const result = await Orders.query()
            .patch({ status: "On Hold" })
            .whereIn("orderNumber", orderNumberList);
        return result;
    } catch (error) {
        throw error;
    }
};
module.exports = {
    getOrder,
    getById,
    getByIdWithGraph,
    getOrderInOffice,
    getOrderOfCustomer,
    deleteOrderById,
    insertOrder,
    updateOrder,
    updateStatus,
    getStatusNotOnHold,
    updateStatusOnHod,
    getOrderWithStatus,
};
