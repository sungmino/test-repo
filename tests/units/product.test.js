const { expect } = require("chai");
const productService = require("../../services/product.service");
const Product = require("../../models/products.model");
const sinon = require("sinon");
const { assert } = require("chai");
const productCommon = require("../../commons/product.common");

describe("Test method product", () => {
    afterEach(() => {
        sinon.restore();
    });

    it("Test function getAllEmployees", async () => {
        const paramsFilter = {
            page: 1,
            size: 3,
            orderBy: "customerNumber",
            type: "asc",
            searchQuery: "customerNumber=101",
        };
        const getAllProduct = {
            page: 1,
            total: 1,
            products: [
                {
                    productCode: "S10_1678",
                    productName: "1969 Harley Davidson Ultimate Chopper",
                    productLine: "Motorcycles",
                    productScale: "1:10",
                    productVendor: "Min Lin Diecast",
                    productDescription:
                        "This replica features working kickstand, front suspension, gear-shift lever, footbrake lever, drive chain, wheels and steering. All parts are particularly delicate due to their precise scale and require special care and attention.",
                    quantityInStock: 7933,
                    buyPrice: 48.81,
                    MSRP: 95.7,
                },
            ],
        };

        const mockGetAll = sinon.fake.returns(getAllProduct);
        sinon.replace(productCommon, "getAll", mockGetAll);
        const result = await productService.getAllProducts(paramsFilter);
        expect(result).to.be.an("object");
    });

    it("Test function getProductById throw error ProductCode is invalid", async () => {
        try {
            const getByIDProduct = {
                productCode: "S10_1678",
                productName: "1969 Harley Davidson Ultimate Chopper",
                productLine: "Motorcycles",
                productScale: "1:10",
                productVendor: "Min Lin Diecast",
                productDescription:
                    "This replica features working kickstand, front suspension, gear-shift lever, footbrake lever, drive chain, wheels and steering. All parts are particularly delicate due to their precise scale and require special care and attention.",
                quantityInStock: 7933,
                buyPrice: 48.81,
                MSRP: 95.7,
            };

            const mockGetByID = sinon.fake.returns(null);
            sinon.replace(productCommon, "getById", mockGetByID);
            const result = await productService.getProductById(getByIDProduct.productCode);
            assert.fail("Failed");
        } catch (error) {
            expect(error.message).to.equal("ProductCode is invalid");
        }
    });

    it("Test function getProductById success", async () => {
        const getByIDProduct = {
            productCode: "S10_1678",
            productName: "1969 Harley Davidson Ultimate Chopper",
            productLine: "Motorcycles",
            productScale: "1:10",
            productVendor: "Min Lin Diecast",
            productDescription:
                "This replica features working kickstand, front suspension, gear-shift lever, footbrake lever, drive chain, wheels and steering. All parts are particularly delicate due to their precise scale and require special care and attention.",
            quantityInStock: 7933,
            buyPrice: 48.81,
            MSRP: 95.7,
        };

        const mockGetByID = sinon.fake.returns(getByIDProduct);
        sinon.replace(productCommon, "getById", mockGetByID);
        const result = await productService.getProductById(getByIDProduct.productCode);
        expect(result.productCode).to.equal("S10_1678");
    });

    it("Test function createNewProduct throw error ProductCode is duplicate", async () => {
        try {
            const objCreateProduct = {
                productCode: "S10_1678",
                productName: "1969 Harley Davidson Ultimate Chopper",
                productLine: "Motorcycles",
                productScale: "1:10",
                productVendor: "Min Lin Diecast",
                productDescription:
                    "This replica features working kickstand, front suspension, gear-shift lever, footbrake lever, drive chain, wheels and steering. All parts are particularly delicate due to their precise scale and require special care and attention.",
                quantityInStock: 7933,
                buyPrice: 48.81,
                MSRP: 95.7,
            };

            const mockProductCode = sinon.fake.returns(objCreateProduct);
            sinon.replace(productCommon, "getById", mockProductCode);
            const result = await productService.createNewProduct(objCreateProduct.productCode);
        } catch (error) {
            expect(error.message).to.equal("ProductCode is duplicate");
        }
    });

    it("Test function createNewProduct success", async () => {
        const objCreateProduct = {
            productCode: "S10_1678",
            productName: "1969 Harley Davidson Ultimate Chopper",
            productLine: "Motorcycles",
            productScale: "1:10",
            productVendor: "Min Lin Diecast",
            productDescription:
                "This replica features working kickstand, front suspension, gear-shift lever, footbrake lever, drive chain, wheels and steering. All parts are particularly delicate due to their precise scale and require special care and attention.",
            quantityInStock: 7933,
            buyPrice: 48.81,
            MSRP: 95.7,
        };

        const mockProductCode = sinon.fake.returns(null);
        sinon.replace(productCommon, "getById", mockProductCode);

        const func = () => {
            return {
                insert: sinon.fake.returns(objCreateProduct),
            };
        };
        sinon.replace(Product, "query", func);

        const result = await productService.createNewProduct(objCreateProduct);
        expect(result.productCode).to.equal("S10_1678");
    });

    it("Test function updateInfoProduct throw error ProductCode is invalid", async () => {
        try {
            const objUpdateProduct = {
                productCode: "S10_1678",
                productName: "1969 Harley Davidson Ultimate Chopper",
                productLine: "Motorcycles",
                productScale: "1:10",
                productVendor: "Min Lin Diecast",
                productDescription:
                    "This replica features working kickstand, front suspension, gear-shift lever, footbrake lever, drive chain, wheels and steering. All parts are particularly delicate due to their precise scale and require special care and attention.",
                quantityInStock: 7933,
                buyPrice: 48.81,
                MSRP: 95.7,
            };

            const mockProductCode = sinon.fake.returns(null);
            sinon.replace(productCommon, "getById", mockProductCode);
            const result = await productService.updateInfoProduct(objUpdateProduct.productCode);
        } catch (error) {
            expect(error.message).to.equal("ProductCode is invalid");
        }
    });

    it("Test function updateInfoProduct success", async () => {
        const objUpdateProduct = {
            productCode: "S10_1678",
            productName: "1969 Harley Davidson Ultimate Chopper1",
            productLine: "Motorcycles1",
            productScale: "1:10",
            productVendor: "Min Lin Diecast",
            productDescription:
                "This replica features working kickstand, front suspension, gear-shift lever, footbrake lever, drive chain, wheels and steering. All parts are particularly delicate due to their precise scale and require special care and attention.",
            quantityInStock: 7933,
            buyPrice: 48.81,
            MSRP: 95.7,
        };

        const mockProductCode = sinon.fake.returns(objUpdateProduct);
        sinon.replace(productCommon, "getById", mockProductCode);

        sinon.replace(productCommon, "updateProduct", sinon.fake.returns(1));
        const result = await productService.updateInfoProduct(
            objUpdateProduct,
            objUpdateProduct.productCode,
        );
        expect(result).to.equal(1);
    });

    it("Test function deleteProduct throw error ProductCode is invalid", async () => {
        try {
            const objDeleteOfGetByID = {
                productCode: "S10_1678",
                productName: "1969 Harley Davidson Ultimate Chopper",
                productLine: "Motorcycles",
                productScale: "1:10",
                productVendor: "Min Lin Diecast",
                productDescription:
                    "This replica features working kickstand, front suspension, gear-shift lever, footbrake lever, drive chain, wheels and steering. All parts are particularly delicate due to their precise scale and require special care and attention.",
                quantityInStock: 7933,
                buyPrice: 48.81,
                MSRP: 95.7,
            };
            sinon.replace(productCommon, "getById", sinon.fake.returns(null));
            const result = await productService.deleteProduct(objDeleteOfGetByID.productCode);
        } catch (error) {
            expect(error.message).to.equal("ProductCode is invalid");
        }
    });

    it("Test function deleteProduct success", async () => {
        const objDeleteOfGetByID = {
            productCode: "S10_1678",
            productName: "1969 Harley Davidson Ultimate Chopper",
            productLine: "Motorcycles",
            productScale: "1:10",
            productVendor: "Min Lin Diecast",
            productDescription:
                "This replica features working kickstand, front suspension, gear-shift lever, footbrake lever, drive chain, wheels and steering. All parts are particularly delicate due to their precise scale and require special care and attention.",
            quantityInStock: 7933,
            buyPrice: 48.81,
            MSRP: 95.7,
        };
        sinon.replace(productCommon, "getById", sinon.fake.returns(objDeleteOfGetByID));

        sinon.replace(productCommon, "deleteProduct", sinon.fake.returns(1));
        const result = await productService.deleteProduct(objDeleteOfGetByID.productCode);
        expect(result).to.equal(1);
    });
});
