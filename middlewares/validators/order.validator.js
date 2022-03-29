const { celebrate, Joi } = require("celebrate");

const orderSchemaPost = {
    comments: Joi.string().allow(null).min(5).max(200).required(),
    COD: Joi.boolean().required(),
    products: Joi.array().items({
        productCode: Joi.string().max(15).required(),
        quantityOrdered: Joi.number().required(),
    }),
};

const orderSchemaUpdateStatus = {
    orderNumber: Joi.number().required(),
    status: Joi.string().required(),
    comments: Joi.string().required(),
};

const validateBodyPost = celebrate(
    {
        body: Joi.object().keys(orderSchemaPost),
    },
    {
        abortEarly: false,
        convert: false,
        presence: "required",
        escapeHtml: true,
    },
);

const validateBodyUpdateStatus = celebrate(
    {
        body: Joi.object().keys(orderSchemaUpdateStatus),
    },
    {
        abortEarly: false,
        convert: false,
        presence: "required",
        escapeHtml: true,
    },
);

module.exports = {
    validateBodyPost,
    validateBodyUpdateStatus,
};
