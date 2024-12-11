
const express = require('express');
const cors = require('cors');
const Client = require('@replit/database');

const app = express();
const db = new Client();

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// データベース初期化
const initializeDatabase = async () => {
  try {
    const initialized = await db.get('initialized');
    if (!initialized) {
      await db.set('initialized', true);
      await db.set('events', []);
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

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
    const event = req.body;
    events.push(event);
    await db.set('events', events);
    res.json(event);
  } catch (error) {
    console.error('Save event error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    const events = await db.get('events') || [];
    const filteredEvents = events.filter(event => event.id !== req.params.id);
    await db.set('events', filteredEvents);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: error.message });
  }
});

const port = 3000;
initializeDatabase().then(() => {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
});
