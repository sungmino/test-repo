const { Model } = require("objection");
const knex = require("knex");
const knexFile = require("../config/knexfile");
const Employee = require("./employee.model");
const Customer = require("./customer.model");

Model.knex(knex(knexFile.development));

class User extends Model {
    static get tableName() {
        return "users";
    }

    static get idColumn() {
        return "userName";
    }

    static get relationMappings() {
        return {
            employees: {
                relation: Model.BelongsToOneRelation,
                modelClass: Employee,
                join: {
                    from: "users.employeeNumber",
                    to: "employees.employeeNumber",
                },
            },
            customers: {
                relation: Model.BelongsToOneRelation,
                modelClass: Customer,
                join: {
                    from: "users.customerNumber",
                    to: "customers.customerNumber",
                },
            },
        };
    }
}

module.exports = User;
