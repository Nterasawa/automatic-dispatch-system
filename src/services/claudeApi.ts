import { AttendanceData } from "../types/attendance";

type CarArrangementResponse = {
  driver: string;
  passengers: {
    type: "member" | "family" | "coach";
    name: string;
  }[];
}[];

export const arrangeCarsByAI = async (
  attendances: AttendanceData[],
  specialInstructions?: string,
) => {
  // 出席者のみをフィルタリング
  const activeAttendances = attendances.filter((a) => a.status === "○");

  // 車を提供できる人をフィルタリング
  const drivers = activeAttendances.filter((a) => a.canDrive === "○");

  // 配車が必要な人をフィルタリング（車を提供する人以外の出席者）
  let remainingPassengers = activeAttendances.filter((a) => a.canDrive === "×");

  // 配車結果を生成
  const result: CarArrangementResponse = [];

  // 各ドライバーに対して配車を行う
  drivers.forEach((driver) => {
    // この車に乗せられる人数を計算
    const availableSeats = driver.availableSeats;

    // この車の乗客リスト
    const carPassengers = [];

    // 優先順位: 団員 > コーチ
    // 団員を先に割り当て
    const memberPassengers = remainingPassengers
      .filter((p) => p.role === "団員")
      .slice(0, availableSeats);

    memberPassengers.forEach((p) => {
      carPassengers.push({
        type: "member" as const,
        name: p.memberName,
      });
      // 割り当て済みの乗客を残りのリストから削除
      remainingPassengers = remainingPassengers.filter((rp) => rp.id !== p.id);
    });

    // 残席があればコーチを割り当て
    const remainingSeats = availableSeats - carPassengers.length;
    if (remainingSeats > 0) {
      const coachPassengers = remainingPassengers
        .filter((p) => p.role === "コーチ")
        .slice(0, remainingSeats);

      coachPassengers.forEach((p) => {
        carPassengers.push({
          type: "coach" as const,
          name: p.memberName,
        });
        // 割り当て済みの乗客を残りのリストから削除
        remainingPassengers = remainingPassengers.filter(
          (rp) => rp.id !== p.id,
        );
      });
    }

    // 家族乗客を追加（該当する場合）
    if (driver.familyPassengers > 0) {
      carPassengers.push({
        type: "family" as const,
        name: `${driver.memberName}の家族`,
      });
    }

    // この車の配車結果を追加
    result.push({
      driver: driver.memberName,
      passengers: carPassengers,
    });
  });

  // 配車できなかった人がいる場合は警告を追加
  if (remainingPassengers.length > 0) {
    console.warn("配車できなかった参加者:", remainingPassengers);
  }

  return result;
};
