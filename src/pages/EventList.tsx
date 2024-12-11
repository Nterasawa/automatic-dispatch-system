import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DatabaseService } from "../services/database";
import { Event } from "../types/event";
import {
  CalendarIcon,
  LinkIcon,
  CheckIcon,
  ClipboardIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

export const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [activeTab, setActiveTab] = useState("this-week"); // "this-week", "future", "past"
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const loadedEvents = await DatabaseService.getEvents();
    setEvents(loadedEvents);
  };

  const handleCreateEvent = async () => {
    if (!newEventTitle || !newEventDate) {
      alert("イベント名と開催日を入力してください");
      return;
    }

    try {
      const newEvent: Event = {
        id: `event-${Date.now()}`,
        title: newEventTitle,
        date: newEventDate,
        attendees: 0,
        cars: 0,
      };

      await DatabaseService.saveEvent(newEvent);
      setShowCreateModal(false);
      setNewEventTitle("");
      setNewEventDate("");
      loadEvents();
    } catch (error) {
      console.error("イベント作成エラー:", error);
      alert("イベントの作成に失敗しました");
    }
  };

  // イベントを日付でフィルタリング
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    const today = new Date();
    const weekEnd = new Date(today);
    weekEnd.setDate(today.getDate() + 7);

    if (activeTab === "this-week") {
      return eventDate >= today && eventDate <= weekEnd;
    } else if (activeTab === "future") {
      return eventDate > weekEnd;
    } else {
      return eventDate < today;
    }
  });

  const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyLink = async () => {
      const link = `${window.location.origin}/attendance/${event.id}`;
      try {
        await navigator.clipboard.writeText(link);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (error) {
        console.error("リンクのコピーに失敗:", error);
      }
    };

    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="mb-3">
          <h3 className="font-bold text-lg">{event.title}</h3>
          <p className="text-sm text-gray-500">
            {new Date(event.date).toLocaleDateString("ja-JP")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleCopyLink}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg flex items-center justify-center gap-1"
          >
            {isCopied ? (
              <>
                <CheckIcon className="w-4 h-4 text-green-600" />
                <span className="text-green-600">コピー完了!</span>
              </>
            ) : (
              <>
                <LinkIcon className="w-4 h-4" />
                <span>コピー</span>
              </>
            )}
          </button>
          <button
            onClick={() => navigate(`/attendance/${event.id}`)}
            className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1 hover:bg-green-600"
          >
            <UserPlusIcon className="w-4 h-4" />
            出欠入力
          </button>
          <button
            onClick={() => navigate(`/admin/${event.id}`)}
            className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg flex items-center justify-center gap-1 hover:bg-blue-600"
          >
            <ClipboardIcon className="w-4 h-4" />
            管理画面
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* イベント作成ボタン */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="w-full bg-blue-600 text-white p-4 rounded-lg mb-6 flex items-center justify-center gap-2 hover:bg-blue-700"
      >
        <CalendarIcon className="w-5 h-5" />
        新規イベント作成
      </button>

      {/* タブナビゲーション */}
      <div className="flex mb-6 border-b">
        <button
          onClick={() => setActiveTab("this-week")}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === "this-week"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
          今週
        </button>
        <button
          onClick={() => setActiveTab("future")}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === "future"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
          将来
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`flex-1 px-4 py-2 text-sm font-medium ${
            activeTab === "past"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
          }`}
        >
          過去
        </button>
      </div>

      {/* イベント一覧 */}
      <div className="space-y-3">
        {filteredEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* イベント作成モーダル */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">新規イベント作成</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  イベント名 *
                </label>
                <input
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  開催日 *
                </label>
                <input
                  type="date"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 p-2 border rounded"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleCreateEvent}
                  className="flex-1 bg-blue-600 text-white p-2 rounded"
                >
                  作成する
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
