
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const dataFile = path.join(__dirname, 'data', 'events.json');

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// データファイルの存在確認・作成
const initializeDataFile = async () => {
  try {
    await fs.access(dataFile);
  } catch {
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    await fs.writeFile(dataFile, JSON.stringify([]));
  }
};

app.get('/api/events', async (req, res) => {
  try {
    const data = await fs.readFile(dataFile, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const data = await fs.readFile(dataFile, 'utf8');
    const events = JSON.parse(data);
    const event = req.body;
    events.push(event);
    await fs.writeFile(dataFile, JSON.stringify(events, null, 2));
    res.json(event);
  } catch (error) {
    console.error('Save event error:', error);
    res.status(500).json({ error: 'Failed to save event' });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    const data = await fs.readFile(dataFile, 'utf8');
    const events = JSON.parse(data);
    const filteredEvents = events.filter(event => event.id !== req.params.id);
    await fs.writeFile(dataFile, JSON.stringify(filteredEvents, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

const port = 3000;

// サーバー起動前にデータファイルを初期化
initializeDataFile().then(() => {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
}).catch(error => {
  console.error('Failed to initialize data file:', error);
});
