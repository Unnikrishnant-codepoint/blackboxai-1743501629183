const express = require('express');
const router = express.Router();
const db = require('../database');

// Create expense head
router.post('/heads', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  db.run(
    'INSERT INTO expense_heads (name) VALUES (?)',
    [name],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ id: this.lastID, name });
    }
  );
});

// Get all expense heads
router.get('/heads', (req, res) => {
  db.all('SELECT * FROM expense_heads', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Add expense entry
router.post('/entries', (req, res) => {
  const { head_id, amount, date, description } = req.body;
  if (!head_id || !amount || !date) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  db.run(
    'INSERT INTO expenses (head_id, amount, date, description) VALUES (?, ?, ?, ?)',
    [head_id, amount, date, description],
    function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      res.json({ 
        id: this.lastID,
        head_id,
        amount,
        date,
        description
      });
    }
  );
});

// Get all expense entries
router.get('/entries', (req, res) => {
  db.all(
    `SELECT e.*, eh.name as head_name 
     FROM expenses e
     JOIN expense_heads eh ON e.head_id = eh.id`,
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