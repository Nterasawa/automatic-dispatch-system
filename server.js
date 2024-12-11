
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const app = express();
const port = 3000;

let events = [];

app.use(cors());
app.use(express.json());

app.get('/api/events', (req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const event = {
    ...req.body,
    id: crypto.randomUUID()
  };
  events.push(event);
  res.status(201).json(event);
});

app.delete('/api/events/:id', (req, res) => {
  const { id } = req.params;
  events = events.filter(event => event.id !== id);
  res.status(204).send();
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
