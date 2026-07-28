const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');
const { autoWhitelist, checkWhitelist } = require('../middleware/ipWhitelist');

router.post('/admin/login', autoWhitelist, admin.adminLogin);

router.get('/admin/users', checkWhitelist, admin.getUsers);
router.put('/admin/users/:id', checkWhitelist, admin.updateUser);
router.delete('/admin/users/:id', checkWhitelist, admin.deleteUser);

router.get('/admin/whitelist', checkWhitelist, admin.getWhitelistedIPs);
router.post('/admin/whitelist', checkWhitelist, admin.addWhitelistedIP);
router.delete('/admin/whitelist/:id', checkWhitelist, admin.removeWhitelistedIP);

module.exports = router;
