import React from "react";

type AttendanceListModalProps = {
  attendances: any[];
  isOpen: boolean;
  onClose: () => void;
};

export const AttendanceListModal: React.FC<AttendanceListModalProps> = ({
  attendances,
  isOpen,
  onClose,
}) => {
  const handleCopyAttendanceList = () => {
    const memberCount = attendances.filter(
      (a) => a.role === "団員" && a.status === "○",
    ).length;
    const coachCount = attendances.filter(
      (a) => a.role === "コーチ" && a.status === "○",
    ).length;
    const absentMembers = attendances.filter(
      (a) => a.role === "団員" && a.status === "×",
    );
    const presentCoaches = attendances.filter(
      (a) => a.role === "コーチ" && a.status === "○",
    );

    const text = `出席者\n\n団員 ${memberCount}名/コーチ ${coachCount}名\n\n＜団員欠席者＞\n${
      absentMembers.length
        ? absentMembers.map((m) => m.memberName).join("\n")
        : "なし"
    }\n\n＜コーチ出席者＞\n${presentCoaches.map((c) => `${c.memberName}コーチ`).join("\n")}`;

    navigator.clipboard.writeText(text);
    alert("参加者一覧をコピーしました");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <h3 className="text-xl font-bold mb-4">参加者一覧</h3>
        <div className="mb-4 whitespace-pre-wrap">
          <div className="text-sm">
            団員:{" "}
            {
              attendances.filter((a) => a.role === "団員" && a.status === "○")
                .length
            }{" "}
            名
            <br />
            コーチ:{" "}
            {
              attendances.filter((a) => a.role === "コーチ" && a.status === "○")
                .length
            }{" "}
            名
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleCopyAttendanceList}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            一覧をコピー
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};
