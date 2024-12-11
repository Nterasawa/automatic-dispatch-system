// src/config/claude.ts
export const CLAUDE_CONFIG = {
  model: 'claude-3-opus-20240229',  // 使用するモデル
  baseUrl: process.env.CLAUDE_API_URL || 'https://api.anthropic.com/v1',
  apiKey: process.env.CLAUDE_API_KEY,
  maxTokens: 4096
};