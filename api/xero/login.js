export default async function handler(req, res) {
  const clientId = process.env.XERO_CLIENT_ID;
  const redirectUri = process.env.XERO_REDIRECT_URI;
  const scopes = process.env.XERO_SCOPES;

  const state = "xero_" + Date.now(); // you can make this stronger later

  const url =
    "https://login.xero.com/identity/connect/authorize" +
    `?response_type=code` +
    `&client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&state=${encodeURIComponent(state)}`;

  res.redirect(url);
}