const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Employee = require("../models/employee.model");
const Customer = require("../models/customer.model");

/*
{
    "username": "hoamx1",
    "password": "hoa12345@President"
}
{
    "username": "nosm01",
     "password": "no1234@Manager"
 }*/
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(+process.env.SALT);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
};

const generateTokenWithEmployee = async (user) => {
    const secret = process.env.TOKEN_SECRET;

    const { isEmployee, employeeNumber, officeCode, jobTitle } = user;

    const token = jwt.sign({ isEmployee, employeeNumber, officeCode, jobTitle }, secret, {
        expiresIn: 60 * 60,
    });

    return token;
};

const generateTokenWithCustomer = async (user) => {
    const secret = process.env.TOKEN_SECRET;

    const { isCustomer, customerNumber, salesRepEmployeeNumber, jobTitle } = user;

    const token = jwt.sign(
        { isCustomer, customerNumber, salesRepEmployeeNumber, jobTitle },
        secret,
        {
            expiresIn: 60 * 60,
        },
    );

    return token;
};

const isPasswordValid = async (password, hashedPassword) => {
    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    return !!isValidPassword;
};

const getUserByUsername = async (username) => {
    try {
        let user;
        let result;

        const checkUser = await User.query().where("username", username);

        if (checkUser[0] && checkUser[0].isEmployee) {
            user = await Employee.query().where("employeeNumber", checkUser[0].employeeNumber);

            result = {
                isEmployee: checkUser[0].isEmployee,
                password: checkUser[0].password,
                employeeNumber: user[0].employeeNumber,
                officeCode: user[0].officeCode,
                jobTitle: user[0].jobTitle,
            };
            return result;
        }

        if (checkUser[0] && checkUser[0].isCustomer) {
            user = await Customer.query().where("customerNumber", checkUser[0].customerNumber);

            result = {
                isCustomer: checkUser[0].isCustomer,
                password: checkUser[0].password,
                customerNumber: user[0].customerNumber,
                salesRepEmployeeNumber: user[0].salesRepEmployeeNumber,
                jobTitle: "Customer",
            };
            return result;
        }
    } catch (error) {
        throw error;
    }
};

const getByEmployeeNumber = async (employeeNumber) => {
    const user = await User.query().findOne({ employeeNumber: employeeNumber });
    return user;
};

const getByCustomerNumber = async (customerNumber) => {
    const user = await User.query().findOne({ customerNumber: customerNumber });
    return user;
};

module.exports = {
    hashPassword,
    generateTokenWithEmployee,
    generateTokenWithCustomer,
    isPasswordValid,
    getUserByUsername,
    getByEmployeeNumber,
    getByCustomerNumber,
};
