const OrderDetails = require("../models/orderdetails.model");

const deleteOrderDetails = async (orderNumber, created_at) => {
    const orderDetails = await OrderDetails.query()
        .patch({ deleted: 1 })
        .where({ orderNumber, created_at });

    return orderDetails;
};

module.exports = {
    deleteOrderDetails,
};
