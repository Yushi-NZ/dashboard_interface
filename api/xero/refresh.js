import { getAuthCookie, setAuthCookie } from "./_cookie.js";

// Helper function to get a new token inside the same request
async function refreshXeroToken(refreshToken) {
  const response = await fetch("https://identity.xero.com/connect/token", {
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
  return await response.json();
}

export default async function handler(req, res) {
  try {
    let auth = getAuthCookie(req);
    if (!auth?.access_token) return res.status(401).json({ error: "No session" });

    let response = await fetch("https://api.xero.com/connections", {
      headers: {
        Authorization: `Bearer ${auth.access_token}`,
        Accept: "application/json",
      },
    });

    // IF TOKEN EXPIRED: Try to refresh once
    if (response.status === 401 && auth.refresh_token) {
      const newTokens = await refreshXeroToken(auth.refresh_token);
      
      if (newTokens.access_token) {
        // Update the auth object and the cookie
        auth = { 
          ...auth, 
          access_token: newTokens.access_token, 
          refresh_token: newTokens.refresh_token 
        };
        setAuthCookie(res, auth);

        // Retry the original request with the NEW token
        response = await fetch("https://api.xero.com/connections", {
          headers: {
            Authorization: `Bearer ${auth.access_token}`,
            Accept: "application/json",
          },
        });
      }
    }

    const connections = await response.json();
    
    // Now return the final result
    if (!response.ok) return res.status(response.status).json({ error: "Xero API Error", connections });

    const tenantId = connections?.[0]?.tenantId;
    if (tenantId) setAuthCookie(res, { ...auth, tenantId });

    return res.status(200).json({ tenantId, connections });

  } catch (err) {
    return res.status(500).json({ error: "Logic crash", message: err.message });
  }
}