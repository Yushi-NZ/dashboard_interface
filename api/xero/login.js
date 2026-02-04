export default async function handler(req, res) {
  const clientId = import.meta.env.XERO_CLIENT_ID;
  const redirectUrl = import.meta.env.XERO_REDIRECT_URL;
  const scopes = import.meta.env.XERO_SCOPES;

  const state = "xero_" + Date.now(); // you can make this stronger later

  const url =
    "https://login.xero.com/identity/connect/authorize" +
    `?response_type=code` +
    `&client_id=${encodeURlComponent(clientId)}` +
    `&redirect_url=${encodeURLComponent(redirectUrl)}` +
    `&scope=${encodeURLComponent(scopes)}` +
    `&state=${encodeURLComponent(state)}`;

  res.redirect(url);
}