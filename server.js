
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

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message || 'サーバーエラーが発生しました' });
});

app.use(cors());
app.use(express.json());

const initializeDataFile = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DATA_FILE);
      const data = await fs.readFile(DATA_FILE, 'utf8');
      JSON.parse(data); // 既存のファイルが正しいJSONかチェック
    } catch (error) {
      await fs.writeFile(DATA_FILE, '[]', 'utf8');
    }
    console.log('Data file initialized successfully');
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
    const events = JSON.parse(data);
    res.json(events);
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

    let events = [];
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8');
      events = JSON.parse(data);
    } catch (error) {
      console.error('Reading events file error:', error);
      events = [];
    }

    events.push(event);
    await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2), 'utf8');
    res.status(201).json(event);
  } catch (error) {
    console.error('Save event error:', error);
    res.status(500).json({ error: 'イベントの保存に失敗しました' });
  }
});

// 出欠情報の保存
app.post('/api/events/:eventId/attendances', async (req, res) => {
  try {
    const { eventId } = req.params;
    const attendanceData = req.body;
    const attendancePath = path.join(DATA_DIR, `attendance_${eventId}.json`);

    let attendances = [];
    try {
      const data = await fs.readFile(attendancePath, 'utf8');
      attendances = JSON.parse(data);
    } catch (error) {
      // ファイルが存在しない場合は新規作成
    }

    attendances.push(attendanceData);
    await fs.writeFile(attendancePath, JSON.stringify(attendances, null, 2));
    res.status(201).json(attendanceData);
  } catch (error) {
    console.error('Attendance save error:', error);
    res.status(500).json({ error: true, message: '出欠の保存に失敗しました' });
  }
});

// 出欠情報の取得
app.get('/api/events/:eventId/attendances', async (req, res) => {
  try {
    const { eventId } = req.params;
    const attendancePath = path.join(DATA_DIR, `attendance_${eventId}.json`);

    let attendances = [];
    try {
      const data = await fs.readFile(attendancePath, 'utf8');
      attendances = JSON.parse(data);
    } catch (error) {
      // ファイルが存在しない場合は空配列を返す
    }

    res.json(attendances);
  } catch (error) {
    res.status(500).json({ error: true, message: '出欠の取得に失敗しました' });
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
