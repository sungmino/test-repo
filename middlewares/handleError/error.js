const { isCelebrateError } = require("celebrate");

class AppError extends Error {
    constructor(message, statusCode, status) {
        super(message);

        this.statusCode = statusCode;
        this.status = status;
        Error.captureStackTrace(this, this.constructor);
    }
}

const handleErrorInAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

const errorHandlingWithCelebrate = (err, req, res, next) => {
    if (isCelebrateError(err)) {
        const errorQuery = err.details.get("query");
        if (errorQuery) {
            // const {
            //     details: [errorDetails],
            // } = errorQuery;
            return res.status(400).send({
                statusCode: 400,
                message: "Query string validate failed",
            });
        }
        const errorBody = err.details.get("body");
        if (errorBody) {
            return res.status(400).send({
                statusCode: 400,
                message: "Body validate failed",
            });
        }
    }

    return next(err);
};

const handleErrorsGlobal = (error, req, res, next) => {
    // if (isCelebrateError(error)) {
    //     return next(error);
    // }
    if (error) {
        const { statusCode = 500, status = "error", message } = error;
        return res.status(statusCode).send({
            status,
            message,
        });
    }
};

module.exports = {
    AppError,
    handleErrorInAsync,
    handleErrorsGlobal,
    errorHandlingWithCelebrate,
};
