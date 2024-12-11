import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EventList } from "./pages/EventList";
import { AttendanceForm } from "./components/AttendanceForm";
import { CompletionPage } from "./pages/CompletionPage";
import { AdminEvent } from "./pages/AdminEvent";
import { DatabaseService } from "./services/database";

const App: React.FC = () => {
  // useEffectをコンポーネント内に移動
  useEffect(() => {
    const initDB = async () => {
      try {
        await DatabaseService.initializeDatabase();
      } catch (error) {
        console.error("データベース初期化エラー:", error);
      }
    };
    initDB();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white p-4 shadow-md">
          <h1 className="text-2xl font-bold text-center">
            イーグルス自動出欠配車システム
          </h1>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<EventList />} />
            <Route path="/attendance/:eventId" element={<AttendanceForm />} />
            <Route path="/completion" element={<CompletionPage />} />
            <Route path="/admin/:id" element={<AdminEvent />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
