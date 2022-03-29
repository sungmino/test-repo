const { createOrderDetails } = require("../services/orderdetails.service");

exports.createOrderDetailsController = async (req, res, next) => {
    // const headerInfo = {
    //     userInfo: res.locals.authData,
    //     action: req.originalUrl,
    //     method: req.method,
    // };
    const orderDetails = req.body || {};
    let newOrderDetails;
    const { jobTitle } = res.locals.authData;
    switch (jobTitle) {
        case "Customer":
            newOrderDetails = await createOrderDetails(orderDetails);
            res.status(201).send({
                success: true,
                message: "Create a new orderDetails successfully",
                data: newOrderDetails,
            });
            break;
        default:
            break;
    }
};
