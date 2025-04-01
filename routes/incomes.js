const express = require('express');
const router = express.Router();
const db = require('../database');

// Create income head
router.post('/heads', (req, res) => {
  const { name, amount } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  db.run(
    'INSERT INTO income_heads (name, amount) VALUES (?, ?)',
    [name, amount || null],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ id: this.lastID, name, amount });
    }
  );
});

// Get all income heads
router.get('/heads', (req, res) => {
  db.all('SELECT * FROM income_heads', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Add income entry
router.post('/entries', (req, res) => {
  const { head_id, name, amount, star, description, date } = req.body;
  if (!head_id || !name || !amount || !date) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  db.run(
    `INSERT INTO incomes 
     (head_id, name, amount, star, description, date) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [head_id, name, amount, star, description, date],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ 
        id: this.lastID,
        head_id,
        name,
        amount,
        star,
        description,
        date
      });
    }
  );
});

// Get all income entries
router.get('/entries', (req, res) => {
  db.all(
    `SELECT i.*, ih.name as head_name 
     FROM incomes i
     JOIN income_heads ih ON i.head_id = ih.id`,
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

module.exports = router;