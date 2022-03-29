const Product = require("../models/products.model");
const { raw } = require("objection");
const getAll = async (page = 1, size = 10, orderBy = "productCode", type = "asc", searchQuery) => {
    try {
        let products;

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
        products = await Product.query()
            .where(raw(string))
            .orderBy(orderBy, type)
            .page(page - 1, size);
        return {
            page: page,
            total: products.results.length,
            products: products.results,
        };
    } catch (error) {
        throw error;
    }
};

const getById = async (productCode) => {
    const product = await Product.query().findOne({ productCode: productCode });
    return product;
};

const getByProductCode = async (productCode) => {
    const product = await Product.query().findOne({ productCode: productCode });
    return product;
};

const updateProduct = async (productInfo, productCode) => {
    const result = Product.query().update(productInfo).where("productCode", productCode);
};

const deleteProduct = async (productCode) => {
    const result = Product.query().delete().where({ productCode });
    return result;
};
module.exports = {
    getAll,
    getById,
    getByProductCode,
    updateProduct,
    deleteProduct,
};
