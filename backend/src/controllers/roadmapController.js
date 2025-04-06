const pool = require("../config/db");
const { callAIForRoadmap } = require("../helpers/aiHelper");

// POST /roadmaps
exports.createRoadmap = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { class_id, end_date, selectedTopicIds } = req.body;

    // We'll assume start_date is "today":
    const start_date = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

    if (
      !class_id ||
      !end_date ||
      !selectedTopicIds ||
      selectedTopicIds.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Missing class_id, end_date, or selectedTopicIds." });
    }

    // 1) Ensure the class exists & belongs to the user
    const classCheck = await pool.query(
      "SELECT id, class_name FROM classes WHERE id = $1 AND user_id = $2",
      [class_id, userId]
    );
    if (classCheck.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Class not found or not owned by user" });
    }
    const className = classCheck.rows[0].class_name;

    // 2) Fetch the topic titles for the selected IDs
    const topicRows = await pool.query(
      "SELECT id, title FROM topics WHERE class_id = $1 AND id = ANY($2::int[])",
      [class_id, selectedTopicIds]
    );
    const topics = topicRows.rows;
    if (topics.length === 0) {
      return res
        .status(400)
        .json({ error: "No valid topics found for those IDs." });
    }

    // 3) Insert a new row in 'roadmaps'
    const insertRoadmap = await pool.query(
      `INSERT INTO roadmaps (class_id, start_date, end_date)
       VALUES ($1, $2, $3)
       RETURNING id, class_id, start_date, end_date, created_at, updated_at`,
      [class_id, start_date, end_date]
    );
    const newRoadmap = insertRoadmap.rows[0];

    // 4) Build the AI prompt (NO extra_files_text).
    const userPrompt = `
      You are an assistant helping a student prepare a study plan.
      They have from ${start_date} until ${end_date} to learn these topics:

      ${topics.map((t) => `- ${t.title}`).join("\n")}

      Generate a detailed plan that includes an ordered list of steps. This plan must be the most efficient way for the student to complete learning all their course content within the time frame that they have. Be precise with the study plan and go into detail. If the student has more time, then include shorter but more frequent steps. If the student does not have a lot of time, then include longer steps.
    
      For each step, provide:
      - "step_name" (short name of the step)
      - "topic_title" (which single topic or "mixed" if combining multiple)
      - "bullet_points": these will be actionable steps the student can take to complete that step as a whole.
      - "eta": this will be the estimated time it will take for the student to complete that step.
      - "due_date": in YYYY-MM-DD format (spread them from start_date to end_date)
      - "resource": a URL or short reference for learning (e.g. a tutorial link, doc, or article) (DON'T USE WIKIPEDIA FOR THIS and make sure they actually lead somewhere.)
      
      Output ONLY valid JSON. Example:

      [
        {
          "step_order": 1,
          "step_name": "Introduction to X",
          "topic_title": "Finite Automata",
          "bullet_points": ["Review definitions", "Work through examples"],
          "eta": "2 hours",
          "due_date": "2025-05-01",
          "resource": "https://www.w3schools.com/some-tutorial"
        },
        ...
      ]
    `;

    // 5) Call GPT to get JSON
    const aiResponse = await callAIForRoadmap(userPrompt);

    // 6) Parse the JSON
    let steps;
    try {
      steps = JSON.parse(aiResponse);
      if (!Array.isArray(steps)) {
        throw new Error("GPT didn't return an array");
      }
    } catch (err) {
      console.error("Failed to parse AI JSON:", aiResponse);
      return res.status(400).json({
        error:
          "GPT returned invalid JSON. Please try again or revise the prompt.",
      });
    }

    // 7) Insert each step into 'roadmap_steps'
    const topicTitleToId = new Map(
      topics.map((t) => [t.title.toLowerCase(), t.id])
    );

    for (const stepObj of steps) {
      const {
        step_order,
        step_name,
        bullet_points,
        eta,
        topic_title,
        due_date,
        resource,
      } = stepObj;

      let matchedTopicId = null;
      if (topic_title) {
        const t = topicTitleToId.get(topic_title.toLowerCase());
        if (t) matchedTopicId = t;
      }

      // Ensure bullet_points is stored as a JSON string
      const bulletPointsStr = bullet_points
        ? JSON.stringify(bullet_points)
        : null;

      await pool.query(
        `INSERT INTO roadmap_steps
          (roadmap_id, topic_id, step_name, step_order, due_date, resource, eta, bullet_points)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          newRoadmap.id,
          matchedTopicId,
          step_name,
          step_order || 1,
          due_date || null,
          resource || null,
          eta || null,
          bulletPointsStr,
        ]
      );
    }

    // 8) Return the newly created roadmap with steps
    //    Make sure to parse the bullet_points back to array
    const stepsResult = await pool.query(
      "SELECT * FROM roadmap_steps WHERE roadmap_id = $1 ORDER BY step_order",
      [newRoadmap.id]
    );

    // Convert bullet_points from string to array
    const stepsWithParsedBulletPoints = stepsResult.rows.map((step) => ({
      ...step,
      bullet_points: step.bullet_points ? JSON.parse(step.bullet_points) : [],
    }));

    return res.status(201).json({
      message: "Roadmap created successfully!",
      roadmap: newRoadmap,
      steps: stepsWithParsedBulletPoints,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error." });
  }
};

// GET /roadmaps/:classId
exports.getRoadmapByClass = async (req, res) => {
  try {
    const classId = req.params.classId;
    const userId = req.user.userId;

    // Check if there's a row in 'roadmaps' for this class + user
    const roadmapResult = await pool.query(
      `SELECT id FROM roadmaps 
       WHERE class_id = $1
         AND EXISTS (
           SELECT 1 FROM classes 
            WHERE id = $1 AND user_id = $2
         )
       LIMIT 1`,
      [classId, userId]
    );

    if (roadmapResult.rows.length === 0) {
      return res.status(404).json({ error: "No roadmap found" });
    }

    const roadmapId = roadmapResult.rows[0].id;

    // Fetch steps
    const stepsResult = await pool.query(
      `SELECT *
       FROM roadmap_steps
       WHERE roadmap_id = $1
       ORDER BY step_order ASC`,
      [roadmapId]
    );

    // Parse bullet_points from stored JSON to array
    const stepsWithParsedBulletPoints = stepsResult.rows.map((step) => ({
      ...step,
      bullet_points: step.bullet_points ? JSON.parse(step.bullet_points) : [],
    }));

    return res.json({ steps: stepsWithParsedBulletPoints });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
};
