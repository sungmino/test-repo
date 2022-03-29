const Payment = require("../models/payment.model");
const { uuid } = require("uuidv4");
const moment = require("moment");
const getPaymentByCustomerNumber = async (customerNumber, created_at) => {
    try {
        const result = await Payment.query().findOne({ customerNumber, created_at });
        return result;
    } catch (error) {
        throw error;
    }
};

const updateFieldDeleted = async (customerNumber, created_at) => {
    try {
        const result = await Payment.query()
            .patch({ deleted: 1 })
            .where({ customerNumber, created_at });
        return result;
    } catch (error) {
        throw error;
    }
};

const deletePayment = async (customerNumber, created_at) => {
    try {
        const results = await updateFieldDeleted(customerNumber, created_at);
        return results;
    } catch (error) {
        throw error;
    }
};

const insertPayment = async (newOrder) => {
    const total = newOrder.orderdetails.reduce((initValue, currentValue) => {
        return initValue + currentValue.quantityOrdered * currentValue.priceEach;
    }, 0);
    const newPayment = {
        customerNumber: newOrder.customerNumber,
        checkNumber: uuid(),
        paymentDate: moment().add(2, "days").format("YYYY-MM-DD"),
        amount: total,
        deleted: 0,
        created_at: newOrder.orderDate,
    };

    let result = await Payment.query().insert(newPayment);
    return result;
};

const GetByCustomerNumber = async (newOrder) => {
    const payment = await Payment.query().findOne({
        customerNumber: newOrder[0].customerNumber,
        created_at: newOrder[0].orderDate,
    });
    return payment;
};
module.exports = {
    getPaymentByCustomerNumber,
    updateFieldDeleted,
    deletePayment,
    insertPayment,
    GetByCustomerNumber,
};
