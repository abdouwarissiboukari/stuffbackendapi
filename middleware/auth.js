const jwt = require('jsonwebtoken');
const jwtSECRET = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken =jwt.verify(token, jwtSECRET);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();        
    } catch (error) {
        res.status(401).json({ message: `Invalid authorization token! ${error}`});
    }
};