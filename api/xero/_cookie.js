import cookie from "cookie";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "xero_auth";

export function setAuthCookie(res, payload) {
  const secret = process.env.APP_JWT_SECRET;
  if (!secret) throw new Error("APP_JWT_SECRET is missing in environment variables");

  const token = jwt.sign(payload || {}, secret, { expiresIn: "7d" });

  if (res && res.setHeader) {
    res.setHeader("Set-Cookie", cookie.serialize(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    }));
  }
}

export function getAuthCookie(req) {
  const cookies = cookie.parse(req?.headers?.cookie || "");
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.APP_JWT_SECRET);
  } catch { return null; }
}