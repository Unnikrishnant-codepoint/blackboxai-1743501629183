const express = require('express');
const cors = require('cors');
const db = require('./database');
const expenseRoutes = require('./routes/expenses');
const incomeRoutes = require('./routes/incomes');
const reportRoutes = require('./routes/reports');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/reports', reportRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});