const User = require("../models/user.model");
const userCommon = require("../commons/user.common");
const employeeCommon = require("../commons/employee.common");
const customerCommon = require("../commons/customer.common");

const { AppError } = require("../middlewares/handleError/error");

const createUser = async (user) => {
    const { username, password } = user;
    const employeeNumber = user.employeeNumber ? user.employeeNumber : null;
    const customerNumber = user.customerNumber ? user.customerNumber : null;

    try {
        let infoUser;
        if (employeeNumber) {
            const checkUser = await userCommon.getByEmployeeNumber(employeeNumber);
            if (checkUser) {
                throw new AppError("User is already exists!", 409);
            }

            const checkEmployee = await employeeCommon.getById(employeeNumber);

            if (!checkEmployee) {
                throw new AppError("Employee does not exist to create an account", 400);
            }

            const hashedPassword = await userCommon.hashPassword(password);

            infoUser = {
                ...user,
                password: hashedPassword,
                isCustomer: 0,
                isEmployee: 1,
            };
            await User.query().insert(infoUser);
            return { message: `Successfully created user ${username}` };
        }

        const checkUser = await userCommon.getByCustomerNumber(customerNumber);
        if (checkUser) {
            throw new AppError("User is already exists!", 409);
        }

        const checkCustomer = await customerCommon.getById(customerNumber);

        if (!checkCustomer) {
            throw new AppError("Customer does not exist to create an account", 400);
        }

        const hashedPassword = await userCommon.hashPassword(password);

        infoUser = {
            ...user,
            password: hashedPassword,
            isCustomer: true,
            isEmployee: false,
        };

        await User.query().insert(infoUser);
        return { message: `Successfully created user ${username}` };
    } catch (error) {
        throw error;
    }
};

const login = async (credentials) => {
    const { username, password } = credentials;
    try {
        const user = await userCommon.getUserByUsername(username);

        if (user) {
            const isValidPassword = await userCommon.isPasswordValid(password, user.password);

            if (isValidPassword) {
                let token;
                if (user.isEmployee) {
                    token = await userCommon.generateTokenWithEmployee(user);
                    return { success: true, token };
                }

                token = await userCommon.generateTokenWithCustomer(user);
                return { success: true, token };
            }

            throw new AppError("Some errors occurred while handle password", 500);
        }

        throw new AppError("Invalid username or password", 400);
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createUser,
    login,
};
