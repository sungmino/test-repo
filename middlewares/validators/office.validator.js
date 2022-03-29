const { celebrate, Joi } = require("celebrate");

const officeSchemaPost = {
    officeCode: Joi.string().min(1).max(20).required(),
    city: Joi.string().min(1).max(50).required(),
    phone: Joi.string().min(8).max(20).required(),
    addressLine1: Joi.string().max(10).max(50).required(),
    addressLine2: Joi.string().max(10).max(50).optional().allow(null),
    state: Joi.string().min(2).max(50).allow(null).optional(),
    country: Joi.string().min(2).max(50).required(),
    postalCode: Joi.string().min(5).max(15).allow(null).optional(),
    territory: Joi.string().min(1).max(50).required(),
};

const officeSchemaPut = {
    city: Joi.string().min(1).max(50).required(),
    phone: Joi.string().min(8).max(20).required(),
    addressLine1: Joi.string().max(10).max(50).required(),
    addressLine2: Joi.string().max(10).max(50).optional().allow(null),
    state: Joi.string().min(2).max(50).allow(null).optional(),
    country: Joi.string().min(2).max(50).required(),
    postalCode: Joi.string().min(5).max(15).allow(null).optional(),
    territory: Joi.string().min(1).max(50).required(),
};

const validateGetByIdResponse = async (response) => {
    const res = Joi.object(officeSchemaPost);
    await res.validateAsync(response);
};

const validateGetAllResponse = async (response) => {
    const res = Joi.array().items(Joi.object().keys(officeSchemaPost));
    await res.validateAsync(response);
};

const validateOfficePost = celebrate(
    {
        body: Joi.object().keys(officeSchemaPost),
    },
    {
        abortEarly: false,
        convert: false,
        presence: "required",
        escapeHtml: true,
    },
);

const validateOfficePut = celebrate(
    {
        body: Joi.object().keys(officeSchemaPut),
    },
    {
        abortEarly: false,
        convert: false,
        presence: "required",
        escapeHtml: true,
    },
);

module.exports = {
    validateOfficePost,
    validateOfficePut,
    validateGetAllResponse,
    validateGetByIdResponse,
};
