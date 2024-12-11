
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

// イベント関連のエンドポイント
app.get('/api/events', async (req, res) => {
  try {
    const events = await db.get('events') || [];
    res.json(events);
  } catch (error) {
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
    res.status(500).json({ error: error.message });
  }
});

// 出席関連のエンドポイント
app.get('/api/attendance/:eventId', async (req, res) => {
  try {
    const attendances = await db.get(`attendance_${req.params.eventId}`) || [];
    res.json(attendances);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/attendance/:eventId', async (req, res) => {
  try {
    const attendances = await db.get(`attendance_${req.params.eventId}`) || [];
    attendances.push(req.body);
    await db.set(`attendance_${req.params.eventId}`, attendances);
    res.json(req.body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 配車関連のエンドポイント
app.get('/api/car-arrangement/:eventId', async (req, res) => {
  try {
    const arrangement = await db.get(`car_arrangement_${req.params.eventId}`);
    res.json(arrangement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/car-arrangement/:eventId', async (req, res) => {
  try {
    await db.set(`car_arrangement_${req.params.eventId}`, req.body);
    res.json(req.body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
