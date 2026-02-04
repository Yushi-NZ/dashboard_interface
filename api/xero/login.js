export default function handler(req, res) {
  const clientId = process.env.XERO_CLIENT_ID;
  const redirectUri = process.env.XERO_REDIRECT_URL;
  const scopes = process.env.XERO_SCOPES;

  if (!clientId || !redirectUri || !scopes) {
    return res.status(500).json({
      error: "Missing Xero env vars",
      XERO_CLIENT_ID: !!clientId,
      XERO_REDIRECT_URI: !!redirectUri,
      XERO_SCOPES: !!scopes,
    });
  }

  const state = "xero_" + Date.now();

  const url =
    "https://login.xero.com/identity/connect/authorize" +
    `?response_type=code` +
    `&client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&state=${encodeURIComponent(state)}`;

  res.redirect(url);
}