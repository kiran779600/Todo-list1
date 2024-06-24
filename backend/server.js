const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Pass@123',
  database: 'todo_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

const createTodosTable = `
  CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text VARCHAR(255) NOT NULL,
    isCompleted BOOLEAN DEFAULT false
  )
`;

db.query(createTodosTable, (err, result) => {
  if (err) throw err;
  console.log('Todos table created or already exists');
});

app.get('/api/todos', (req, res) => {
  db.query('SELECT * FROM todos', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  db.query('INSERT INTO todos (text) VALUES (?)', [text], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, text, isCompleted: false });
  });
});

app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { text, isCompleted } = req.body;
  db.query('UPDATE todos SET text = ?, isCompleted = ? WHERE id = ?', [text, isCompleted, id], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM todos WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
