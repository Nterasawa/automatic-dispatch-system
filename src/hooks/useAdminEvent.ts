import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DatabaseService } from "../services/database";

export const useAdminEvent = (eventId: string | undefined) => {
  const navigate = useNavigate();
  const [event, setEvent] = useState<any>(null);
  const [attendances, setAttendances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"member" | "coach">("member");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!eventId) return;
      try {
        const events = await DatabaseService.getEvents();
        const event = events.find((e) => e.id === eventId);
        if (!event) {
          navigate("/");
          return;
        }
        setEvent(event);

        const attendanceData = await DatabaseService.getAttendances(eventId);
        setAttendances(attendanceData);
      } catch (error) {
        console.error("データ取得エラー:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId, navigate]);

  return {
    event,
    attendances,
    loading,
    activeTab,
    setActiveTab,
    isModalOpen,
    setIsModalOpen,
  };
};
