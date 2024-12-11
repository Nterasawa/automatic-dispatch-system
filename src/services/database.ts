
import { Event } from "../types/event";
import { AttendanceData } from "../types/attendance";

const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : '';

export class DatabaseService {
  static async initializeDatabase() {
    // 初期化は不要になったため、空の実装とします
    return;
  }

  static async getEvents(): Promise<Event[]> {
    try {
      const response = await fetch(`${API_URL}/api/events`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      return await response.json();
    } catch (error) {
      console.error('イベント取得エラー:', error);
      throw error;
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
      if (!response.ok) {
        throw new Error('Failed to save event');
      }
      return await response.json();
    } catch (error) {
      console.error('イベント保存エラー:', error);
      throw error;
    }
  }
}
