
import express from 'express';
import cors from 'cors';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'events.json');

app.use(cors());
app.use(express.json());

const initializeDataFile = async () => {
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
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/events', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const events = JSON.parse(data);
    const event = req.body;
    events.push(event);
    await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2));
    res.json(event);
  } catch (error) {
    console.error('Save event error:', error);
    res.status(500).json({ error: 'Failed to save event' });
  }
});

// 出欠情報の保存
app.post('/api/events/:eventId/attendances', async (req, res) => {
  try {
    const { eventId } = req.params;
    const attendanceData = req.body;
    const attendancesPath = path.join(DATA_DIR, `${eventId}_attendances.json`);
    
    let attendances = [];
    try {
      const data = await fs.readFile(attendancesPath, 'utf8');
      attendances = JSON.parse(data);
    } catch (error) {
      // ファイルが存在しない場合は空の配列を使用
    }
    
    attendances.push(attendanceData);
    await fs.writeFile(attendancesPath, JSON.stringify(attendances, null, 2));
    res.json(attendanceData);
  } catch (error) {
    console.error('出欠保存エラー:', error);
    res.status(500).json({ error: '出欠の保存に失敗しました' });
  }
});

// 出欠情報の取得
app.get('/api/events/:eventId/attendances', async (req, res) => {
  try {
    const { eventId } = req.params;
    const attendancesPath = path.join(DATA_DIR, `${eventId}_attendances.json`);
    
    let attendances = [];
    try {
      const data = await fs.readFile(attendancesPath, 'utf8');
      attendances = JSON.parse(data);
    } catch (error) {
      // ファイルが存在しない場合は空の配列を返す
    }
    
    res.json(attendances);
  } catch (error) {
    console.error('出欠取得エラー:', error);
    res.status(500).json({ error: '出欠の取得に失敗しました' });
  }
});

initializeDataFile().then((success) => {
  if (success) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } else {
    console.error('Failed to initialize data storage');
    process.exit(1);
  }
});
