
const express = require('express');
const cors = require('cors');
const Client = require('@replit/database');

const app = express();
const db = new Client();

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// データベース接続確認
const checkDatabaseConnection = async () => {
  try {
    await db.list();
    console.log('Database connected successfully');
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
};

app.get('/api/events', async (req, res) => {
  try {
    const events = await db.get('events') || [];
    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
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
    res.status(500).json({ error: 'Failed to save event' });
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
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

const port = 3000;

// サーバー起動前にデータベース接続を確認
checkDatabaseConnection().then((isConnected) => {
  if (isConnected) {
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port}`);
    });
  } else {
    console.error('Failed to start server due to database connection error');
  }
});
