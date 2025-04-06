// src/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const verifyToken = require('../middleware/verifyToken');
const { callAItoGenerateTopics } = require('../controllers/aiController');

// Configure multer to store file in memory (or you can store on disk)
const upload = multer({ storage: multer.memoryStorage() });

// POST /upload-syllabus
router.post('/', verifyToken, upload.single('syllabusFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    const dataBuffer = req.file.buffer;
    const pdfData = await pdfParse(dataBuffer);
    const extractedText = pdfData.text;

    const topics = await callAItoGenerateTopics(extractedText);

    // Return the topics to the client
    res.json({ topics });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while processing syllabus.' });
  }
});

module.exports = router;
