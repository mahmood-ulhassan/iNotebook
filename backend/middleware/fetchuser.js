const jwt = require('jsonwebtoken');
const secretKey = 'FATIMA_SHEIKH';

// Middleware function to authenticate JWT token
const authenticateToken = (req, res, next) => {
    // Extract token from authorization header or query parameter
    const token = req.header('authtoken')
 
    if (!token) {
        return res.status(401).json({ error: 'Access denied. Token not provided.' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded; // Attach decoded payload to request object
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token.' });
    }
};
module.exports =  authenticateToken ;
