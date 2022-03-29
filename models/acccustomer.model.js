const { Model } = require("objection");
const knex = require("knex");
const knexFile = require("../config/knexfile");
const Customer = require("./customer.model");

Model.knex(knex(knexFile.development));

class Acccustomer extends Model {
    static get tableName() {
        return "acccustomers";
    }

    static get idColumn() {
        return "userName";
    }

    static get relationMappings() {
        return {
            customers: {
                relation: Model.BelongsToOneRelation,
                modelClass: Customer,
                join: {
                    from: "acccustomers.customerNumber",
                    to: "customers.customerNumber",
                },
            },
        };
    }
}

module.exports = Acccustomer;
