
const express = require('express');
const cors = require('cors');
const Client = require('@replit/database');

const app = express();
const db = new Client();

app.use(cors());
app.use(express.json());

app.get('/api/events', async (req, res) => {
  try {
    const keys = await db.list('event:');
    const events = await Promise.all(keys.map(key => db.get(key)));
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const event = req.body;
    await db.set(`event:${event.id}`, event);
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    await db.delete(`event:${req.params.id}`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
