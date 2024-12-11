
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

let events = [];

app.use(cors());
app.use(express.json());

app.get('/api/events', (req, res) => {
  res.json(events);
});

app.post('/api/events', (req, res) => {
  const event = req.body;
  events.push(event);
  res.json(event);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
