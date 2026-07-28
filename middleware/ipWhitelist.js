const WhitelistedIP = require('../models/WhitelistedIP');

function getClientIP(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.connection.remoteAddress || req.ip;
}

async function autoWhitelist(req, res, next) {
  try {
    const ip = getClientIP(req);
    if (!ip || ip === '::1' || ip === '127.0.0.1' || ip === '::ffff:127.0.0.1') {
      return next();
    }

    const exists = await WhitelistedIP.findOne({ ip });
    if (!exists) {
      await WhitelistedIP.create({ ip, label: 'Auto-whitelisted', addedBy: 'auto' });
      console.log(`IP auto-whitelisted: ${ip}`);
    }
    next();
  } catch (err) {
    console.error('Auto-whitelist error:', err.message);
    next();
  }
}

async function checkWhitelist(req, res, next) {
  try {
    const ip = getClientIP(req);

    if (!ip || ip === '::1' || ip === '127.0.0.1' || ip === '::ffff:127.0.0.1') {
      return next();
    }

    const allowed = await WhitelistedIP.findOne({ ip });
    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Your IP is not whitelisted.',
        ip: ip,
      });
    }
    next();
  } catch (err) {
    console.error('IP check error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
}

module.exports = { autoWhitelist, checkWhitelist, getClientIP };
