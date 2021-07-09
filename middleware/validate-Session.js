const jwt = require('jsonwebtoken');
const { models } = require('../models');

const validateSession = async (req, res, next) => {
    if (req.method == 'OPTIONS') {
        next()
    } else if (
        req.headers.authorization &&
        req.headers.authorization.includes('Bearer')
    ) {
        const { authorization } = req.headers;
        // console.log('authorization -->', authorization);
        const payload = authorization
        ? jwt.verify(
            authorization,
            process.env.JWT_SECRET
        )
        : undefined;

        // console.log('payload -->', payload);

        if (payload) {
            let foundUser = await models.UserModel.findOne({ 
                where: { id: payload.id } 
            });
            // console.log('foundUser -->', req);

            if (foundUser) {
                req.user = foundUser;
                // console.log('request -->', req);
                next()
            } else {
                res.status(400).send({ message: "Not Authorized" });
            }
        } else {
            res.status(401).send({ message: 'Invalid token' });
        }
    } else {
        res.status(403).send({ message: "Forbidden" });
    }
};

module.exports = validateSession;