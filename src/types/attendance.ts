export type AttendanceData = {
  id: string;
  eventId: string;
  memberName: string;
  role: "団員" | "コーチ";
  status: "○" | "×";
  canDrive: "○" | "×";
  availableSeats: number;
  familyPassengers: number;
  needsOnigiri?: "必要" | "不要";
  needsCarArrangement?: "○" | "×";
  notes: string;
};

export type Event = {
  id: string;
  title: string;
  date: string;
  attendees?: number;
  cars?: number;
};
