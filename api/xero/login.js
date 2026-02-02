export default function handler(req, res) {
  const { XERO_CLIENT_ID, XERO_REDIRECT_URL, XERO_SCOPES } = process.env;

  if (!XERO_CLIENT_ID || !XERO_REDIRECT_URL || !XERO_SCOPES) {
    return res.status(500).json({ error: "Missing Environment Variables" });
  }

  // We'll use a hardcoded state for a moment just to eliminate variables
  // In production, you'd store this in a cookie.
  const state = "12345"; 

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: XERO_CLIENT_ID,
    redirect_uri: XERO_REDIRECT_URL,
    scope: XERO_SCOPES,
    state: state
  });

  res.redirect(`https://login.xero.com/identity/connect/authorize?${params.toString()}`);
}