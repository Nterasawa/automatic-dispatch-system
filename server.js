
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const port = 3000;

// インメモリデータストア
let events = [];

// ミドルウェアの設定
app.use(express.json());
app.use(cors({
  origin: true,
  credentials: true
}));

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// ヘルスチェックエンドポイント
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// イベント一覧取得
app.get('/api/events', (req, res) => {
  try {
    console.log('Sending events:', events);
    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Failed to get events' });
  }
});

// イベント作成
app.post('/api/events', (req, res) => {
  try {
    console.log('Received event data:', req.body);
    
    if (!req.body.title || !req.body.date) {
      return res.status(400).json({ 
        error: 'Validation failed',
        message: 'Title and date are required'
      });
    }

    const event = {
      id: crypto.randomUUID(),
      title: req.body.title,
      date: req.body.date,
      attendees: 0,
      cars: 0
    };

    events.push(event);
    console.log('Event created:', event);
    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ 
      error: 'Failed to create event',
      message: error.message 
    });
  }
});

// イベント削除
app.delete('/api/events/:id', (req, res) => {
  try {
    const { id } = req.params;
    const initialLength = events.length;
    events = events.filter(event => event.id !== id);
    
    if (events.length === initialLength) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

// サーバー起動
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
  console.log('Server initialized with empty events array');
});
