const jwt = require("jsonwebtoken");

const auth = (roles) => {
    return function (req, res, next) {
        const authorization = req.headers.authorization || "";
        const secret = process.env.TOKEN_SECRET;

        try {
            const token = authorization.replace("Bearer ", "");

            if (!token) {
                throw new Error();
            }

            const data = jwt.verify(token, secret);

            const role = data.jobTitle;

            req.role = role;

            if (!role) {
                throw new Error();
            }

            if (roles.includes(role)) {
                res.locals.authData = data;
                return next();
            }

            return res.status(403).send({ error: "Forbidden." });
        } catch (error) {
            return res.status(401).send({ error: "Unauthorized." });
        }
    };
};

module.exports = auth;
