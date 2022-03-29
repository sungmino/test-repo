const { AppError } = require("../middlewares/handleError/error");
const Product = require("../models/products.model");
const Employee = require("../models/employee.model");
const { loggerToDb } = require("../commons/logger.common");
const productCommon = require("../commons/product.common");

const getAllProducts = async (paramsFilter) => {
    let { page, size, orderBy, type, ...searchQuery } = paramsFilter;
    const products = await productCommon.getAll(page, size, orderBy, type, searchQuery);

    return products;
};

const getProductById = async (productCode, headerInfo) => {
    try {
        const product = await productCommon.getById(productCode);
        if (!product) {
            throw new AppError("ProductCode is invalid", 400);
        }
        return product;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const createNewProduct = async (product, headerInfo) => {
    try {
        const isValidProductCode = await productCommon.getById(product.productCode);
        if (isValidProductCode) {
            throw new AppError("ProductCode is duplicate", 409);
        }

        const newProduct = await Product.query().insert(product);

        return newProduct;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const updateInfoProduct = async (productInfo, productCode, headerInfo) => {
    try {
        const product = await productCommon.getById(productCode);
        if (!product) {
            throw new AppError("ProductCode is invalid", 400);
        }

        const result = await productCommon.updateProduct(productInfo, productCode);
        return result;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const deleteProduct = async (productCode, headerInfo) => {
    try {
        const isValidProductCode = await productCommon.getById(productCode);

        if (!isValidProductCode) {
            throw new AppError("ProductCode is invalid", 400);
        }

        const result = await productCommon.deleteProduct(productCode);
        return result;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};
module.exports = {
    getAllProducts,
    getProductById,
    createNewProduct,
    updateInfoProduct,
    deleteProduct,
};
