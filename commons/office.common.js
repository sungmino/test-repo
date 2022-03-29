const { AppError } = require("../middlewares/handleError/error");
const Employee = require("../models/employee.model");
const Office = require("../models/office.model");
const { raw } = require("objection");
const getById = async (officeCode) => {
    const employee = await Office.query().findOne({ officeCode: officeCode });
    return employee;
};

const getAll = async (page = 1, size = 10, orderBy = "officeCode", type = "asc", searchQuery) => {
    try {
        let offices;
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

        offices = await Office.query()
            .where(raw(string))
            .orderBy(orderBy, type)
            .page(page - 1, size);

        return {
            page: page,
            total: offices.results.length,
            offices: offices.results,
        };
    } catch (error) {
        throw error;
    }
};

const insert = async (input) => {
    const result = Office.query().insert(input);
    return result;
};

const update = async (officeInput, officeCode) => {
    const result = await Office.query().update(officeInput).where("officeCode", officeCode);
    return result;
};

const deleteOffice = async (officeCode) => {
    const result = await Office.query().delete().where({ officeCode: officeCode });
    return result;
};

module.exports = {
    getById,
    getAll,
    insert,
    update,
    deleteOffice,
};
