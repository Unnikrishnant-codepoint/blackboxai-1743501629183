const express = require('express');
const router = express.Router();
const db = require('../database');

// Generate financial report
router.post('/', (req, res) => {
  const { startDate, endDate } = req.body;
  
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Both start and end dates are required' });
  }

  // Get expense summary
  db.all(
    `SELECT eh.name, SUM(e.amount) as total
     FROM expenses e
     JOIN expense_heads eh ON e.head_id = eh.id
     WHERE e.date BETWEEN ? AND ?
     GROUP BY eh.name`,
    [startDate, endDate],
    (err, expenseSummary) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Get income summary
      db.all(
        `SELECT ih.name, SUM(i.amount) as total
         FROM incomes i
         JOIN income_heads ih ON i.head_id = ih.id
         WHERE i.date BETWEEN ? AND ?
         GROUP BY ih.name`,
        [startDate, endDate],
        (err, incomeSummary) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          // Calculate totals
          const expenseTotal = expenseSummary.reduce((sum, item) => sum + item.total, 0);
          const incomeTotal = incomeSummary.reduce((sum, item) => sum + item.total, 0);
          const balance = incomeTotal - expenseTotal;

          res.json({
            dateRange: { startDate, endDate },
            expenseSummary,
            incomeSummary,
            totals: {
              expenseTotal,
              incomeTotal,
              balance
            }
          });
        }
      );
    }
  );
});

module.exports = router;