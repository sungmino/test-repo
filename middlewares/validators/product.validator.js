const { celebrate, Joi } = require("celebrate");

const jobTitles = ["President", "Manager", "Leader", "Staff", "Customer"];

const productSchema = {
    productCode: Joi.string().required(),
    productName: Joi.string().min(3).max(50).required(),
    productLine: Joi.string().min(3).max(50).required(),
    productScale: Joi.string().max(50).required(),
    productVendor: Joi.string().max(50).required(),
    productDescription: Joi.string().required(),
    quantityInStock: Joi.number().required(),
    buyPrice: Joi.number().positive().precision(2).required(),
    MSRP: Joi.number().positive().precision(2).required(),
};

const productSchemaUpdate = {
    productName: Joi.string().min(3).max(50).required(),
    productLine: Joi.string().min(3).max(50).required(),
    productScale: Joi.string().max(50).required(),
    productVendor: Joi.string().max(50).required(),
    productDescription: Joi.string().required(),
    quantityInStock: Joi.number().required(),
    buyPrice: Joi.number().positive().precision(2).required(),
    MSRP: Joi.number().positive().precision(2).required(),
};

const productResArrValidate = async (schema, arr) => {
    const res = Joi.array().items(Joi.object().keys(schema));
    await res.validateAsync(arr);
};

const productResByIDValidate = async (schema, object) => {
    const res = Joi.object(schema);
    await res.validateAsync(object);
};

const validateProduct = celebrate(
    {
        body: Joi.object().keys(productSchema),
    },
    {
        abortEarly: false,
        convert: false,
        presence: "required",
        escapeHtml: true,
    },
);

const validateProductUpdate = celebrate(
    {
        body: Joi.object().keys(productSchemaUpdate),
    },
    {
        abortEarly: false,
        convert: false,
        presence: "required",
        escapeHtml: true,
    },
);

module.exports = {
    validateProduct,
    productResArrValidate,
    productResByIDValidate,
    productSchema,
    validateProductUpdate,
};
