import { Event } from '../types/event';
import { AttendanceData } from '../types/attendance';

const API_BASE_URL = `/api`;

export class DatabaseService {
  static async initializeDatabase() {
    // APIサーバーが起動していることを確認
    try {
      await fetch(`${API_BASE_URL}/events`);
    } catch (error) {
      console.error('データベース初期化エラー:', error);
    }
  }

  static async getEvents(): Promise<Event[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/events`);
      if (!response.ok) throw new Error('Failed to fetch events');
      return await response.json();
    } catch (error) {
      console.error('イベント取得エラー:', error);
      throw error;
    }
  }

  static async saveEvent(event: Event): Promise<Event> {
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(event),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const text = await response.text();
        let error;
        try {
          const data = JSON.parse(text);
          error = data.error;
        } catch {
          error = text;
        }
        throw new Error(error || 'Failed to save event');
      }

      return await response.json();
    } catch (error) {
      console.error('Save event error:', error);
      throw error;
    }
  }

  static async deleteEvent(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete event');
    } catch (error) {
      console.error('イベント削除エラー:', error);
      throw error;
    }
  }
}