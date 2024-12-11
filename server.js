
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'events.json');

async function initializeStorage() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, '[]');
    }
    return true;
  } catch (error) {
    console.error('Storage initialization error:', error);
    throw error;
  }
}

app.post('/api/initialize', async (req, res) => {
  try {
    await initializeStorage();
    res.json({ success: true });
  } catch (error) {
    console.error('Initialization error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    await initializeStorage();
    const data = await fs.readFile(DATA_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const event = req.body;
    await initializeStorage();
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const events = JSON.parse(data);
    events.push(event);
    await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2));
    res.status(201).json(event);
  } catch (error) {
    console.error('Save event error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
