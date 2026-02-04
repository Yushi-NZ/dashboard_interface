import { getAuthCookie, setAuthCookie } from "./_cookie.js";

export default async function handler(req, res) {
  try {
    const auth = getAuthCookie(req);

    if (!auth) {
      return res.status(401).json({ error: "No auth cookie found" });
    }

    if (!auth.access_token) {
      return res.status(401).json({ error: "Missing access_token in cookie", authKeys: Object.keys(auth) });
    }

    const response = await fetch("https://api.xero.com/connections", {
      headers: {
        Authorization: `Bearer ${auth.access_token}`,
        Accept: "application/json",
      },
    });

    const text = await response.text(); // read raw response first

    let connections;
    try {
      connections = JSON.parse(text);
    } catch {
      connections = { raw: text };
    }

    if (!response.ok) {
      // DO NOT convert Xero errors to 500
      return res.status(response.status).json({
        error: "Xero /connections failed",
        status: response.status,
        connections,
      });
    }

    const tenantId = connections?.[0]?.tenantId;
    if (!tenantId) {
      return res.status(400).json({
        error: "No Xero tenantId found",
        connections,
      });
    }

    setAuthCookie(res, { ...auth, tenantId });

    return res.status(200).json({ tenantId, connections });
  } catch (err) {
    return res.status(500).json({
      error: "Server crashed",
      message: err?.message,
      stack: err?.stack,
    });
  }
}