/*
=====================================================
ROLE AUTHORIZATION MIDDLEWARE
=====================================================
Allows access only if user has required role.
*/

export const authorize = (role) => {
    return (req, res, next) => {

    if (!req.user || req.user.role !== role) {
        return res.status(403).json({
        message: "Access denied. Admin only."
    });
    }

    next();
};
};