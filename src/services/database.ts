import axios from 'axios';
import { Event } from '../types/event';

const API_BASE_URL = '/api';

export class DatabaseService {
  baseUrl = API_BASE_URL; // Added baseUrl property

  static async initializeDatabase() {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      return response.data;
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  static async getEvents() {
    try {
      const response = await axios.get(`${API_BASE_URL}/events`);
      return response.data;
    } catch (error) {
      console.error('Get events error:', error);
      throw error;
    }
  }

  static async saveEvent(event) {
    try {
      const response = await axios.post(`${API_BASE_URL}/events`, event);
      return response.data;
    } catch (error) {
      console.error('Save event error:', error);
      throw error;
    }
  }

  static async getAttendances(eventId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/events/${eventId}/attendances`);
      return response.data;
    } catch (error) {
      console.error('Get attendances error:', error);
      throw error;
    }
  }

  static async saveAttendance(eventId: string, attendance: any): Promise<void> { // Added any type for attendance
    try {
      const response = await axios.post(`${this.baseUrl}/api/events/${eventId}/attendances`, attendance);
      return response.data;
    } catch (error) {
      console.error('Save attendance error:', error);
      throw error;
    }
  }

  static async updateAttendance(eventId, attendanceId, attendance) {
    try {
      const response = await axios.put(`${API_BASE_URL}/events/${eventId}/attendances/${attendanceId}`, attendance);
      return response.data;
    } catch (error) {
      console.error('Update attendance error:', error);
      throw error;
    }
  }

  static async deleteEvent(eventId: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/events/${eventId}`);
    } catch (error) {
      console.error('Delete event error:', error);
      throw new Error('イベントの削除に失敗しました');
    }
  }
}