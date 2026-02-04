import { getAuthCookie, setAuthCookie } from "./_cookie.js";

export default async function handler(req, res) {
  try {
    const auth = getAuthCookie(req);
    if (!auth?.refresh_token) return res.status(401).json({ error: "Missing refresh token" });

    const tokenRes = await fetch("https://identity.xero.com/connect/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // FIX: MUST USE process.env
        "Authorization": "Basic " + Buffer.from(`${process.env.XERO_CLIENT_ID}:${process.env.XERO_CLIENT_SECRET}`).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: auth.refresh_token,
      }),
    });

    const tokens = await tokenRes.json();
    if (!tokenRes.ok) return res.status(tokenRes.status).json({ error: "Xero Refresh Failed", tokens });

    setAuthCookie(res, {
      ...auth,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in,
      created_at: Date.now(),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Server crashed", message: err.message });
  }
}