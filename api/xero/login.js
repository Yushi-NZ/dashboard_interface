export default function handler(req, res) {
  const clientId = process.env.XERO_CLIENT_ID;
  const redirectUrl = process.env.XERO_REDIRECT_URL;
  const scopes = process.env.XERO_SCOPES;

  if (!clientId || !redirectUrl || !scopes) {
    return res.status(500).json({
      error: "Missing Xero env vars",
    });
  }

  // Generate a simple random state string without imports
  const state = Date.now();

  // Use the native URLSearchParams (available in Node.js & Browsers) 
  // This replaces the need for manual encodeURIComponent calls
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_url: redirectUrl,
    scope: scopes,
    state: state
  });

  const authUrl = `https://login.xero.com/identity/connect/authorize?${params.toString()}`;

  res.redirect(authUrl);
}