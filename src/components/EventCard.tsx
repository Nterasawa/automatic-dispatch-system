import React from "react";
import { Link } from "react-router-dom";
import { Event } from "../types/event";

interface EventCardProps {
  event: Event;
  onCopyLink: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onCopyLink }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-blue-600">{event.title}</h3>
        <p className="text-gray-600 text-sm">
          開催日: {formatDate(event.date)}
        </p>
        <p className="text-gray-600 text-sm">参加者: {event.attendees}名</p>
        <p className="text-gray-600 text-sm">配車: {event.cars}台</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <Link
          to={`/attend/${event.id}`}
          className="bg-green-500 text-white text-center py-2 px-4 rounded hover:bg-green-600 transition-colors"
        >
          出欠登録
        </Link>
        <Link
          to={`/admin/${event.id}`}
          className="bg-blue-500 text-white text-center py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          管理画面
        </Link>
      </div>

      <button
        onClick={() => onCopyLink(event.id)}
        className="w-full text-gray-600 border border-gray-300 rounded py-2 px-4 hover:bg-gray-50 transition-colors"
      >
        リンクをコピー
      </button>
    </div>
  );
};

export default EventCard;
