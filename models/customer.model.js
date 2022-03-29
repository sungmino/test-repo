const { Model } = require("objection");
const knex = require("knex");
const knexFile = require("../config/knexfile");
const Employee = require("./employee.model");
const Order = require("./orders.model");
const Payment = require("./payment.model");

Model.knex(knex(knexFile.development));

class Customer extends Model {
    static get tableName() {
        return "customers";
    }

    static get idColumn() {
        return "customerNumber";
    }

    static get modelPaths() {
        return [__dirname];
    }

    static get relationMappings() {
        return {
            employeeLeadCustomer: {
                relation: Model.BelongsToOneRelation,
                modelClass: Employee,
                join: {
                    from: "customers.salesRepEmployeeNumber",
                    to: "employees.employeeNumber",
                },
            },

            orders: {
                relation: Model.HasManyRelation,
                modelClass: Order,
                join: {
                    from: "customers.customerNumber",
                    to: "orders.customerNumber",
                },
            },

            customers: {
                relation: Model.HasManyRelation,
                modelClass: Payment,
                join: {
                    from: "payments.customerNumber",
                    to: "customers.customerNumber",
                },
            },
        };
    }
}

module.exports = Customer;
