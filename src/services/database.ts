
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://0.0.0.0:3000'
});

export class DatabaseService {
  static async initializeDatabase() {
    try {
      const response = await api.get('/api/health');
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
      const response = await api.get('/api/events');
      return response.data;
    } catch (error) {
      console.error('Get events error:', error);
      throw error;
    }
  }

  static async saveEvent(event: any) {
    try {
      const response = await api.post('/api/events', event);
      return response.data;
    } catch (error) {
      console.error('Save event error:', error);
      throw error;
    }
  }
}
