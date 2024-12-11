
import Client from '@replit/database';
import { Event } from '../types/event';

const db = new Client();

export class DatabaseService {
  static async initializeDatabase(): Promise<boolean> {
    try {
      await db.get('initialized');
      return true;
    } catch (error) {
      await db.set('initialized', true);
      return true;
    }
  }

  static async getEvents(): Promise<Event[]> {
    try {
      const keys = await db.list('event:');
      const events = await Promise.all(keys.map(key => db.get(key)));
      return events;
    } catch (error) {
      console.error('イベント取得エラー:', error);
      throw new Error('イベントの取得に失敗しました');
    }
  }

  static async saveEvent(event: Event): Promise<Event> {
    try {
      await db.set(`event:${event.id}`, event);
      return event;
    } catch (error) {
      console.error('イベント保存エラー:', error);
      throw new Error('イベントの保存に失敗しました');
    }
  }

  static async deleteEvent(eventId: string): Promise<void> {
    try {
      await db.delete(`event:${eventId}`);
    } catch (error) {
      console.error('イベント削除エラー:', error);
      throw new Error('イベントの削除に失敗しました');
    }
  }
}
