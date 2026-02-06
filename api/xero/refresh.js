import { getAuthCookie, setAuthCookie } from "./_cookie.js";

async function refreshXeroToken(refreshToken) {
  const res = await fetch("https://identity.xero.com/connect/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + Buffer.from(`${process.env.XERO_CLIENT_ID}:${process.env.XERO_CLIENT_SECRET}`).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  if (!res.ok) throw new Error("Refresh failed");
  return res.json();
}

export default async function handler(req, res) {
  try {
    let auth = getAuthCookie(req);
    if (!auth?.access_token) return res.status(401).json({ error: "No session" });

    // 1. Attempt the request
    let response = await fetch("https://api.xero.com/connections", {
      headers: {
        Authorization: `Bearer ${auth.access_token}`,
        Accept: "application/json",
      },
    });

    // 2. If Expired (401), try to refresh and retry ONCE
    if (response.status === 401 && auth.refresh_token) {
      try {
        const newTokens = await refreshXeroToken(auth.refresh_token);
        auth = { 
          ...auth, 
          access_token: newTokens.access_token, 
          refresh_token: newTokens.refresh_token 
        };
        
        // Save the new tokens back to the cookie
        setAuthCookie(res, auth);

        // Retry the original request with the new token
        response = await fetch("https://api.xero.com/connections", {
          headers: {
            Authorization: `Bearer ${auth.access_token}`,
            Accept: "application/json",
          },
        });
      } catch (refreshErr) {
        return res.status(401).json({ error: "Session expired, please login again." });
      }
    }

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: "Xero Error", data });

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Server error", message: err.message });
  }
}