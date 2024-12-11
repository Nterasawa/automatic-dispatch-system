import React from "react";
import { AttendanceFormData } from "../../types/attendance";

type Props = {
  formData: AttendanceFormData;
  setFormData: (data: AttendanceFormData) => void;
};

export const MemberInfoSection: React.FC<Props> = ({
  formData,
  setFormData,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        氏名 <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        required
        className="w-full p-3 border border-gray-300 rounded-md"
        value={formData.memberName}
        onChange={(e) =>
          setFormData({
            ...formData,
            memberName: e.target.value,
          })
        }
      />
    </div>
  );
};
