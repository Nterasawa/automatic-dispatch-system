import { useState, useEffect } from "react";
import { Event } from "../types/event";
import { DatabaseService } from "../services/database";

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await DatabaseService.getEvents();
      setEvents(data);
    } catch (err) {
      setError("イベントの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const addEvent = async (newEvent: Omit<Event, "id">) => {
    try {
      const event: Event = {
        ...newEvent,
        id: crypto.randomUUID(),
        attendees: 0,
        cars: 0,
      };
      await DatabaseService.saveEvent(event);
      setEvents((prev) => [...prev, event]);
      return event;
    } catch (err) {
      setError("イベントの追加に失敗しました");
      throw err;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await DatabaseService.deleteEvent(id);
      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (err) {
      setError("イベントの削除に失敗しました");
      throw err;
    }
  };

  return {
    events,
    loading,
    error,
    addEvent,
    deleteEvent,
    refreshEvents: fetchEvents,
  };
};
