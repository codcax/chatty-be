//Node imports
const jwt = require('jsonwebtoken');

exports.isAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw new Error('Authentication failed!')
        }
        jwt.verify(token, 'random');
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Authentication failed!'
        });
    }
}