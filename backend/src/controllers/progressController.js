// src/controllers/progressController.js
const pool = require('../config/db');

// Mark a roadmap step as complete for the logged-in user.
// Expects the roadmap step id in the URL parameters.
exports.markStepComplete = async (req, res) => {
  try {
    const userId = req.user.userId;
    const roadmapStepId = req.params.id;
    // Check if a progress record exists
    const result = await pool.query(
      `SELECT id FROM user_step_progress WHERE user_id = $1 AND roadmap_step_id = $2`,
      [userId, roadmapStepId]
    );
    if (result.rows.length > 0) {
      // Update: mark as complete
      await pool.query(
        `UPDATE user_step_progress
         SET completed = true, date_completed = NOW(), updated_at = NOW()
         WHERE id = $1`,
        [result.rows[0].id]
      );
    } else {
      // Insert a new progress record
      await pool.query(
        `INSERT INTO user_step_progress (user_id, roadmap_step_id, completed, date_completed)
         VALUES ($1, $2, true, NOW())`,
        [userId, roadmapStepId]
      );
    }
    res.json({ message: 'Step marked as complete.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating progress.' });
  }
};
