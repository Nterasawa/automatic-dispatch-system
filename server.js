
const express = require('express');
const cors = require('cors');
const Database = require('@replit/database');
const path = require('path');

const app = express();
const db = new Database();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

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
    const newEvent = req.body;
    events.push(newEvent);
    await db.set('events', events);
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
