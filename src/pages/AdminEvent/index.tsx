import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DatabaseService } from "../../services/database";
import {
  PencilIcon,
  TrashIcon,
  PrinterIcon,
  ClipboardIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { AttendanceListModal } from "./AttendanceListModal";
import CarArrangementModal from "./CarArrangementModal";

export const AdminEvent: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [attendances, setAttendances] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"member" | "coach">("member");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCarArrangementModalOpen, setIsCarArrangementModalOpen] =
    useState(false);
  const [carArrangement, setCarArrangement] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const events = await DatabaseService.getEvents();
        const event = events.find((e) => e.id === id);
        if (!event) {
          navigate("/");
          return;
        }
        setEvent(event);

        const attendanceData = await DatabaseService.getAttendances(id);
        setAttendances(attendanceData);

        // 配車結果の取得を確実に
        const arrangementData = await DatabaseService.getCarArrangement(id);
        if (arrangementData && arrangementData.arrangement) {
          console.log(
            "保存された配車データを読み込み:",
            arrangementData.arrangement,
          );
          setCarArrangement(arrangementData.arrangement);
        }
      } catch (error) {
        console.error("データ取得エラー:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handlePrint = () => {
    window.print();
  };

  const handleDeleteEvent = async () => {
    if (!id) return;
    if (
      window.confirm(
        "このイベントを削除してもよろしいですか？\n※この操作は取り消せません。",
      )
    ) {
      try {
        await DatabaseService.deleteEvent(id);
        navigate("/");
      } catch (error) {
        console.error("イベント削除エラー:", error);
      }
    }
  };

  const handleDeleteAttendance = async (attendanceId: string) => {
    if (!id) return;
    if (window.confirm("この出席情報を削除してよろしいですか？")) {
      try {
        await DatabaseService.deleteAttendance(id, attendanceId);
        const updatedAttendances = await DatabaseService.getAttendances(id);
        setAttendances(updatedAttendances);
      } catch (error) {
        console.error("削除エラー:", error);
        alert("削除に失敗しました");
      }
    }
  };

  const handleCarArrangementComplete = async (result: any) => {
    try {
      await DatabaseService.saveCarArrangement(id!, result);
      setCarArrangement(result);
      console.log("配車結果を保存しました:", result);
    } catch (error) {
      console.error("配車結果の保存に失敗:", error);
      alert("配車結果の保存に失敗しました");
    }
  };
  const filteredAttendances = attendances.filter(
    (a) => a.role === (activeTab === "member" ? "団員" : "コーチ"),
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <header className="bg-blue-500 text-white p-4">
          <h1 className="text-lg font-bold">イーグルス自動出欠配車システム</h1>
        </header>
        <div className="p-4 text-center">イベントが見つかりません</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-lg font-bold">イーグルス自動出欠配車システム</h1>
      </header>

      <div className="max-w-4xl mx-auto w-full p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold">{event.title}</h2>
            <p className="text-gray-600">
              開催日: {new Date(event.date).toLocaleDateString("ja-JP")}
            </p>
          </div>

          {/* 統計情報 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="font-bold text-blue-600">参加者数</h3>
              <p className="text-2xl">
                {attendances.filter((a) => a.status === "○").length}名
              </p>
              <div className="text-sm text-gray-600">
                <p>
                  団員:{" "}
                  {
                    attendances.filter(
                      (a) => a.role === "団員" && a.status === "○",
                    ).length
                  }{" "}
                  名
                </p>
                <p>
                  コーチ:{" "}
                  {
                    attendances.filter(
                      (a) => a.role === "コーチ" && a.status === "○",
                    ).length
                  }{" "}
                  名
                </p>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="font-bold text-blue-600">配車状況</h3>
              <p className="text-2xl">
                {attendances.filter((a) => a.canDrive === "○").length}台
              </p>
              <div className="text-sm text-gray-600">
                <p>
                  総乗車数:{" "}
                  {attendances.reduce(
                    (sum, a) => sum + (a.availableSeats || 0),
                    0,
                  )}{" "}
                  名
                </p>
                <p>
                  要配車調整:{" "}
                  {
                    attendances.filter((a) => a.needsCarArrangement === "○")
                      .length
                  }{" "}
                  名
                </p>
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <button
              onClick={() => setIsCarArrangementModalOpen(true)}
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

          {/* タブ切り替え */}
          <div className="mb-4">
            <div className="flex border-b">
              <button
                className={`flex-1 py-2 ${
                  activeTab === "member"
                    ? "border-b-2 border-blue-500 text-blue-600 font-bold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("member")}
              >
                団員
              </button>
              <button
                className={`flex-1 py-2 ${
                  activeTab === "coach"
                    ? "border-b-2 border-blue-500 text-blue-600 font-bold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("coach")}
              >
                コーチ
              </button>
            </div>
          </div>

          {/* 参加者一覧テーブル */}
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    氏名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    出欠
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    配車
                  </th>
                  {activeTab === "member" && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      家族乗車
                    </th>
                  )}
                  {activeTab === "coach" && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        おにぎり
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        配車調整
                      </th>
                    </>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    乗車数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase min-w-[200px]">
                    備考
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttendances.map((attendance) => (
                  <tr key={attendance.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {attendance.memberName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          attendance.status === "○"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {attendance.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          attendance.canDrive === "○"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {attendance.canDrive}
                      </span>
                    </td>
                    {activeTab === "member" && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {attendance.familyPassengers}名
                        </div>
                      </td>
                    )}
                    {activeTab === "coach" && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {attendance.needsOnigiri === "必要" && (
                            <span title="おにぎり必要">🍙</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              attendance.needsCarArrangement === "○"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {attendance.needsCarArrangement || "×"}
                          </span>
                        </td>
                      </>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {attendance.availableSeats}名
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 whitespace-nowrap overflow-x-auto">
                        {attendance.notes || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            navigate(
                              `/attendance/${id}?mode=edit&attendanceId=${attendance.id}`,
                            )
                          }
                          className="text-blue-600 hover:text-blue-800"
                          title="編集"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAttendance(attendance.id)}
                          className="text-red-600 hover:text-red-800"
                          title="削除"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <button
              onClick={() => navigate("/")}
              className="w-full py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              戻る
            </button>
          </div>
        </div>
      </div>

      <AttendanceListModal
        attendances={attendances}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <CarArrangementModal
        attendances={attendances}
        isOpen={isCarArrangementModalOpen}
        onClose={() => setIsCarArrangementModalOpen(false)}
        eventId={id!}
        onComplete={handleCarArrangementComplete}
      />
    </div>
  );
};
