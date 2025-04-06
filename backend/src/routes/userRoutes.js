const express = require('express');
const router = express.Router();
const checkJwt = require('../middleware/verifyToken');
const { getProfile } = require('../controllers/userController');

// GET /users/profile
router.get('/profile', checkJwt, getProfile);

module.exports = router;
