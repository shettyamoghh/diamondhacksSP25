const pool = require('../config/db');
const pdfParse = require('pdf-parse');
const { callAItoGenerateTopics } = require('./aiController');

/**
 * POST /classes
 * 
 * Expects multipart/form-data with:
 *   - field name: syllabusFile (the actual PDF)
 *   - fields: class_name, professor, session, semester, description (optional)
 * 
 * We parse the PDF, store its text into classes.syllabus, 
 * then call AI to generate topics, storing them in `topics`.
 */
exports.addClass = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      class_name,
      professor,
      session,
      semester,
      description
    } = req.body;

    // Ensure a PDF is uploaded
    if (!req.file) {
      return res.status(400).json({
        error: 'No syllabus file uploaded.'
      });
    }

    // Basic validation
    if (!class_name || !professor || !session || !semester) {
      return res.status(400).json({
        error: 'class_name, professor, session, and semester are required.'
      });
    }

    // 1) Parse PDF to get text
    const pdfData = await pdfParse(req.file.buffer);
    const syllabusText = pdfData.text; // The extracted plain text

    // 2) Ask AI to generate topic lines from the syllabus text
    const aiResponse = await callAItoGenerateTopics(syllabusText);
    const rawTopics = aiResponse
      .split(/\n+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // 3) Insert the new class into `classes`
    const insertQuery = `
      INSERT INTO classes (
        user_id,
        class_name,
        description,
        syllabus,
        professor,
        session,
        semester
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        id,
        user_id,
        class_name,
        description,
        syllabus,
        professor,
        session,
        semester,
        created_at,
        updated_at
    `;
    const values = [
      userId,
      class_name,
      description || null,
      syllabusText,
      professor,
      session,
      semester
    ];
    const result = await pool.query(insertQuery, values);
    const newClass = result.rows[0];

    // 4) Insert each generated topic into `topics`
    for (const topicLine of rawTopics) {
      await pool.query(
        `
          INSERT INTO topics (class_id, title, description)
          VALUES ($1, $2, $3)
        `,
        [newClass.id, topicLine, '']
      );
    }

    // 5) Respond
    return res.status(201).json({
      message: 'Class created successfully',
      class: newClass,
      topicsAdded: rawTopics.length
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error.' });
  }
};

/**
 * GET /classes
 * 
 * Returns all classes for the authenticated user.
 */
exports.getUserClasses = async (req, res) => {
  try {
    const userId = req.user.userId;
    const query = `
      SELECT
        id,
        class_name,
        description,
        syllabus,
        professor,
        session,
        semester,
        created_at,
        updated_at
      FROM classes
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error.' });
  }
};

/**
 * GET /classes/:id/details
 * 
 * Returns full details for a single class, including:
 *   - class info
 *   - topics for that class
 *   - existing roadmap (if any)
 *   - learning resources for all topics belonging to that class
 */
exports.getClassDetails = async (req, res) => {
  try {
    const classId = req.params.id;
    const userId = req.user.userId;

    // 1) Fetch the class
    const classResult = await pool.query(
      `
        SELECT
          id,
          user_id,
          class_name,
          description,
          syllabus,
          professor,
          session,
          semester,
          created_at,
          updated_at
        FROM classes
        WHERE id = $1
          AND user_id = $2
      `,
      [classId, userId]
    );
    if (classResult.rows.length === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }
    const theClass = classResult.rows[0];

    // 2) Fetch topics for that class
    const topicsResult = await pool.query(
      `
        SELECT
          id,
          title,
          description
        FROM topics
        WHERE class_id = $1
        ORDER BY id ASC
      `,
      [classId]
    );
    const topics = topicsResult.rows;

    // 3) Check for an existing roadmap
    //    Because `roadmaps` doesn't have user_id, we ensure the class belongs to user.
    //    We'll join roadmaps + classes to confirm class's user_id = current user
    const roadmapQuery = `
      SELECT
        r.id,
        r.class_id,
        r.start_date,
        r.end_date,
        r.created_at,
        r.updated_at
      FROM roadmaps r
      JOIN classes c ON r.class_id = c.id
      WHERE r.class_id = $1
        AND c.user_id = $2
      LIMIT 1
    `;
    const roadmapResult = await pool.query(roadmapQuery, [classId, userId]);
    const roadmap = roadmapResult.rows.length ? roadmapResult.rows[0] : null;

    // 4) Fetch all learning_resources for these topics
    //    Because learning_resources references topic_id
    //    We'll get everything that belongs to the topics of this class
    const resourcesQuery = `
      SELECT
        lr.id,
        lr.topic_id,
        lr.resource_name,
        lr.resource_link,
        lr.resource_description,
        lr.created_at,
        lr.updated_at
      FROM learning_resources lr
      JOIN topics t ON t.id = lr.topic_id
      WHERE t.class_id = $1
      ORDER BY lr.created_at DESC
    `;
    const resourcesResult = await pool.query(resourcesQuery, [classId]);
    const resources = resourcesResult.rows;

    // 5) Return combined data
    return res.json({
      ...theClass,
      topics,
      roadmap,
      resources
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error.' });
  }
};

/**
 * GET /classes/:id/topics
 * 
 * Returns only the topic records for a single class, verifying user ownership of the class.
 */
exports.getClassTopics = async (req, res) => {
  try {
    const classId = req.params.id;
    const userId = req.user.userId;

    // Ensure user owns the class
    const classCheck = await pool.query(
      'SELECT id FROM classes WHERE id = $1 AND user_id = $2',
      [classId, userId]
    );
    if (classCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Class not found or not owned by user' });
    }

    // Fetch topics
    const topicsResult = await pool.query(
      `
        SELECT
          id,
          title
        FROM topics
        WHERE class_id = $1
        ORDER BY id ASC
      `,
      [classId]
    );

    return res.json(topicsResult.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error.' });
  }
};
