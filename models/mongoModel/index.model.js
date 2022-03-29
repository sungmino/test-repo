const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const mongoDb = {};
mongoDb.logger = require("./logger.model");
mongoDb.loggerCustomerToDb = require("./logger.customer.model");

mongoDb.mongoose = mongoose;

module.exports = mongoDb;
