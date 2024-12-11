import React from "react";
import { useNavigate } from "react-router-dom";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

type AttendanceTableProps = {
  attendances: any[];
  activeTab: "member" | "coach";
  eventId: string;
};

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  attendances,
  activeTab,
  eventId,
}) => {
  const navigate = useNavigate();
  const filteredAttendances = attendances.filter(
    (a) => a.role === (activeTab === "member" ? "団員" : "コーチ"),
  );

  return (
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              氏名
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              出欠
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              配車
            </th>
            {activeTab === "member" && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                家族乗車
              </th>
            )}
            {activeTab === "coach" && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                おにぎり
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              乗車数
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[200px]">
              備考
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredAttendances.map((attendance) => (
            <tr key={attendance.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {attendance.memberName}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    attendance.status === "○"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {attendance.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    attendance.canDrive === "○"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {attendance.canDrive}
                </span>
              </td>
              {activeTab === "member" && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {attendance.familyPassengers}名
                  </div>
                </td>
              )}
              {activeTab === "coach" && (
                <td className="px-6 py-4 whitespace-nowrap">
                  {attendance.needsOnigiri === "必要" && (
                    <span title="おにぎり必要">🍙</span>
                  )}
                </td>
              )}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {attendance.availableSeats}名
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 whitespace-nowrap overflow-x-auto">
                  {attendance.notes || "-"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      navigate(
                        `/attendance/${eventId}?mode=edit&attendanceId=${attendance.id}`,
                      )
                    }
                    className="text-blue-600 hover:text-blue-800"
                    title="編集"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      /* TODO: 削除機能の実装 */
                    }}
                    className="text-red-600 hover:text-red-800"
                    title="削除"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
