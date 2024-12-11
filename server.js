
import express from 'express';
import cors from 'cors';
import { Database } from '@replit/database';

const app = express();
const db = new Database();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

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

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
