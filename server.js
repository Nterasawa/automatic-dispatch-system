
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const dataFile = path.join(process.env.DATA_DIR || '/tmp/eagles-data', 'events.json');

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

const initializeDataFile = async () => {
  try {
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    try {
      await fs.access(dataFile);
    } catch {
      await fs.writeFile(dataFile, '[]', 'utf8');
    }
    return true;
  } catch (error) {
    console.error('Storage initialization failed:', error);
    return false;
  }
};

app.get('/api/health', async (req, res) => {
  try {
    await fs.access(dataFile);
    res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ error: 'Storage not accessible' });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const data = await fs.readFile(dataFile, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const data = await fs.readFile(dataFile, 'utf8');
    const events = JSON.parse(data);
    const event = req.body;
    events.push(event);
    await fs.writeFile(dataFile, JSON.stringify(events, null, 2));
    res.json(event);
  } catch (error) {
    console.error('Save event error:', error);
    res.status(500).json({ error: 'Failed to save event' });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    const data = await fs.readFile(dataFile, 'utf8');
    const events = JSON.parse(data);
    const filteredEvents = events.filter(event => event.id !== req.params.id);
    await fs.writeFile(dataFile, JSON.stringify(filteredEvents, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

const port = 3000;

initializeDataFile().then((success) => {
  if (success) {
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port}`);
    });
  } else {
    console.error('Failed to initialize data storage');
    process.exit(1);
  }
});
