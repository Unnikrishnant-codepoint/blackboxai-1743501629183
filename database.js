const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./finance.db');

// Initialize database tables
db.serialize(() => {
  // Create expense heads table
  db.run(`CREATE TABLE IF NOT EXISTS expense_heads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  )`);

  // Create income heads table
  db.run(`CREATE TABLE IF NOT EXISTS income_heads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    amount REAL
  )`);

  // Create expenses table
  db.run(`CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    head_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    date TEXT NOT NULL,
    description TEXT,
    FOREIGN KEY(head_id) REFERENCES expense_heads(id)
  )`);

  // Create incomes table
  db.run(`CREATE TABLE IF NOT EXISTS incomes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    head_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    star TEXT,
    description TEXT,
    date TEXT NOT NULL,
    FOREIGN KEY(head_id) REFERENCES income_heads(id)
  )`);
});

module.exports = db;