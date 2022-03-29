const { raw } = require("objection");
const ProductLine = require("../models/productlines.model");
const Employee = require("../models/employee.model");
const { loggerToDb } = require("../commons/logger.common");

const getRevenueByCondition = async (condition, headerInfo) => {
    try {
        let rawData;
        if (condition.where) {
            rawData = await ProductLine.query()
                .select("newtable.officeCode", "newtable.productLine")
                .sum(raw("newtable.priceEach * newtable.quantityOrdered"))
                .from(function () {
                    this.select(
                        "ords.quantityOrdered",
                        "o.officeCode",
                        "pl.productLine",
                        "ords.priceEach",
                    )
                        .from("productlines as pl")
                        .join("products as p", "p.productLine", "pl.productLine")
                        .join("orderdetails as ords", "p.productCode", "ords.productCode")
                        .join("orders as ord", "ords.orderNumber", "ord.orderNumber")
                        .join("customers as c", "ord.customerNumber", "c.customerNumber")
                        .join("employees as e", "c.salesRepEmployeeNumber", "e.employeeNumber")
                        .join("offices as o", "e.officeCode", "o.officeCode")
                        .whereBetween("ord.orderDate", condition.time)
                        .as("newtable");
                })
                .as("newtable")
                .where(`newTable.${condition.field1}`, condition.where)
                .groupBy(`newtable.${condition.field2}`)
                .orderBy(`newtable.${condition.field3}`);
            return rawData;
        }

        // If query has no where condition
        rawData = await ProductLine.query()
            .select("newtable.officeCode")
            .sum(raw("newtable.priceEach * newtable.quantityOrdered"))
            .from(function () {
                this.select(
                    "orderdetails.quantityOrdered",
                    "offices.officeCode",
                    "productlines.productLine",
                    "orderdetails.priceEach",
                )
                    .from("productlines")
                    .join("products", "products.productLine", "productlines.productLine")
                    .join("orderdetails", "products.productCode", "orderdetails.productCode")
                    .join("orders", "orderdetails.orderNumber", "orders.orderNumber")
                    .join("customers", "orders.customerNumber", "customers.customerNumber")
                    .join(
                        "employees",
                        "customers.salesRepEmployeeNumber",
                        "employees.employeeNumber",
                    )
                    .join("offices", "employees.officeCode", "offices.officeCode")
                    .whereBetween("orders.orderDate", condition.time)
                    .as("newtable");
            })
            .as("newtable")
            .groupBy(`newtable.${condition.field1}`)
            .orderBy(`newtable.${condition.field2}`);

        return rawData;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

const calcRevenueOfCustomers = async (start_date, end_date, paramsFilter, headerInfo) => {
    try {
        let rawData;
        if (!paramsFilter) {
            rawData = await Employee.query()
                .select(raw("newtable.employeeNumber"))
                .count(raw("distinct customerNumber"))
                .sum(raw("newtable.priceEach * newtable.quantityOrdered"))
                .from(function () {
                    this.select(
                        "employees.employeeNumber",
                        "customers.customerNumber",
                        "orderdetails.quantityOrdered",
                        "orderdetails.priceEach",
                    )
                        .from("employees")
                        .join(
                            "customers",
                            "employees.employeeNumber",
                            "customers.salesRepEmployeeNumber",
                        )
                        .join("orders", " customers.customerNumber", "orders.customerNumber")
                        .join("orderdetails", "orders.orderNumber", "orderdetails.orderNumber")
                        .whereBetween("orders.orderDate", [start_date, end_date])
                        .as("newtable");
                })
                .as("newtable")
                .where(paramsFilter)
                .groupBy("newtable.employeeNumber");

            return rawData;
        }
        let array = [];
        let string = "";
        for (let key in paramsFilter) {
            array.push(`${key} like "%${paramsFilter[key]}%"`);
        }

        if (array.length == 1) {
            string += array[0];
        }

        if (array.length > 1) {
            string = array.join(" and ");
        }

        rawData = await Employee.query()
            .select(raw("newtable.employeeNumber"))
            .count(raw("distinct customerNumber"))
            .sum(raw("newtable.priceEach * newtable.quantityOrdered"))
            .from(function () {
                this.select(
                    "employees.employeeNumber",
                    "customers.customerNumber",
                    "orderdetails.quantityOrdered",
                    "orderdetails.priceEach",
                )
                    .from("employees")
                    .join(
                        "customers",
                        "employees.employeeNumber",
                        "customers.salesRepEmployeeNumber",
                    )
                    .join("orders", " customers.customerNumber", "orders.customerNumber")
                    .join("orderdetails", "orders.orderNumber", "orderdetails.orderNumber")
                    .whereBetween("orders.orderDate", [start_date, end_date])
                    .as("newtable");
            })
            .as("newtable")
            .where(raw(string))
            .groupBy("newtable.employeeNumber");

        return rawData;
    } catch (error) {
        loggerToDb(error, headerInfo);
        throw error;
    }
};

module.exports = {
    getRevenueByCondition,
    calcRevenueOfCustomers,
};
