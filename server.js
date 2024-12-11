
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const app = express();
const port = 3000;

let events = [];

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

app.get('/api/events', (req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  try {
    const event = {
      ...req.body,
      id: crypto.randomUUID()
    };
    events.push(event);
    res.status(201).json(event);
  } catch (error) {
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
