
import { Event } from '../types/event';
import { AttendanceData } from '../types/attendance';
import fs from 'fs/promises';

const DB_PATH = './data/events.json';

export class DatabaseService {
  static async initializeDatabase() {
    try {
      try {
        await fs.access(DB_PATH);
      } catch {
        await fs.mkdir('./data', { recursive: true });
        await fs.writeFile(DB_PATH, JSON.stringify([], null, 2));
      }
      return { status: 'success' };
    } catch (error) {
      console.error('Database initialization error details:', error);
      throw error;
    }
  }

  static async getEvents(): Promise<Event[]> {
    try {
      const data = await fs.readFile(DB_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Get events error:', error);
      return [];
    }
  }

  static async saveEvent(event: Event): Promise<void> {
    try {
      const events = await this.getEvents();
      events.push(event);
      await fs.writeFile(DB_PATH, JSON.stringify(events, null, 2));
    } catch (error) {
      console.error('Save event error:', error);
      throw error;
    }
  }

  static async deleteEvent(id: string): Promise<void> {
    try {
      const events = await this.getEvents();
      const filteredEvents = events.filter(event => event.id !== id);
      await fs.writeFile(DB_PATH, JSON.stringify(filteredEvents, null, 2));
    } catch (error) {
      console.error('Delete event error:', error);
      throw error;
    }
  }
}
