
import { Event } from '../types/event';
import { AttendanceData } from '../types/attendance';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbPromise = open({
  filename: './data/events.db',
  driver: sqlite3.Database
});

export class DatabaseService {
  static async initializeDatabase() {
    const db = await dbPromise;
    await db.exec(`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        attendees INTEGER DEFAULT 0,
        cars INTEGER DEFAULT 0
      )
    `);
  }

  static async getEvents(): Promise<Event[]> {
    const db = await dbPromise;
    return db.all('SELECT * FROM events ORDER BY date DESC');
  }

  static async saveEvent(event: Event): Promise<void> {
    const db = await dbPromise;
    await db.run(
      'INSERT INTO events (id, title, date, attendees, cars) VALUES (?, ?, ?, ?, ?)',
      [event.id, event.title, event.date, event.attendees, event.cars]
    );
  }
}
