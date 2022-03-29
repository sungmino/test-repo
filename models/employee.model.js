const { Model } = require("objection");
const knex = require("knex");
const knexFile = require("../config/knexfile");

const Office = require("./office.model");

Model.knex(knex(knexFile.development));
class Employee extends Model {
    static get tableName() {
        return "employees";
    }

    static get idColumn() {
        return "employeeNumber";
    }

    static get relationMappings() {
        const Customer = require("./customer.model");
        return {
            customers: {
                relation: Model.HasManyRelation,
                modelClass: Customer,
                join: {
                    from: "employees.employeeNumber",
                    to: "customers.salesRepEmployeeNumber",
                },
            },

            officer: {
                relation: Model.BelongsToOneRelation,
                modelClass: Office,
                join: {
                    from: "employees.officeCode",
                    to: "offices.officeCode",
                },
            },
        };
    }

    // static get jsonSchema() {
    //     return {
    //         type: "object",
    //         required: ["firstName", "lastName", "extension", "email", "officeCode", "jobTitle"],
    //         properties: {
    //             employeeNumber: { type: "integer" },
    //             firstName: { type: "string", minLength: 3, maxLength: 50 },
    //             lastName: { type: "string", minLength: 3, maxLength: 50 },
    //             extension: { type: "string", maxLength: 50 },
    //             email: { type: "string", minLength: 10, maxLength: 100 },
    //             officeCode: { type: "string" },
    //             jobTitle: { type: "string" },
    //         },
    //     };
    // }
}

module.exports = Employee;
