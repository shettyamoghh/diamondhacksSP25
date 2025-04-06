const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const classRoutes = require('./classRoutes');
const uploadRoutes = require('./uploadRoutes');
const roadmapRoutes = require('./roadmapRoutes');
const progressRoutes = require('./progressRoutes');


router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/classes', classRoutes);
router.use('/upload-syllabus', uploadRoutes); 
router.use('/roadmaps', roadmapRoutes);
router.use('/progress', progressRoutes);
module.exports = router;
