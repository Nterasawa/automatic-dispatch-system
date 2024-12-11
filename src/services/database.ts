
import { Event } from "../types/event";
import { AttendanceData } from "../types/attendance";

const API_BASE_URL = '/api';

export const DatabaseService = {
  async initializeDatabase(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/events`);
      const events = await response.json();
      
      if (!events || events.length === 0) {
        const event: Event = {
          id: "event-" + Date.now(),
          title: "2024年 練習試合",
          date: new Date("2024-12-15").toISOString().split("T")[0],
          attendees: 0,
          cars: 0,
        };
        await this.saveEvent(event);
      }
    } catch (error) {
      console.error("データベース初期化エラー:", error);
    }
  },

  async getEvents(): Promise<Event[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/events`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      return await response.json();
    } catch (error) {
      console.error("イベント取得エラー:", error);
      return [];
    }
  },

  async saveEvent(event: Event): Promise<void> {
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
    } catch (error) {
      console.error("イベント保存エラー:", error);
      throw error;
    }
  },

  async getAttendances(eventId: string): Promise<AttendanceData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch attendances');
      }
      return await response.json();
    } catch (error) {
      console.error("出席データ取得エラー:", error);
      return [];
    }
  },

  async saveAttendance(eventId: string, attendance: AttendanceData): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/${eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendance),
      });
      if (!response.ok) {
        throw new Error('Failed to save attendance');
      }
    } catch (error) {
      console.error("出席データ保存エラー:", error);
      throw error;
    }
  },

  async updateAttendance(eventId: string, attendanceId: string, attendance: AttendanceData): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/attendance/${eventId}/${attendanceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attendance),
      });
      if (!response.ok) {
        throw new Error('Failed to update attendance');
      }
    } catch (error) {
      console.error("出席データ更新エラー:", error);
      throw error;
    }
  },

  async saveCarArrangement(eventId: string, arrangement: any): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/car-arrangement/${eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(arrangement),
      });
      if (!response.ok) {
        throw new Error('Failed to save car arrangement');
      }
    } catch (error) {
      console.error("配車データ保存エラー:", error);
      throw error;
    }
  },

  async getCarArrangement(eventId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/car-arrangement/${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch car arrangement');
      }
      return await response.json();
    } catch (error) {
      console.error("配車データ取得エラー:", error);
      return null;
    }
  }
};
