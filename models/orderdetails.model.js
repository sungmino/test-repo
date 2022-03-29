const { Model } = require("objection");
const knex = require("knex");
const knexFile = require("../config/knexfile");
const Product = require("./products.model");
const Order = require("./orders.model");

Model.knex(knex(knexFile.development));

class OrderDetail extends Model {
    static get tableName() {
        return "orderdetails";
    }

    static get idColumn() {
        return "orderNumber";
    }

    static get relationMappings() {
        return {
            products: {
                relation: Model.BelongsToOneRelation,
                modelClass: Product,
                join: {
                    from: "orderdetails.productCode",
                    to: "products.productCode",
                },
            },

            ordersToOrderDetails: {
                relation: Model.BelongsToOneRelation,
                modelClass: Order,
                join: {
                    from: "orderdetails.orderNumber",
                    to: "orders.orderNumber",
                },
            },
        };
    }
}

module.exports = OrderDetail;
