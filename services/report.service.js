const moment = require("moment");
const { loggerToDb } = require("../commons/logger.common");
const reportCommon = require("../commons/report.common");
const { AppError } = require("../middlewares/handleError/error");

const getRevenueByOfficeInRangeTime = async (
    start_date = moment("2003-01-01").format("YYYY-MM-DD"),
    end_date = moment().format("YYYY-MM-DD"),
    paramsFilter,
    headerInfo,
) => {
    try {
        const rawData = await reportCommon.getRevenueByCondition(
            {
                time: [start_date, end_date],
                field1: "officeCode",
                field2: "officeCode",
            },
            headerInfo,
        );
        if (!rawData) {
            throw new AppError("Failed, maybe the database is having problems", 500);
        }

        const revenues = rawData.map((item) => {
            return {
                officeCode: item.officeCode,
                revenue: item["sum(newtable.priceEach * newtable.quantityOrdered)"],
            };
        });

        // Filter results
        if (paramsFilter && Object.keys(paramsFilter).length > 0) {
            let filterResult;
            for (let key in paramsFilter) {
                filterResult = revenues.filter((item) => {
                    return item[`${key}`] == paramsFilter[`${key}`];
                });
            }

            return filterResult;
        }
        return revenues;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const getRevenueByProductLineInRangeTimeByOffice = async (
    start_date = moment("2003-01-01").format("YYYY-MM-DD"),
    end_date = moment().format("YYYY-MM-DD"),
    paramsFilter,
    officeCode,
    headerInfo,
) => {
    try {
        const rawData = await reportCommon.getRevenueByCondition(
            {
                time: [start_date, end_date],
                field1: "officeCode",
                field2: "productLine",
                field3: "productLine",
                where: officeCode,
            },
            headerInfo,
        );

        if (!rawData) {
            throw new AppError("Failed, maybe the database is having problems", 500);
        }

        const revenues = rawData.map((item) => {
            return {
                productLine: item.productLine,
                revenue: item["sum(newtable.priceEach * newtable.quantityOrdered)"],
            };
        });

        // Filter results
        if (paramsFilter && Object.keys(paramsFilter).length > 0) {
            let filterResult;
            for (let key in paramsFilter) {
                filterResult = revenues.filter((item) => {
                    return item[`${key}`] == paramsFilter[`${key}`];
                });
            }

            return { officeCode, total: filterResult.length, filterResult };
        }

        return { officeCode, total: revenues.length, revenues };
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const getRevenueOfCustomers = async (
    start_date = moment("2003-01-01").format("YYYY-MM-DD"),
    end_date = moment().format("YYYY-MM-DD"),
    paramsFilter,
    headerInfo,
) => {
    try {
        const rawData = await reportCommon.calcRevenueOfCustomers(
            start_date,
            end_date,
            paramsFilter,
            headerInfo,
        );

        if (!rawData) {
            throw new AppError("Failed, maybe the database is having problems", 500);
        }

        const revenue = rawData.map((item) => {
            return {
                employeeNumber: item.employeeNumber,
                numberCustomers: item["count(distinct customerNumber)"],
                revenue: item["sum(newtable.priceEach * newtable.quantityOrdered)"],
            };
        });
        return revenue;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

module.exports = {
    getRevenueByOfficeInRangeTime,
    getRevenueByProductLineInRangeTimeByOffice,
    getRevenueOfCustomers,
};
