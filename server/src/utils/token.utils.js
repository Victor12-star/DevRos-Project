import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from "../config/auth.config.js";

export const generateAccessToken = (user) => {
    return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
    );
};

export const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
};