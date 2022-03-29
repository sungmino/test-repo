const {
    getAllProducts,
    getAllProductsByManager,
    getProductById,
    createNewProduct,
    updateInfoProduct,
    deleteProduct,
} = require("../services/product.service");

const {
    productResArrValidate,
    productResByIDValidate,
    productSchema,
} = require("../middlewares/validators/product.validator");

const { handleErrorInAsync } = require("../middlewares/handleError/error");

exports.getAllProductController = handleErrorInAsync(async (req, res) => {
    const paramsFilter = req.query;
    const products = await getAllProducts(paramsFilter);
    await productResArrValidate(productSchema, products.products);
    if (products) {
        res.status(200).send({
            success: true,
            ...products,
        });
    }
});

exports.getProductByIDController = handleErrorInAsync(async (req, res) => {
    const { productCode } = req.params;
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };

    const result = await getProductById(productCode, headerInfo);
    await productResByIDValidate(productSchema, result);

    res.status(200).send({
        success: true,
        message: "Info of product",
        data: result,
    });
});

exports.createProductController = handleErrorInAsync(async (req, res) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };
    const product = req.body || {};

    const result = await createNewProduct(product, headerInfo);
    res.status(201).send({
        success: true,
        message: "Create successfully",
        data: result,
    });
});

exports.updateProductController = handleErrorInAsync(async (req, res) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };
    const productInfo = req.body;
    const { productCode } = req.params;

    await updateInfoProduct(productInfo, productCode, headerInfo);
    res.status(200).send({
        success: true,
        message: "Update successfully",
    });
});

exports.deleteProductController = handleErrorInAsync(async (req, res) => {
    const headerInfo = {
        userInfo: res.locals.authData,
        action: req.originalUrl,
        method: req.method,
    };
    const { productCode } = req.params;
    await deleteProduct(productCode, headerInfo);

    res.status(200).send({
        success: true,
        message: "Delete successfully",
    });
});
