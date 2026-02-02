export default async function handler(req, res) {
  const clientId = import.meta.env.VITE_XERO_CLIENT_ID;
  const redirectUrl = import.meta.env.VITE_XERO_REDIRECT_URL;
  const scopes = import.meta.env.VITE_XERO_SCOPES;

  const state = "xero_" + Date.now(); // you can make this stronger later



  console.log(clientId);
}