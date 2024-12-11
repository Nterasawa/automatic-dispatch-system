
import { Event } from '../types/event';

const API_URL = window.location.hostname.includes('repl.co')
  ? `https://${window.location.hostname}`
  : 'http://0.0.0.0:3000';

export class DatabaseService {
  static async initializeDatabase(): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/api/events`);
      return response.ok;
    } catch (error) {
      console.error('データベース初期化エラー:', error);
      throw new Error('データベースの初期化に失敗しました');
    }
  }

  static async getEvents(): Promise<Event[]> {
    try {
      const response = await fetch(`${API_URL}/api/events`);
      if (!response.ok) throw new Error('サーバーエラー');
      return response.json();
    } catch (error) {
      console.error('イベント取得エラー:', error);
      throw new Error('イベントの取得に失敗しました');
    }
  }

  static async saveEvent(event: Event): Promise<Event> {
    try {
      const response = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
      if (!response.ok) throw new Error('サーバーエラー');
      return response.json();
    } catch (error) {
      console.error('イベント保存エラー:', error);
      throw new Error('イベントの保存に失敗しました');
    }
  }

  static async deleteEvent(eventId: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/events/${eventId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('サーバーエラー');
    } catch (error) {
      console.error('イベント削除エラー:', error);
      throw new Error('イベントの削除に失敗しました');
    }
  }
}
