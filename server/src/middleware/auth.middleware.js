import jwt from "jsonwebtoken";

/*
=====================================================
AUTHENTICATION MIDDLEWARE
=====================================================

Purpose:
- Verify JWT access token
- Attach decoded user to req.user
- Protect private routes

Flow:
1. Read access token from cookies
2. Verify token using JWT secret
3. Attach decoded payload to req.user
4. Call next()
*/

export const authenticate = (req, res, next) => {
try {
    // 1. Get access token from cookies
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({
        message: "Access denied. No token provided."
    });
}

    // 2. Verify token
    const decoded = jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET
    );

    // 3. Attach user info to request
    req.user = decoded;

    // 4. Continue to next middleware/controller
    next();

} catch (error) {
    return res.status(401).json({
    message: "Invalid or expired token"
    });
}
};