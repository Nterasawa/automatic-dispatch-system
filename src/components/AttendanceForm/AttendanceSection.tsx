import React from "react";
import { AttendanceFormData } from "../../types/attendance";

type Props = {
  formData: AttendanceFormData;
  setFormData: (data: AttendanceFormData) => void;
};

export const AttendanceSection: React.FC<Props> = ({
  formData,
  setFormData,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        出欠 <span className="text-red-500">*</span>
      </label>
      <div className="grid grid-cols-2 gap-2">
        <label
          className={`flex items-center justify-center p-3 rounded cursor-pointer ${
            formData.status === "○"
              ? "bg-green-500 text-white"
              : "bg-white border border-gray-300 text-gray-700"
          }`}
        >
          <input
            type="radio"
            name="status"
            value="○"
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as "○" | "×",
              })
            }
            className="hidden"
            required
          />
          ○
        </label>
        <label
          className={`flex items-center justify-center p-3 rounded cursor-pointer ${
            formData.status === "×"
              ? "bg-red-500 text-white"
              : "bg-white border border-gray-300 text-gray-700"
          }`}
        >
          <input
            type="radio"
            name="status"
            value="×"
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as "○" | "×",
              })
            }
            className="hidden"
          />
          ×
        </label>
      </div>
    </div>
  );
};
