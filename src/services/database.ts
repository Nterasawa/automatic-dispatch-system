
import axios from 'axios';
import { Event } from '../types/event';

const API_BASE_URL = '/api';

export class DatabaseService {
  static async initializeDatabase() {
    try {
      await axios.get(`${API_BASE_URL}/health`);
    } catch (error) {
      console.error('Database initialization error:', error);
      throw new Error('データベースの初期化に失敗しました');
    }
  }

  static async getEvents(): Promise<Event[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/events`);
      return response.data;
    } catch (error) {
      console.error('Get events error:', error);
      throw new Error('イベントの取得に失敗しました');
    }
  }

  static async saveEvent(event: Event): Promise<Event> {
    try {
      const response = await axios.post(`${API_BASE_URL}/events`, event);
      return response.data;
    } catch (error) {
      console.error('Save event error:', error);
      throw new Error('イベントの保存に失敗しました');
    }
  }

  static async deleteEvent(eventId: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/events/${eventId}`);
    } catch (error) {
      console.error('Delete event error:', error);
      throw new Error('イベントの削除に失敗しました');
    }
  }
}
