
import axios from 'axios';

export class DatabaseService {
  static async initializeDatabase() {
    try {
      const response = await axios.get('/api/health');
      if (response.data.status !== 'ok') {
        throw new Error('Database initialization failed');
      }
    } catch (error) {
      console.error('Database initialization error:', error);
      throw new Error('Database initialization failed');
    }
  }

  static async getEvents() {
    try {
      const response = await axios.get('/api/events');
      return response.data;
    } catch (error) {
      console.error('Get events error:', error);
      throw error;
    }
  }

  static async saveEvent(event: any) {
    try {
      const response = await axios.post('/api/events', event);
      return response.data;
    } catch (error) {
      console.error('Save event error:', error);
      throw error;
    }
  }
}
