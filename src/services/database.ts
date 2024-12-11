
import { Event } from '../types/event';
import { AttendanceData } from '../types/attendance';

export class DatabaseService {
  static async initializeDatabase() {
    try {
      const response = await fetch('/api/health');
      return await response.json();
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  static async getEvents(): Promise<Event[]> {
    try {
      const response = await fetch('/api/events');
      return await response.json();
    } catch (error) {
      console.error('Get events error:', error);
      return [];
    }
  }

  static async saveEvent(event: Event): Promise<void> {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
      if (!response.ok) {
        throw new Error('Failed to save event');
      }
    } catch (error) {
      console.error('Save event error:', error);
      throw error;
    }
  }

  static async deleteEvent(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete event');
      }
    } catch (error) {
      console.error('Delete event error:', error);
      throw error;
    }
  }
}
