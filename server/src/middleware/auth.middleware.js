import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
const token = req.cookies.accessToken;

    if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
}

try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
        id: decoded.userId,
        role: decoded.role
    };

    next();
} catch (error) {
    return res.status(401).json({ message: "Invalid token" });
}
};