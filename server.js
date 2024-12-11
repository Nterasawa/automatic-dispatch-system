
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
    console.log('Received event creation request:', req.body);
    
    if (!req.body.title || !req.body.date) {
      console.log('Validation failed: missing title or date');
      return res.status(400).json({ error: 'Title and date are required' });
    }
    
    const event = {
      ...req.body,
      id: crypto.randomUUID(),
      attendees: 0,
      cars: 0
    };
    
    console.log('Creating new event:', event);
    events.push(event);
    
    console.log('Event created successfully');
    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ 
      error: 'Failed to create event',
      details: error.message 
    });
  }
});

// サーバーの起動確認用エンドポイント
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
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
