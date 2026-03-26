
// Access token expiration time
export const ACCESS_TOKEN_EXPIRES_IN = "15m";

// Refresh token expiration time
export const REFRESH_TOKEN_EXPIRES_IN = "7d";

// Cookie configuration for refresh token
export const COOKIE_OPTIONS = {
  httpOnly: true,     // Prevent JavaScript access
  secure: false,      // Set to true in production (HTTPS)
  sameSite: "strict"  // Prevent CSRF attacks
};