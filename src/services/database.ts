
export class DatabaseService {
  private static baseUrl = '/api';

  static async initializeDatabase() {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      if (!response.ok) {
        throw new Error('Database initialization failed');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  static async getEvents() {
    try {
      const response = await fetch(`${this.baseUrl}/events`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get events error:', error);
      return [];
    }
  }

  static async saveEvent(event: any) {
    try {
      const response = await fetch(`${this.baseUrl}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
      if (!response.ok) {
        throw new Error('Failed to save event');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Event save error:', error);
      throw error;
    }
  }
}
