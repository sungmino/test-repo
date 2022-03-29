const { Model } = require("objection");
const knex = require("knex");
const knexFile = require("../config/knexfile");
const Customer = require("./customer.model");

Model.knex(knex(knexFile.development));

class Payment extends Model {
    static get tableName() {
        return "payments";
    }

    static get idColumn() {
        return "checkNumber";
    }

    static get relationMappings() {
        return {
            payments: {
                relation: Model.BelongsToOneRelation,
                modelClass: Customer,
                join: {
                    from: "payments.customerNumber",
                    to: "customers.customerNumber",
                },
            },
        };
    }
}

module.exports = Payment;
