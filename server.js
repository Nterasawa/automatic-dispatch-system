
const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(cors());
app.use(express.json());

const DB_FILE = path.join(__dirname, 'db.json');

// データベースの初期化
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ events: [], attendances: [], carArrangements: [] }));
}

// データベースの読み書き関数
const readDB = () => {
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
};

const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// イベント関連のエンドポイント
app.get('/api/events', (req, res) => {
  const db = readDB();
  res.json(db.events);
});

app.post('/api/events', (req, res) => {
  const db = readDB();
  const newEvent = req.body;
  db.events.push(newEvent);
  writeDB(db);
  res.status(201).json(newEvent);
});

const port = 3001;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
