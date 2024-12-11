
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const app = express();
const port = 3000;

let events = [];

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(events || []);
});

app.post('/api/events', (req, res) => {
  try {
    if (!req.body.title || !req.body.date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }
    
    const event = {
      ...req.body,
      id: crypto.randomUUID(),
      attendees: 0,
      cars: 0
    };
    events.push(event);
    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

app.delete('/api/events/:id', (req, res) => {
  try {
    const { id } = req.params;
    events = events.filter(event => event.id !== id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
