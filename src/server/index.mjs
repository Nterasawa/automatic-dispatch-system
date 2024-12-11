
import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const DATA_DIR = path.join(__dirname, '../../data');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.static('dist'));

const initDataDir = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(EVENTS_FILE);
    } catch {
      await fs.writeFile(EVENTS_FILE, '[]', 'utf8');
    }
    return true;
  } catch (error) {
    console.error('Init data dir error:', error);
    return false;
  }
};

app.get('/api/health', async (req, res) => {
  try {
    const initialized = await initDataDir();
    if (!initialized) {
      throw new Error('Failed to initialize data directory');
    }
    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const data = await fs.readFile(EVENTS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const data = await fs.readFile(EVENTS_FILE, 'utf8');
    const events = JSON.parse(data);
    const newEvent = req.body;
    events.push(newEvent);
    await fs.writeFile(EVENTS_FILE, JSON.stringify(events, null, 2), 'utf8');
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: error.message });
  }
});

await initDataDir();

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
