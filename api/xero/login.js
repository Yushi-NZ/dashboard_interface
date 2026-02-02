export default function handler(req, res) {
  const clientId = process.env.XERO_CLIENT_ID;
  const redirectUrl = process.env.XERO_REDIRECT_URL;
  const scopes = process.env.XERO_SCOPES;

  if (!clientId || !redirectUrl || !scopes) {
    return res.status(500).json({
      error: "Missing Xero env vars",
      clientId: !!clientId,
      redirectUrl: !!redirectUrl,
      scopes: !!scopes,
    });
  }

  const url =
    "https://login.xero.com/identity/connect/authorize" +
    `?response_type=code` +
    `&client_id=${encodeURLComponent(clientId)}` +
    `&redirect_uri=${encodeURLComponent(redirectUrl)}` +
    `&scope=${encodeURLComponent(scopes)}` +
    `&state=${encodeURLComponent(state)}`;

  res.redirect(url);
}