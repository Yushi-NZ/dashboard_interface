import { getAuthCookie, setAuthCookie } from "./_cookie.js";

export default async function handler(req, res) {
  try {
    const auth = getAuthCookie(req);
    if (!auth?.access_token) return res.status(401).json({ error: "Not connected to Xero" });

    const response = await fetch("https://api.xero.com/connections", {
      headers: {
        Authorization: `Bearer ${auth.access_token}`,
        Accept: "application/json",
      },
    });

    const connections = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Failed to fetch connections",
        status: response.status,
        connections,
      });
    }

    const tenantId = connections?.[0]?.tenantId;
    if (!tenantId) return res.status(400).json({ error: "No Xero tenantId found.", connections });

    setAuthCookie(res, { ...auth, tenantId });

    res.status(200).json({ tenantId, connections });
  } catch (err) {
    res.status(500).json({
      error: "Unhandled server error",
      message: err?.message,
      stack: err?.stack,
    });
  }
}