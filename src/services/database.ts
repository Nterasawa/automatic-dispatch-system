
import { Event } from "../types/event";
import { AttendanceData } from "../types/attendance";
import Database from "@replit/database";

const db = new Database();

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
    try {
      const events = await db.get("events");
      return events || [];
    } catch (error) {
      console.error("イベント取得エラー:", error);
      return [];
    }
  },

  async saveEvent(event: Event): Promise<void> {
    try {
      const events = await this.getEvents();
      const updatedEvents = [...events, event];
      await db.set("events", updatedEvents);
    } catch (error) {
      console.error("イベント保存エラー:", error);
      throw new Error("イベントの保存に失敗しました");
    }
  },

  async deleteEvent(eventId: string): Promise<void> {
    try {
      const events = await this.getEvents();
      const filteredEvents = events.filter((event) => event.id !== eventId);
      await db.set("events", filteredEvents);
      await db.delete(`attendance_${eventId}`);
      await db.delete(`car_arrangement_${eventId}`);
    } catch (error) {
      console.error("イベント削除エラー:", error);
      throw new Error("イベントの削除に失敗しました");
    }
  },

  async saveAttendance(eventId: string, attendance: AttendanceData): Promise<void> {
    try {
      const attendances = await this.getAttendances(eventId);
      const updatedAttendances = [...attendances, attendance];
      await db.set(`attendance_${eventId}`, updatedAttendances);
    } catch (error) {
      console.error("出欠保存エラー:", error);
      throw new Error("出欠情報の保存に失敗しました");
    }
  },

  async getAttendances(eventId: string): Promise<AttendanceData[]> {
    try {
      const attendances = await db.get(`attendance_${eventId}`);
      return attendances || [];
    } catch (error) {
      console.error("出欠取得エラー:", error);
      return [];
    }
  },

  async updateAttendance(eventId: string, attendanceId: string, updatedData: AttendanceData): Promise<void> {
    try {
      const attendances = await this.getAttendances(eventId);
      const updatedAttendances = attendances.map(attendance => 
        attendance.id === attendanceId ? updatedData : attendance
      );
      await db.set(`attendance_${eventId}`, updatedAttendances);
    } catch (error) {
      console.error("出欠更新エラー:", error);
      throw new Error("出欠情報の更新に失敗しました");
    }
  },

  async deleteAttendance(eventId: string, attendanceId: string): Promise<void> {
    try {
      const attendances = await this.getAttendances(eventId);
      const filteredAttendances = attendances.filter(
        (a) => a.id !== attendanceId,
      );
      await db.set(`attendance_${eventId}`, filteredAttendances);
    } catch (error) {
      console.error("出欠削除エラー:", error);
      throw new Error("出欠情報の削除に失敗しました");
    }
  },

  async saveCarArrangement(eventId: string, arrangement: any): Promise<void> {
    try {
      await db.set(`car_arrangement_${eventId}`, arrangement);
      console.log("配車結果を保存しました:", arrangement);
    } catch (error) {
      console.error("配車結果保存エラー:", error);
      throw new Error("配車結果の保存に失敗しました");
    }
  },

  async getCarArrangement(eventId: string): Promise<any | null> {
    try {
      return await db.get(`car_arrangement_${eventId}`);
    } catch (error) {
      console.error("配車結果取得エラー:", error);
      return null;
    }
  },
};
