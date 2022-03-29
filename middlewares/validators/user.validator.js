const { celebrate, Joi } = require("celebrate");

const userSchema = {
    username: Joi.string().min(3).max(20).required(),
    password: Joi.string()
        .min(6)
        .max(100)
        .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/)
        .required(),
    employeeNumber: Joi.number().positive().optional(),
    customerNumber: Joi.number().positive().optional(),
};

const validateUser = celebrate(
    {
        body: Joi.object().keys(userSchema),
    },
    {
        abortEarly: false,
        convert: false,
        presence: "required",
        escapeHtml: true,
    },
);

module.exports = {
    validateUser,
};
