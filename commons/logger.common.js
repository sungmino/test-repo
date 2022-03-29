const moment = require("moment");
const mongoDb = require("../models/mongoModel/index.model");

const LogModel = mongoDb.logger;
const LogCustomerModel = mongoDb.loggerCustomerToDb;

const loggerToDb = async (error, headerInfo) => {
    const { userInfo, action, method } = headerInfo;
    await LogModel.create({
        title: error.message,
        time: moment().format("MMMM Do YYYY, h:mm:ss a"),
        action: `[${method}]: ${process.env.SERVER_HOST}${action}`,
        status: error.status || "Failed",
        createdBy: {
            employeeNumber: userInfo.employeeNumber,
            officeCode: userInfo.officeCode,
            jobTitle: userInfo.jobTitle,
        },
        message: error.stack,
    });
};

const loggerCustomerToDb = async (error, headerInfo) => {
    const { userInfo, action, method } = headerInfo;
    await LogCustomerModel.create({
        title: error.message,
        time: moment().format("MMMM Do YYYY, h:mm:ss a"),
        action: `[${method}]: ${process.env.SERVER_HOST}${action}`,
        status: error.status || "Failed",
        createdBy: {
            customerNumber: userInfo.customerNumber,
            jobTitle: userInfo.jobTitle,
        },
        message: error.stack,
    });
};

module.exports = {
    loggerToDb,
    loggerCustomerToDb,
};
