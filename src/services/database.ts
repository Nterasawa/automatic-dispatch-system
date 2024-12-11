
import { Event } from "../types/event";
import { AttendanceData } from "../types/attendance";

const API_BASE_URL = '/api';

export const DatabaseService = {
  async initializeDatabase(): Promise<void> {
    try {
      const events = await this.getEvents();
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
    const response = await fetch(`${API_BASE_URL}/events`);
    return response.json();
  },

  async saveEvent(event: Event): Promise<void> {
    await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
  },

  async getAttendances(eventId: string): Promise<AttendanceData[]> {
    const response = await fetch(`${API_BASE_URL}/attendance/${eventId}`);
    return response.json();
  },

  async saveAttendance(eventId: string, attendance: AttendanceData): Promise<void> {
    await fetch(`${API_BASE_URL}/attendance/${eventId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attendance)
    });
  },

  async updateAttendance(eventId: string, attendanceId: string, attendance: AttendanceData): Promise<void> {
    await fetch(`${API_BASE_URL}/attendance/${eventId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attendance)
    });
  },

  async saveCarArrangement(eventId: string, arrangement: any): Promise<void> {
    await fetch(`${API_BASE_URL}/car-arrangement/${eventId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(arrangement)
    });
  },

  async getCarArrangement(eventId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/car-arrangement/${eventId}`);
    return response.json();
  }
};
