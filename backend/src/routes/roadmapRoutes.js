const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const { createRoadmap, getRoadmapByClass } = require('../controllers/roadmapController');

router.post('/', verifyToken, createRoadmap);
router.get('/:classId', verifyToken, getRoadmapByClass);

module.exports = router;
