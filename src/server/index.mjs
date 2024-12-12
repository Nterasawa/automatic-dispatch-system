import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// デバッグログの追加
app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.path);
  console.log('Request headers:', req.headers);
  next();
});

// CORSの設定を更新
// CORSの設定を更新（既存のapp.use(cors())を置き換え）
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://4ad1bf97-f58e-439b-932f-6f3b99e7c156-00-35u4n9m8mzz4h.sisko.replit.dev',
    /\.replit\.dev$/  // すべてのreplit.devサブドメインを許可
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));


app.use(express.json());

const port = 3001;

// テスト用エンドポイント
app.get('/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'Test successful' });
});

// Claude APIエンドポイント
app.post('/api/claude', async (req, res) => {
  console.log('Claude API endpoint hit');
  console.log('Request body:', req.body);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_CLAUDE_API_KEY}`,
        'anthropic-version': '2024-02-29'
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        max_tokens: 2000,
        messages: req.body.messages
      })
    });

    console.log('Claude API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Claude API Error:', errorData);
      return res.status(response.status).json({ error: errorData });
    }

    const data = await response.json();
    console.log('Successfully received response from Claude API');
    res.json(data);
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log('Environment check:', {
    hasApiKey: !!process.env.VITE_CLAUDE_API_KEY,
    nodeEnv: process.env.NODE_ENV
  });
});