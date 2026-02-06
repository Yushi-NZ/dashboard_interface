export default function handler(req, res) {
  // Use process.env for Node.js API routes
  const { XERO_CLIENT_ID, XERO_REDIRECT_URL, XERO_SCOPES } = process.env;

  if (!XERO_CLIENT_ID || !XERO_REDIRECT_URL || !XERO_SCOPES) {
    return res.status(500).json({ error: "Server missing environment configuration" });
  }

  const state = "xero_" + Date.now();

  const url =
    "https://login.xero.com/identity/connect/authorize" +
    `?response_type=code` +
    `&client_id=${encodeURIComponent(XERO_CLIENT_ID)}` +
    `&redirect_uri=${encodeURIComponent(XERO_REDIRECT_URL)}` +
    `&scope=${encodeURIComponent(XERO_SCOPES)}` +
    `&state=${encodeURIComponent(state)}` +
    `&prompt=consent`; // Forces Xero to refresh permissions

  // Use writeHead for the most reliable redirect in Vercel functions
  res.writeHead(302, { Location: url });
  res.end();
}