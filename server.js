
const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const cors = require('cors');

const app = express();
const DATA_DIR = './data';
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

const initDataDir = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(EVENTS_FILE);
    } catch {
      await fs.writeFile(EVENTS_FILE, '[]');
    }
  } catch (error) {
    console.error('Init data dir error:', error);
  }
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
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
    await fs.writeFile(EVENTS_FILE, JSON.stringify(events, null, 2));
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    const data = await fs.readFile(EVENTS_FILE, 'utf8');
    const events = JSON.parse(data);
    const filteredEvents = events.filter(event => event.id !== req.params.id);
    await fs.writeFile(EVENTS_FILE, JSON.stringify(filteredEvents, null, 2));
    res.status(200).json({ message: 'Event deleted' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

initDataDir().then(() => {
  app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on port 3000');
  });
});
