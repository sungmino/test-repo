const { handleErrorInAsync } = require("../middlewares/handleError/error");

const officeService = require("../services/office.service");
const officeValidator = require("../middlewares/validators/office.validator");

exports.createOffice = handleErrorInAsync(async (req, res) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };

    const officeInput = req.body || {};
    const result = await officeService.createOfficeByPresident(officeInput, headerInfo);

    res.status(201).send({
        success: true,
        message: "Create successfully",
        data: result,
    });
});

exports.getOfficeById = handleErrorInAsync(async (req, res) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };

    const { officeCode } = req.params;

    const result = await officeService.getOfficeById(officeCode, headerInfo);

    await officeValidator.validateGetByIdResponse(result);

    res.status(200).send({
        success: true,
        message: "Info of Office",
        data: result,
    });
});

exports.getOneOffice = handleErrorInAsync(async (req, res) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };

    const result = await officeService.getOneOfficeByManager(headerInfo);

    await officeValidator.validateGetByIdResponse(result);

    res.status(200).send({ success: true, message: "Information of manager office", data: result });
});

exports.getAllOffice = handleErrorInAsync(async (req, res) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };

    const paramsFilter = req.query;

    const results = await officeService.getAllOfficeByPresident(paramsFilter, headerInfo);

    await officeValidator.validateGetAllResponse(results.offices);

    res.status(200).send({
        success: true,
        ...results,
    });
});

exports.updateOffice = handleErrorInAsync(async (req, res) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };

    const { officeCode } = req.params;
    const officeInput = req.body;

    const result = await officeService.updateOfficeByPresident(officeInput, officeCode, headerInfo);

    if (!result) {
        res.status(200).send({
            success: false,
            message: "Update fail, maybe the database is having problems",
        });
    } else {
        res.status(200).send({
            success: true,
            message: "Update information successfully",
            data: result,
        });
    }
});

exports.deleteOffice = handleErrorInAsync(async (req, res) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };

    const { officeCode } = req.params;

    const result = await officeService.deleteOfficeByPresident(officeCode, headerInfo);

    res.status(200).send({ success: true, message: "Delete Office successfully", data: result });
});
