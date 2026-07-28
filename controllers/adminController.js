const User = require('../models/User');
const WhitelistedIP = require('../models/WhitelistedIP');
const { getClientIP } = require('../middleware/ipWhitelist');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.json({ success: true, users });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, verified } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email.toLowerCase();
    if (verified !== undefined) user.verified = verified;

    await user.save();

    return res.json({ success: true, message: 'User updated successfully!', user });
  } catch (err) {
    console.error('Update user error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.json({ success: true, message: 'User deleted successfully!' });
  } catch (err) {
    console.error('Delete user error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { password } = req.body;
    if (password !== 'Lesco12-3') {
      return res.status(401).json({ success: false, message: 'Wrong password.' });
    }

    const ip = getClientIP(req);
    if (ip && ip !== '::1' && ip !== '127.0.0.1' && ip !== '::ffff:127.0.0.1') {
      const exists = await WhitelistedIP.findOne({ ip });
      if (!exists) {
        await WhitelistedIP.create({ ip, label: 'Admin login', addedBy: 'admin-login' });
        console.log(`Admin IP auto-whitelisted: ${ip}`);
      }
    }

    return res.json({ success: true, message: 'Admin login successful!', ip });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.getWhitelistedIPs = async (req, res) => {
  try {
    const ips = await WhitelistedIP.find().sort({ createdAt: -1 });
    return res.json({ success: true, ips });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.addWhitelistedIP = async (req, res) => {
  try {
    const { ip, label } = req.body;
    if (!ip) {
      return res.status(400).json({ success: false, message: 'IP address is required.' });
    }

    const exists = await WhitelistedIP.findOne({ ip });
    if (exists) {
      return res.status(400).json({ success: false, message: 'IP already whitelisted.' });
    }

    const newIP = await WhitelistedIP.create({ ip, label: label || 'Manual', addedBy: 'manual' });
    return res.json({ success: true, message: 'IP whitelisted!', ip: newIP });
  } catch (err) {
    console.error('Add whitelist error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.removeWhitelistedIP = async (req, res) => {
  try {
    const { id } = req.params;
    const ip = await WhitelistedIP.findByIdAndDelete(id);
    if (!ip) {
      return res.status(404).json({ success: false, message: 'IP not found.' });
    }
    return res.json({ success: true, message: 'IP removed from whitelist!' });
  } catch (err) {
    console.error('Remove whitelist error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};
