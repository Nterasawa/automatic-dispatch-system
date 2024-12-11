import React from "react";
import { AttendanceFormData } from "../../types/attendance";

type Props = {
  formData: AttendanceFormData;
  setFormData: (data: AttendanceFormData) => void;
  charCount: number;
};

export const NotesSection: React.FC<Props> = ({
  formData,
  setFormData,
  charCount,
}) => {
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= 400) {
      setFormData({ ...formData, notes: text });
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        備考（最大400文字）
      </label>
      <textarea
        className="w-full p-3 border border-gray-300 rounded-md"
        rows={4}
        value={formData.notes}
        onChange={handleNotesChange}
        placeholder="遅刻、早退、自車移動、直行直帰などがある場合は記載してください"
        maxLength={400}
      />
      <div className="text-right text-sm text-gray-500">
        {charCount}/400文字
      </div>
    </div>
  );
};
