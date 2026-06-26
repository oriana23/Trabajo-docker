const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
  host:     process.env.DB_HOST     || 'db',
  database: process.env.DB_NAME     || 'internrace',
  user:     process.env.DB_USER     || 'intern',
  password: process.env.DB_PASSWORD || 'docker123',
  port:     5432,
});

async function init(retries = 10, delay = 2000) {
  for (let i = 1; i <= retries; i++) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS scores (
          id         SERIAL PRIMARY KEY,
          player     VARCHAR(50)  NOT NULL,
          score      INTEGER      NOT NULL,
          correct    INTEGER      NOT NULL,
          lives_left INTEGER      NOT NULL,
          created_at TIMESTAMP    DEFAULT NOW()
        )
      `);
      console.log('Table ready');
      return;
    } catch (err) {
      console.log(`DB not ready, retrying in ${delay / 1000}s... (${i}/${retries})`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error('Could not connect to database after multiple retries');
}

app.post('/scores', async (req, res) => {
  try {
    const { player, score, correct, lives } = req.body;
    const result = await pool.query(
      'INSERT INTO scores (player, score, correct, lives_left) VALUES ($1, $2, $3, $4) RETURNING *',
      [player, score, correct, lives]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /scores error:', err.message);
    res.status(500).json({ error: 'Could not save score' });
  }
});

app.get('/scores', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT player, score FROM scores ORDER BY score DESC LIMIT 3'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('GET /scores error:', err.message);
    res.status(500).json({ error: 'Could not fetch scores' });
  }
});

init().then(() => {
  app.listen(3000, () => console.log('API listening on port 3000'));
});
