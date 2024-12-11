import { Event } from "../types/event";
import { AttendanceData } from "../types/attendance";

export const DatabaseService = {
  EVENTS_KEY: "events",
  ATTENDANCE_KEY: (eventId: string) => `attendance_${eventId}`,
  CAR_ARRANGEMENT_KEY: (eventId: string) => `car_arrangement_${eventId}`,

  async initializeDatabase(): Promise<void> {
    try {
      // データベースの存在確認
      if (!localStorage.getItem(this.EVENTS_KEY)) {
        console.log("データベースが存在しません。初期化を開始します。");
        localStorage.setItem(this.EVENTS_KEY, JSON.stringify([]));
      }
      
      const events = await this.getEvents();
      console.log("現在のイベント数:", events.length);
      
      if (events.length === 0) {
        const event: Event = {
          id: "event-" + Date.now(),
          title: "2024年 練習試合",
          date: new Date("2024-12-15").toISOString().split("T")[0],
          attendees: 0,
          cars: 0,
        };

        await this.saveEvent(event);

        const attendances: AttendanceData[] = [
          {
            id: "attendance-1",
            eventId: event.id,
            memberName: "中村コーチ",
            role: "コーチ",
            status: "○",
            canDrive: "○",
            availableSeats: 4,
            familyPassengers: 0,
            needsOnigiri: "必要",
            needsCarArrangement: "×",
            notes: "17時まで参加",
          },
          {
            id: "attendance-2",
            eventId: event.id,
            memberName: "田中一郎",
            role: "団員",
            status: "○",
            canDrive: "○",
            availableSeats: 4,
            familyPassengers: 1,
            notes: "母当番",
          },
          {
            id: "attendance-3",
            eventId: event.id,
            memberName: "山本次郎",
            role: "団員",
            status: "○",
            canDrive: "×",
            availableSeats: 0,
            familyPassengers: 0,
            notes: "",
          },
          {
            id: "attendance-4",
            eventId: event.id,
            memberName: "佐藤コーチ",
            role: "コーチ",
            status: "○",
            canDrive: "○",
            availableSeats: 3,
            familyPassengers: 0,
            needsOnigiri: "必要",
            needsCarArrangement: "×",
            notes: "",
          },
        ];

        for (const attendance of attendances) {
          await this.saveAttendance(event.id, attendance);
        }

        console.log("初期データを作成しました");
      }
    } catch (error) {
      console.error("データベース初期化エラー:", error);
    }
  },

  async getEvents(): Promise<Event[]> {
    try {
      const eventsJson = localStorage.getItem(this.EVENTS_KEY);
      return eventsJson ? JSON.parse(eventsJson) : [];
    } catch (error) {
      console.error("イベント取得エラー:", error);
      return [];
    }
  },

  async saveEvent(event: Event): Promise<void> {
    try {
      if (!event || !event.id) {
        throw new Error("無効なイベントデータです");
      }
      
      const events = await this.getEvents();
      if (!Array.isArray(events)) {
        console.error("イベントデータが不正です");
        localStorage.setItem(this.EVENTS_KEY, JSON.stringify([]));
        events = [];
      }
      
      events.push(event);
      localStorage.setItem(this.EVENTS_KEY, JSON.stringify(events));
      console.log(`イベントを保存しました: ${event.id}`);
    } catch (error) {
      console.error("イベント保存エラー:", error);
      throw new Error("イベントの保存に失敗しました");
    }
  },

  async deleteEvent(eventId: string): Promise<void> {
    try {
      const events = await this.getEvents();
      const filteredEvents = events.filter((event) => event.id !== eventId);
      localStorage.setItem(this.EVENTS_KEY, JSON.stringify(filteredEvents));
      localStorage.removeItem(this.ATTENDANCE_KEY(eventId));
      localStorage.removeItem(this.CAR_ARRANGEMENT_KEY(eventId));
    } catch (error) {
      console.error("イベント削除エラー:", error);
      throw new Error("イベントの削除に失敗しました");
    }
  },

  async saveAttendance(
    eventId: string,
    attendance: AttendanceData,
  ): Promise<void> {
    try {
      const key = this.ATTENDANCE_KEY(eventId);
      const attendances = await this.getAttendances(eventId);
      attendances.push(attendance);
      localStorage.setItem(key, JSON.stringify(attendances));
    } catch (error) {
      console.error("出欠保存エラー:", error);
      throw new Error("出欠情報の保存に失敗しました");
    }
  },

  async getAttendances(eventId: string): Promise<AttendanceData[]> {
    try {
      const key = this.ATTENDANCE_KEY(eventId);
      const attendancesJson = localStorage.getItem(key);
      return attendancesJson ? JSON.parse(attendancesJson) : [];
    } catch (error) {
      console.error("出欠取得エラー:", error);
      return [];
    }
  },

  async deleteAttendance(eventId: string, attendanceId: string): Promise<void> {
    try {
      const key = this.ATTENDANCE_KEY(eventId);
      const attendances = await this.getAttendances(eventId);
      const filteredAttendances = attendances.filter(
        (a) => a.id !== attendanceId,
      );
      localStorage.setItem(key, JSON.stringify(filteredAttendances));
    } catch (error) {
      console.error("出欠削除エラー:", error);
      throw new Error("出欠情報の削除に失敗しました");
    }
  },

  async saveCarArrangement(eventId: string, arrangement: any): Promise<void> {
    try {
      const key = this.CAR_ARRANGEMENT_KEY(eventId);
      const data = {
        arrangement,
        timestamp: new Date().toISOString(),
      };
      await Promise.all([
        localStorage.setItem(key, JSON.stringify(data)),
        localStorage.setItem(`${key}_backup`, JSON.stringify(data))
      ]);
    } catch (error) {
      console.error("配車結果保存エラー:", error);
      throw new Error("配車結果の保存に失敗しました");
    }
  },

  async getCarArrangement(eventId: string): Promise<any | null> {
    try {
      const key = this.CAR_ARRANGEMENT_KEY(eventId);
      const data = localStorage.getItem(key);
      if (!data) {
        // メインのデータが無い場合はバックアップを確認
        const backupKey = `${key}_backup`;
        const backupData = localStorage.getItem(backupKey);
        return backupData ? JSON.parse(backupData) : null;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error("配車結果取得エラー:", error);
      return null;
    }
  },

  async getCarArrangement(eventId: string): Promise<any | null> {
    try {
      const key = this.CAR_ARRANGEMENT_KEY(eventId);
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("配車結果取得エラー:", error);
      return null;
    }
  },
};
