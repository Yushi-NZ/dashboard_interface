import { getAuthCookie } from "./_cookie.js";

export default async function handler(req, res) {
  const auth = getAuthCookie(req);
  if (!auth?.access_token) return res.status(401).json({ error: "Not connected to Xero" });
  if (!auth?.tenantId) return res.status(400).json({ error: "Missing tenantId. Call /api/xero/connections first." });

  const response = await fetch("https://api.xero.com/api.xro/2.0/Invoices", {
    headers: {
      Authorization: `Bearer ${auth.access_token}`,
      "Xero-tenant-id": auth.tenantId,
      Accept: "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    return res.status(500).json({ error: "Failed to fetch invoices", data });
  }

  res.status(200).json(data);
}