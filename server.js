
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const dataFile = path.join(__dirname, 'data', 'events.json');

app.use(cors());
app.use(express.json());

// データディレクトリとファイルの初期化
const initializeDataFile = async () => {
  try {
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    try {
      await fs.access(dataFile);
    } catch {
      await fs.writeFile(dataFile, '[]', 'utf8');
    }
    return true;
  } catch (error) {
    console.error('Storage initialization failed:', error);
    return false;
  }
};

app.get('/api/health', async (req, res) => {
  res.json({ status: 'ok' });
});

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

initializeDataFile().then((success) => {
  if (success) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  } else {
    console.error('Failed to initialize data storage');
    process.exit(1);
  }
});
