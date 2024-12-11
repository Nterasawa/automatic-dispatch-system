
import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const DATA_DIR = '/tmp/eagles-data';
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../../dist')));

const initializeStorage = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(EVENTS_FILE);
    } catch {
      await fs.writeFile(EVENTS_FILE, '[]', 'utf8');
    }
  } catch (error) {
    console.error('Storage initialization failed:', error);
    throw error;
  }
};

app.get('/api/health', async (req, res) => {
  try {
    await fs.access(DATA_DIR);
    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Storage access failed' });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const data = await fs.readFile(EVENTS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: true, message: 'Failed to read events' });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const events = JSON.parse(await fs.readFile(EVENTS_FILE, 'utf8'));
    const newEvent = req.body;
    events.push(newEvent);
    await fs.writeFile(EVENTS_FILE, JSON.stringify(events, null, 2));
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: true, message: 'Failed to create event' });
  }
});

const startServer = async () => {
  try {
    await initializeStorage();
    const port = process.env.PORT || 3001;
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Server failed to start:', error);
    process.exit(1);
  }
};

startServer();
