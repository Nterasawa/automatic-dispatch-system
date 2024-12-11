import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const CompletionPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-blue-500 text-white p-4">
        <h1 className="text-lg font-bold text-center">
          イーグルス自動出欠配車システム
        </h1>
      </header>
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="text-green-500 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">
            {mode === "update" ? "更新完了" : "登録完了"}
          </h2>
          <p className="text-gray-600 mb-6">
            {mode === "update"
              ? "出欠情報が正常に更新されました"
              : "出欠情報が正常に登録されました"}
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            トップページに戻る
          </button>
        </div>
      </div>
    </div>
  );
};
