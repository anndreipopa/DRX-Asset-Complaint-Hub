const jwt = require('jsonwebtoken');

function verifyToken(req, res, next){
    // Get Authorization header from request
    const authHeader = req.headers['authorization'];
    // Extract token from Authorization header
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        // Return 401 if no token is provided
        return res.status(401).json({message: 'No token provided'});
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token using secret key
        req.user = decoded; // Attach decoded user info to request object for use in subsequent middleware/routes
        next(); // Proceed to next middleware or route handler
    } catch(err){
        return res.status(401).json({message: 'Invalid token'}); // Return 401 if token is invalid or expired
    }

}

function requireRole(roles){
    return function(req, res, next){
        if(!roles.includes(req.user.role)){
            return res.status(403).json({message: "Insufficient permissions"}); // Return 403 if user's role is not in the allowed roles
        }
        next(); // Proceed to next middleware or route handler if user has required role
    }
}

module.exports = { verifyToken, requireRole };