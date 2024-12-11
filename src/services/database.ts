
import { Event } from '../types/event';
import { AttendanceData } from '../types/attendance';

const API_BASE_URL = 'http://0.0.0.0:3000/api';

export class DatabaseService {
  static async initializeDatabase() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) {
        throw new Error('Server health check failed');
      }
      return await response.json();
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  static async getEvents(): Promise<Event[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/events`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      return await response.json();
    } catch (error) {
      console.error('Get events error:', error);
      throw error;
    }
  }

  static async saveEvent(event: Event): Promise<Event> {
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
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
      console.error('Save event error:', error);
      throw error;
    }
  }

  static async deleteEvent(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
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

  static async getAttendances(eventId: string): Promise<AttendanceData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}/attendances`);
      if (!response.ok) {
        throw new Error('Failed to fetch attendances');
      }
      return await response.json();
    } catch (error) {
      console.error('Get attendances error:', error);
      throw error;
    }
  }
}
