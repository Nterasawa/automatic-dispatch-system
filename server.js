
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'events.json');

app.use(cors());
app.use(express.json());

// データディレクトリとファイルの初期化
async function initializeStorage() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, '[]', 'utf8');
    }
    return true;
  } catch (error) {
    console.error('Storage initialization failed:', error);
    return false;
  }
}

app.post('/api/initialize', async (req, res) => {
  try {
    await initializeStorage();
    res.json({ success: true });
  } catch (error) {
    console.error('Initialization error:', error);
    res.status(500).json({ error: 'データベースの初期化に失敗しました' });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'イベントの取得に失敗しました' });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const event = req.body;
    if (!event || !event.title || !event.date) {
      return res.status(400).json({ error: 'イベントデータが不正です' });
    }

    const data = await fs.readFile(DATA_FILE, 'utf8');
    const events = JSON.parse(data);
    events.push(event);
    await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2), 'utf8');
    res.status(201).json(event);
  } catch (error) {
    console.error('Save event error:', error);
    res.status(500).json({ error: 'イベントの保存に失敗しました' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  initializeStorage();
});
