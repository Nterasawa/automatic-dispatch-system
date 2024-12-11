import React from "react";

type AttendanceStatsProps = {
  attendances: any[];
};

export const AttendanceStats: React.FC<AttendanceStatsProps> = ({
  attendances,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-blue-50 p-4 rounded">
        <h3 className="font-bold text-blue-600">参加者数</h3>
        <p className="text-2xl">
          {attendances.filter((a) => a.status === "○").length}名
        </p>
        <div className="text-sm text-gray-600">
          <p>
            団員:{" "}
            {
              attendances.filter((a) => a.role === "団員" && a.status === "○")
                .length
            }{" "}
            名
          </p>
          <p>
            コーチ:{" "}
            {
              attendances.filter((a) => a.role === "コーチ" && a.status === "○")
                .length
            }{" "}
            名
          </p>
        </div>
      </div>
      <div className="bg-blue-50 p-4 rounded">
        <h3 className="font-bold text-blue-600">配車状況</h3>
        <p className="text-2xl">
          {attendances.filter((a) => a.canDrive === "○").length}台
        </p>
        <div className="text-sm text-gray-600">
          <p>
            総乗車数:{" "}
            {attendances.reduce((sum, a) => sum + (a.availableSeats || 0), 0)}{" "}
            名
          </p>
          <p>
            要配車調整:{" "}
            {attendances.filter((a) => a.needsCarArrangement === "○").length} 名
          </p>
        </div>
      </div>
    </div>
  );
};
