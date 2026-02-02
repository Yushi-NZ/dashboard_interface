import { setAuthCookie } from "./_cookie.js";

export default async function handler(req, res) {
  // 1. Extract the code from the query string
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Missing ?code from Xero callback.");
  }

  const clientId = process.env.XERO_CLIENT_ID;
  const clientSecret = process.env.XERO_CLIENT_SECRET;
  const redirectUri = process.env.XERO_REDIRECT_URL;

  try {
    // 2. Exchange the code for a token
    // We use the built-in URLSearchParams for the body and btoa for the auth header
    const tokenRes = await fetch("https://identity.xero.com/connect/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + btoa(`${clientId}:${clientSecret}`),
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri, // This must match exactly what you used in the first step
      }),
    });

    const tokens = await tokenRes.json();

    // 3. Handle errors from Xero
    if (!tokenRes.ok) {
      console.error("Xero Exchange Error:", tokens);
      return res.status(tokenRes.status).json({ 
        error: "Token exchange failed", 
        details: tokens 
      });
    }

    // 4. Store in cookie
    // Ensure setAuthCookie handles the res object correctly
    setAuthCookie(res, {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in,
      created_at: Date.now(),
    });

    // 5. Success redirect
    // Use a full URL or a relative path depending on your Vercel setup
    res.redirect("/dashboard");

  } catch (error) {
    console.error("Internal Handler Error:", error);
    return res.status(500).json({ error: "Internal server error during exchange" });
  }
}