const jwt = require('jsonwebtoken');

const jwtAuthMiddleWare = (req, res, next) => {
    
    const isHeaders = req.headers.authorization;
    if (!isHeaders) {
        return res.status(401).json({ message: "Token not found" });
    }

    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized, please register" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.jwtPayload = decoded;
        return next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid Token" });
    }

};

const generateToken = (payload) => {
    return jwt.sign(payload,process.env.JWT_SECRET,{expiresIn : '1d'});
}

module.exports = {
    jwtAuthMiddleWare,
    generateToken
};