
import axios, { AxiosError } from 'axios';
import { Event } from '../types/event';

const BASE_URL = window.location.hostname.includes('repl.co')
  ? `https://${window.location.hostname}`
  : 'http://0.0.0.0:3000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// エラーハンドリングのための型
type ApiError = {
  message: string;
  code?: string;
};

// レスポンスインターセプター
api.interceptors.response.use(
  response => response,
  (error: AxiosError<ApiError>) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
);

export class DatabaseService {
  static async initializeDatabase(): Promise<boolean> {
    try {
      const response = await api.get('/api/health');
      return response.data.status === 'ok';
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw new Error('データベースの初期化に失敗しました');
    }
  }

  static async getEvents(): Promise<Event[]> {
    try {
      const response = await api.get('/api/events');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch events:', error);
      throw new Error('イベントの取得に失敗しました');
    }
  }

  static async saveEvent(event: Event): Promise<Event> {
    try {
      const response = await api.post('/api/events', event);
      return response.data;
    } catch (error) {
      console.error('Failed to save event:', error);
      throw new Error('イベントの保存に失敗しました');
    }
  }
}
