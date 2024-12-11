
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
