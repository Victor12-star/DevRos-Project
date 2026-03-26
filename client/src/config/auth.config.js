
export const ACCESS_TOKEN_EXPIRES_IN = "15m";
export const REFRESH_TOKEN_EXPIRES_IN = "7d";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false, // change to true in production (HTTPS)
  sameSite: "strict"
};