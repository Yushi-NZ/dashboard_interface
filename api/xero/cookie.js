import cookie from "cookie";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "xero_auth";

export function setAuthCookie(res, payload) {
  const token = jwt.sign(payload, process.env.APP_JWT_SECRET, { expiresIn: "7d" });

  res.setHeader(
    "Set-Cookie",
    cookie.serialize(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
  );
}

export function getAuthCookie(req) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies[COOKIE_NAME];
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.APP_JWT_SECRET);
  } catch {
    return null;
  }
}