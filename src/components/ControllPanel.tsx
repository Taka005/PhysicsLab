"use client";

import { useEngine } from "@/context/EngineContext";

export default function ControllPanel() {
  const engine = useEngine();

  if (!engine) return;

  return (
    <div className="w-80 h-full bg-white rounded-lg shadow-sm p-4 flex flex-col gap-4 overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-800 border-b pb-2">操作パネル</h2>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => engine.start()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          スタート
        </button>
        <button
          onClick={() => engine.stop()}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
        >
          停止
        </button>
      </div>
    </div>
  )
}