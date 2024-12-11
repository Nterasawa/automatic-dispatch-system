import React from "react";
import { NavigateFunction } from "react-router-dom";
import { DatabaseService } from "../../services/database";
import {
  PencilIcon,
  TrashIcon,
  PrinterIcon,
  ClipboardIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

type ActionButtonsProps = {
  eventId: string;
  setIsModalOpen: (isOpen: boolean) => void;
  navigate: NavigateFunction;
};

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  eventId,
  setIsModalOpen,
  navigate,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDeleteEvent = async () => {
    if (
      window.confirm(
        "このイベントを削除してもよろしいですか？\n※この操作は取り消せません。",
      )
    ) {
      try {
        await DatabaseService.deleteEvent(eventId);
        navigate("/");
      } catch (error) {
        console.error("イベント削除エラー:", error);
      }
    }
  };

  const handleCarArrangement = () => {
    navigate(`/car-arrangement/${eventId}`);
  };

  return (
    <div className="grid grid-cols-2 gap-2 mb-6">
      <button
        onClick={handleCarArrangement}
        className="flex items-center justify-center py-3 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        <TruckIcon className="h-5 w-5 mr-1" />
        <span>配車組</span>
      </button>
      <button
        onClick={handlePrint}
        className="flex items-center justify-center py-3 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
      >
        <PrinterIcon className="h-5 w-5 mr-1" />
        <span>印刷</span>
      </button>
      <button
        onClick={handleDeleteEvent}
        className="flex items-center justify-center py-3 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
      >
        <TrashIcon className="h-5 w-5 mr-1" />
        <span>削除</span>
      </button>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center justify-center py-3 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        <ClipboardIcon className="h-5 w-5 mr-1" />
        <span>一覧</span>
      </button>
    </div>
  );
};
