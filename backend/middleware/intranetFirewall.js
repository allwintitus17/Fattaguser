// middleware/intranetFirewall.js

function isPrivateIp(ip) {
  if (!ip) return false;
  const parts = ip.split('.').map(Number);
  return (
    parts[0] === 10 ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168)
  );
}

async function intranetFirewall(req, res, next) {
  let ip = req.headers['x-forwarded-for']?.split(',')[0].trim()
           || req.connection?.remoteAddress
           || req.socket?.remoteAddress
           || req.ip;

  if (ip.startsWith('::ffff:')) ip = ip.replace('::ffff:', '');

  const allowed = isPrivateIp(ip);

  // Log every request
  const log = {
    ip,
    route: req.originalUrl,
    method: req.method,
    timestamp: new Date(),
    status: allowed ? "ALLOWED" : "BLOCKED"
  };
  console.log(`[${log.timestamp.toISOString()}] ${log.status} - ${ip} - ${req.method} ${req.originalUrl}`);

  // Optional: save to MongoDB
  if (RequestLog) {
    try {
      await new RequestLog(log).save();
    } catch (err) {
      console.error("Failed to save request log:", err.message || err);
    }
  }

  if (!allowed) {
    return res.status(403).json({ message: "Access Denied: Not in Local Network" });
  }

  next();
}

module.exports = intranetFirewall;
