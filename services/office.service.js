const { AppError } = require("../middlewares/handleError/error");
const { loggerToDb } = require("../commons/logger.common");

const officeCommon = require("../commons/office.common");
const employeeCommon = require("../commons/employee.common");

const createOfficeByPresident = async (officeInput, headerInfo) => {
    try {
        const checkOffice = await officeCommon.getById(officeInput.officeCode);
        if (checkOffice) {
            throw new AppError("Office is already created", 409);
        }

        const newOffice = await officeCommon.insert(officeInput);
        return newOffice;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const getOfficeById = async (officeCode, headerInfo) => {
    try {
        const office = await officeCommon.getById(officeCode);
        if (!office) {
            throw new AppError("Office was not found", 400);
        }

        return office;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const getOneOfficeByManager = async (headerInfo) => {
    try {
        const infoManager = await employeeCommon.getById(headerInfo.userInfo.employeeNumber);

        const result = await officeCommon.getById(infoManager.officeCode);

        if (!result) {
            throw new AppError("You do not belong to any office to view office information", 400);
        }

        return result;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const getAllOfficeByPresident = async (paramsFilter, headerInfo) => {
    try {
        let { page, size, orderBy, type, ...searchQuery } = paramsFilter;
        const offices = await officeCommon.getAll(page, size, orderBy, type, searchQuery);
        if (offices) {
            return offices;
        }
        throw new AppError("Some errors occurred while getting all office information", 400);
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const updateOfficeByPresident = async (officeInput, officeCode, headerInfo) => {
    try {
        const checkOffice = await officeCommon.getById(officeCode);
        if (!checkOffice) {
            throw new AppError("Can't find Office to update", 400);
        }

        const result = await officeCommon.update(officeInput, officeCode);
        return result;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const deleteOfficeByPresident = async (officeCode, headerInfo) => {
    try {
        const checkOffice = await officeCommon.getById(officeCode);
        if (!checkOffice) {
            throw new AppError("Can't find Office to delete", 400);
        }

        const result = await officeCommon.deleteOffice(officeCode);

        return result;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

module.exports = {
    createOfficeByPresident,
    getOfficeById,
    getOneOfficeByManager,
    getAllOfficeByPresident,
    updateOfficeByPresident,
    deleteOfficeByPresident,
};
