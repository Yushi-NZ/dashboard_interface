import cookie from "cookie";
import jwt from "jsonwebtoken";

const COOKIE_NAME = "xero_auth";

export function setAuthCookie(res, payload) {
  // 1. Fallback for the secret so it doesn't throw a "missing secret" error
  const secret = process.env.APP_JWT_SECRET || "temporary_development_secret_123";

  // 2. Ensure payload is a valid object for JWT
  const cleanPayload = payload && typeof payload === 'object' ? payload : { data: payload };

  try {
    const token = jwt.sign(cleanPayload, secret, { expiresIn: "7d" });

    // 3. Safety check: Ensure res.setHeader exists (Pages Router style)
    if (res && typeof res.setHeader === "function") {
      res.setHeader(
        "Set-Cookie",
        cookie.serialize(COOKIE_NAME, token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        })
      );
    } else {
      console.warn("setAuthCookie: 'res' object is missing or incompatible.");
    }
  } catch (error) {
    console.error("JWT Signing Error:", error.message);
    throw error; // Re-throw so your handler's catch block can see it
  }
}

export function getAuthCookie(req) {
  const cookies = cookie.parse(req?.headers?.cookie || "");
  const token = cookies[COOKIE_NAME];
  if (!token) return null;

  try {
    const secret = process.env.APP_JWT_SECRET || "temporary_development_secret_123";
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
}