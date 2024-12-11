
import axios from 'axios';

const BASE_URL = window.location.hostname.includes('repl.co') 
  ? `https://${window.location.hostname}`
  : 'http://0.0.0.0:3000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export class DatabaseService {
  static async initializeDatabase() {
    try {
      const response = await api.get('/api/health');
      if (response.data.status !== 'ok') {
        throw new Error('Database initialization failed');
      }
      return true;
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
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
