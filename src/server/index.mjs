
import express from 'express';
import cors from 'cors';
import Database from '@replit/database';

const app = express();
const db = new Database();

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// ヘルスチェックエンドポイント
app.get('/api/health', async (req, res) => {
  try {
    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// イベント関連のエンドポイント
app.get('/api/events', async (req, res) => {
  try {
    const events = await db.get('events') || [];
    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const events = await db.get('events') || [];
    events.push(req.body);
    await db.set('events', events);
    res.json(req.body);
  } catch (error) {
    console.error('Save event error:', error);
    res.status(500).json({ error: error.message });
  }
});

const port = 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
