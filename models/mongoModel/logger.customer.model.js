const mongoose = require("mongoose");

const LoggerCustomerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    createdBy: {
        customerNumber: {
            type: Number,
            required: true,
        },
        jobTitle: {
            type: String,
            required: true,
        },
    },
    message: {
        type: String,
        required: true,
    },
});

const LoggerCustomer = mongoose.model("LoggerCustomer", LoggerCustomerSchema);
module.exports = LoggerCustomer;
