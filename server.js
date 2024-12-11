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

// Initialize storage
async function initializeStorage() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, '[]');
    }
  } catch (error) {
    console.error('Storage initialization error:', error);
    throw error;
  }
}

// Get events
app.get('/api/events', async (req, res) => {
  try {
    await initializeStorage();
    const data = await fs.readFile(DATA_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save event
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
    res.status(500).json({ error: error.message });
  }
});

// Save attendance
app.post('/api/events/:eventId/attendances', async (req, res) => {
  try {
    const { eventId } = req.params;
    const attendance = req.body;
    
    await fs.mkdir(DATA_DIR, { recursive: true });
    const attendancesFile = path.join(DATA_DIR, `attendances_${eventId}.json`);
    
    let attendances = [];
    try {
      const data = await fs.readFile(attendancesFile, 'utf8');
      attendances = JSON.parse(data);
    } catch {
      // File doesn't exist yet, that's OK
    }
    
    attendances.push(attendance);
    await fs.writeFile(attendancesFile, JSON.stringify(attendances, null, 2));
    res.status(201).json(attendance);
  } catch (error) {
    console.error('Save attendance error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get attendances
app.get('/api/events/:eventId/attendances', async (req, res) => {
  try {
    const { eventId } = req.params;
    const attendancesFile = path.join(DATA_DIR, `attendances_${eventId}.json`);
    
    try {
      const data = await fs.readFile(attendancesFile, 'utf8');
      res.json(JSON.parse(data));
    } catch {
      res.json([]); // Return empty array if file doesn't exist
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});