import { getAuthCookie, setAuthCookie } from "./_cookie.js";

export default async function handler(req, res) {
  try {
    const auth = getAuthCookie(req);
    if (!auth?.access_token) return res.status(401).json({ error: "Unauthorized" });

    const response = await fetch("https://api.xero.com/connections", {
      headers: {
        Authorization: `Bearer ${auth.access_token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    const tenantId = data?.[0]?.tenantId;

    if (tenantId) {
      // Use fallback to avoid spreading null
      setAuthCookie(res, { ...(auth || {}), tenantId });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Connections crash", message: err.message });
  }
}