const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/protected', verifyToken, (req, res) => {
  res.json({
    message: 'This is protected data!',
    userId: req.user.userId
  });
});

module.exports = router;
