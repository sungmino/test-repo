const { celebrate, Joi } = require("celebrate");

const customerSchema = {
    customerNumber: Joi.number().positive().optional(),
    customerName: Joi.string().min(5).max(50).required(),
    contactLastName: Joi.string().min(3).max(50).required(),
    contactFirstName: Joi.string().min(3).max(50).required(),
    phone: Joi.string().min(8).max(20).required(),
    addressLine1: Joi.string().max(10).max(50).required(),
    addressLine2: Joi.string().max(10).max(50).optional().allow(null),
    city: Joi.string().min(2).max(50).required(),
    state: Joi.string().min(2).max(50).allow(null).optional(),
    postalCode: Joi.string().min(5).max(15).allow(null).optional(),
    country: Joi.string().min(2).max(50).required(),
    salesRepEmployeeNumber: Joi.number().positive().allow(null).required(),
    creditLimit: Joi.number().positive().max(99999999).precision(2).allow(null).optional(),
};

const paramsSchema = {
    orderBy: Joi.string().optional(),
    type: Joi.string().optional(),
    page: Joi.string()
        .ruleset.regex(/^[0-9]*$/)
        .rule({ message: "must be a number" })
        .optional(),
    size: Joi.string()
        .ruleset.regex(/^[0-9]*$/)
        .rule({ message: "must be a number" })
        .optional(),
    customerNumber: Joi.string()
        .ruleset.regex(/^[0-9]*$/)
        .rule({ message: "must be a number" })
        .optional(),
    customerName: Joi.string().min(1).max(50).optional(),
    contactLastName: Joi.string().min(1).max(50).optional(),
    contactFirstName: Joi.string().min(1).max(50).optional(),
    phone: Joi.string().min(1).max(20).optional(),
    addressLine1: Joi.string().max(1).max(50).optional(),
    addressLine2: Joi.string().max(1).max(50).optional(),
    city: Joi.string().min(1).max(50).optional(),
    state: Joi.string().min(1).max(50).optional(),
    postalCode: Joi.string().min(1).max(15).optional(),
    country: Joi.string().min(1).max(50).optional(),
    salesRepEmployeeNumber: Joi.string()
        .ruleset.regex(/^[0-9]*$/)
        .rule({ message: "must be a number" })
        .optional(),
    creditLimit: Joi.string()
        .ruleset.regex(/^[0-9]*$/)
        .rule({ message: "must be a number" })
        .optional(),
};

const validateCustomer = celebrate(
    {
        body: Joi.object().keys(customerSchema),
    },
    {
        abortEarly: false,
        convert: false,
        presence: "required",
        escapeHtml: true,
    },
);

const validateParams = celebrate(
    {
        query: Joi.object().keys(paramsSchema),
    },
    {
        abortEarly: false,
        convert: false,
        presence: "required",
        escapeHtml: true,
    },
);

const customerResArrValidate = async (schema, arr) => {
    const res = Joi.array().items(Joi.object().keys(schema));
    await res.validateAsync(arr);
};

const customerResByIDValidate = async (schema, object) => {
    const res = Joi.object(schema);
    await res.validateAsync(object);
};

module.exports = {
    validateCustomer,
    validateParams,
    customerSchema,
    customerResArrValidate,
    customerResByIDValidate,
};
