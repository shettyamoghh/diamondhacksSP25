const express = require('express');
const router = express.Router();
const multer = require('multer');
const verifyToken = require('../middleware/verifyToken');
const { addClass, getUserClasses, getClassById, getClassDetails, getClassTopics } = require('../controllers/classController');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', verifyToken, upload.single('syllabusFile'), addClass);
router.get('/', verifyToken, getUserClasses);
router.get('/:id/details', verifyToken, getClassDetails);
router.get('/:id/topics', verifyToken, getClassTopics);

module.exports = router;
