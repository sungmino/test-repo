const {
    getRevenueByOfficeInRangeTime,
    getRevenueByProductLineInRangeTimeByOffice,
    getRevenueOfCustomers,
} = require("../services/report.service");

const { handleErrorInAsync } = require("../middlewares/handleError/error");

exports.revenueByOffice = handleErrorInAsync(async (req, res) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };
    const { start_date, end_date, ...paramsFilter } = req.query;

    const revenue = await getRevenueByOfficeInRangeTime(
        start_date,
        end_date,
        paramsFilter,
        headerInfo,
    );

    res.status(200).send({
        success: true,
        message: "Sales revenue by office for a given period of time",
        total: revenue.length,
        data: revenue,
    });
});

exports.revenueByProductLine = handleErrorInAsync(async (req, res) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };
    const { start_date, end_date, ...paramsFilter } = req.query;
    const { officeCode } = req.params;
    const revenue = await getRevenueByProductLineInRangeTimeByOffice(
        start_date,
        end_date,
        paramsFilter,
        officeCode,
        headerInfo,
    );
    res.status(200).send({
        success: true,
        message: "Sales revenue by productLine for a given period of time in each office",
        data: revenue,
    });
});

exports.revenueByCustomers = handleErrorInAsync(async (req, res) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };
    const { start_date, end_date, ...paramsFilter } = req.query;
    const revenue = await getRevenueOfCustomers(start_date, end_date, paramsFilter, headerInfo);

    res.status(200).send({
        success: true,
        message: "Sales revenue by customers for a given period of time",
        total: revenue.length,
        data: revenue,
    });
});
