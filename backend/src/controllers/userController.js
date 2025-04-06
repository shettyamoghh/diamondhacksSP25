const pool = require('../config/db');

async function getOrCreateUser(auth0Sub, email, name) {
  // Check if the user exists
  const result = await pool.query(
    'SELECT id, auth0_sub, email, name FROM users WHERE auth0_sub = $1',
    [auth0Sub]
  );
  if (result.rows.length > 0) {
    return result.rows[0];
  }
  // If not, insert a new record
  const insert = await pool.query(
    `INSERT INTO users (auth0_sub, email, name)
     VALUES ($1, $2, $3)
     RETURNING id, auth0_sub, email, name`,
    [auth0Sub, email, name]
  );
  return insert.rows[0];
}

exports.getProfile = async (req, res) => {
    if (!req.oidc || !req.oidc.user) {
      return res.status(401).send('Not authorized');
    }
    const { sub, email, name } = req.oidc.user;
    try {
      const userRecord = await getOrCreateUser(sub, email, name);
      res.json(userRecord);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  };
  