import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import {
    generateAccessToken,
    generateRefreshToken,
    hashToken
} from "../utils/token.utils.js";
import { COOKIE_OPTIONS } from "../config/auth.config.js";

/*
SALT_ROUNDS controls how expensive bcrypt hashing is.
Higher = more secure but slower.
12 is production-safe and widely used.
*/
const SALT_ROUNDS = 12;


/*
=====================================================
REGISTER CONTROLLER
=====================================================

This handles new user registration.

Flow:
1. Validate input
2. Check if email already exists
3. Hash password securely
4. Create user in database
5. Generate access + refresh tokens
6. Hash refresh token before storing
7. Store refresh token in DB
8. Send tokens as HTTP-only cookies
*/
export const register = async (req, res) => {
try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
    }

    // Enforce minimum password strength
    if (password.length < 8) {
    return res.status(400).json({
        message: "Password must be at least 8 characters"
    });
    }

    // Check if email already exists (prevents duplicate accounts)
    const existingUser = await prisma.user.findUnique({
    where: { email }
    });

    if (existingUser) {
    return res.status(409).json({
        message: "Email already registered"
    });
    }

    /*
    Hash the password using bcrypt.
    This prevents storing raw passwords in database.
    Even if DB is leaked, attackers cannot see real passwords.
    */
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create new user record
    const user = await prisma.user.create({
    data: {
        name,
        email,
        password: hashedPassword
    }
    });

    /*
    Generate short-lived access token (15 minutes).
    This is used for authenticated API requests.
    */
    const accessToken = generateAccessToken(user);

    /*
    Generate long-lived refresh token (7 days).
    This is used to issue new access tokens.
    */
    const refreshToken = generateRefreshToken(user);

    /*
    Hash refresh token before storing in DB.
    We NEVER store raw refresh tokens.
    If DB is leaked, attacker cannot reuse them.
    */
    const hashedRefreshToken = hashToken(refreshToken);

    // Store hashed refresh token in database
    await prisma.refreshToken.create({
    data: {
        tokenHash: hashedRefreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
});

    /*
    Send tokens as HTTP-only cookies.
    httpOnly prevents JavaScript access (protects against XSS).
    
    secure should be true in production (HTTPS only).
    */
    res.cookie("accessToken", accessToken, {
    ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
    ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
    message: "User registered successfully"
    });

} catch (error) {
    // Never leak internal error details in production
    res.status(500).json({ message: "Server error" });
}
};


/*
=====================================================
LOGIN CONTROLLER
=====================================================

This authenticates existing users.

Flow:
1. Validate input
2. Find user by email
3. Compare password using bcrypt.compare()
4. Generate tokens
5. Store hashed refresh token
6. Send secure cookies
*/
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);
    const hashedRefreshToken = hashToken(refreshToken);

    await prisma.refreshToken.create({
      data: {
        tokenHash: hashedRefreshToken,
        userId: user.id
      }
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: "Login successful"
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

/*
=====================================================
REFRESH CONTROLLER
=====================================================

Used when access token expires.

Flow:
1. Read refresh token from cookies
2. Hash it
3. Verify it exists in DB and not revoked
4. Issue new access token
*/
export const refresh = async (req, res) => {
try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return res.status(401).json({
        message: "No refresh token"
    });
    }

    const hashedToken = hashToken(refreshToken);

    const storedToken = await prisma.refreshToken.findFirst({
    where: {
        tokenHash: hashedToken,
        revoked: false,
        expiresAt: { gt: new Date() }
    },
    include: { user: true }
    });

    if (!storedToken) {
        return res.status(403).json({
        message: "Invalid refresh token"
    });
    }

    const newAccessToken = generateAccessToken(storedToken.user);

    res.cookie("accessToken", newAccessToken, {
    ...COOKIE_OPTIONS,
      maxAge: 15 * 60 * 1000
    });

    res.json({
    message: "Token refreshed"
    });

} catch (error) {
    res.status(500).json({ message: "Server error" });
}
};


/*
=====================================================
LOGOUT CONTROLLER
=====================================================

Flow:
1. Read refresh token
2. Hash it
3. Mark it revoked in DB
4. Clear cookies
*/
export const logout = async (req, res) => {
try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
        const hashedToken = hashToken(refreshToken);

    await prisma.refreshToken.updateMany({
        where: { tokenHash: hashedToken },
        data: { revoked: true }
    });
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.json({
    message: "Logged out successfully"
    });

} catch (error) {
    res.status(500).json({ message: "Server error" });
}
};