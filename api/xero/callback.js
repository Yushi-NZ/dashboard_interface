import { getAuthCookie, setAuthCookie } from "./_cookie.js";

export default async function handler(req, res) {
  try {
    const auth = getAuthCookie(req);
    if (!auth?.access_token) return res.status(401).json({ error: "No access token" });

    const response = await fetch("https://api.xero.com/connections", {
      headers: {
        "Authorization": `Bearer ${auth.access_token}`,
        "Accept": "application/json",
      },
    });

    const connections = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: "Xero API Error", connections });

    const tenantId = connections?.[0]?.tenantId;
    if (!tenantId) return res.status(400).json({ error: "No Tenant ID found", connections });

    // Safe update of the cookie
    setAuthCookie(res, { ...auth, tenantId });

    return res.status(200).json({ tenantId, connections });
  } catch (err) {
    return res.status(500).json({ error: "Server crashed", message: err.message });
  }
}