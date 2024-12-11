
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

let events = [];
let attendances = {};

app.get('/api/events', (req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const event = req.body;
  events.push(event);
  res.json(event);
});

app.delete('/api/events/:id', (req, res) => {
  const { id } = req.params;
  events = events.filter(event => event.id !== id);
  res.json({ success: true });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
