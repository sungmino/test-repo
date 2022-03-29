const express = require("express");
const { createUser, login } = require("../services/user.service");
const { validateUser } = require("../middlewares/validators/user.validator");
const { handleErrorInAsync } = require("../middlewares/handleError/error");

const router = express.Router();

router.post(
    "/register",
    validateUser,
    handleErrorInAsync(async (req, res) => {
        const user = req.body || {};

        if (user.employeeNumber && user.customerNumber) {
            return res.status(400).send({
                success: false,
                message: "You can only register with the customer or employee role",
            });
        }

        if (!user.employeeNumber && !user.customerNumber) {
            return res.status(400).send({
                success: false,
                message: "You must register with the customer or employee role",
            });
        }

        const newUser = await createUser(user);

        return res.status(201).send({
            success: true,
            message: "Registration successfully",
            data: newUser,
        });
    }),
);

router.post(
    "/login",
    handleErrorInAsync(async (req, res) => {
        const credentials = req.body || {};

        if (!credentials.username || !credentials.password) {
            return res.status(400).send({ error: "Invalid credentials." });
        }

        const result = await login(credentials);

        return res.send({
            success: true,
            message: "Login successfully",
            data: result,
        });
    }),
);

module.exports = router;
