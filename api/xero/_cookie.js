export default async function handler(req, res) {
  try {
    const auth = getAuthCookie(req) || {}; // Safety: fallback to empty object

    // ... (your fetch logic) ...

    const tenantId = connections?.[0]?.tenantId;
    
    if (!tenantId) {
      // Explicit return to stop execution
      return res.status(400).json({
        error: "No Xero tenantId found",
        connections,
      });
    }

    // Only set the cookie if we actually have a tenantId
    try {
      setAuthCookie(res, { ...auth, tenantId });
    } catch (cookieErr) {
      return res.status(500).json({ error: "Cookie setting failed", message: cookieErr.message });
    }

    return res.status(200).json({ tenantId, connections });

  } catch (err) {
    // This will now tell you EXACTLY what is failing
    return res.status(500).json({
      error: "Server crashed",
      message: err?.message,
      code: err?.code, // Check for ERR_HTTP_HEADERS_SENT
    });
  }
}