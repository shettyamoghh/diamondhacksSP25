const pool = require('../config/db');
const jwt = require('jsonwebtoken');

// POST /register
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const checkUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    if (checkUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const insertUser = await pool.query(`
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email
    `, [name, email, password]);
    const newUser = insertUser.rows[0];

    return res.status(201).json({
      message: 'User registered successfully',
      user: newUser
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error.' });
  }
};

// POST /login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const userQuery = await pool.query(`
      SELECT id, name, email, password
      FROM users
      WHERE email = $1
    `, [email]);

    if (userQuery.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const user = userQuery.rows[0];

    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error.' });
  }
};
