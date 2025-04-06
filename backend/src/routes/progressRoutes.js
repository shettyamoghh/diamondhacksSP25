const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { markStepComplete } = require('../controllers/progressController');

// POST /progress/:id – mark the roadmap step (with id) as complete
router.post('/:id', verifyToken, markStepComplete);

module.exports = router;
