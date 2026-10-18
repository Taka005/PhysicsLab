"use client";

import { useEngine } from "@/context/EngineContext";
import { useEngineState } from "@/hooks/useEngineState";

export default function ControllPanel() {
  const engine = useEngine();
  const state = useEngineState();

  if (!engine||!state) return;

  return (
    <div className="w-80 h-full bg-white rounded-lg shadow-sm p-4 flex flex-col gap-4 overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-800 border-b pb-2">操作パネル</h2>
      <div className="flex flex-col gap-2">
        {state.isStarted ? (
          <button
            onClick={() => engine.stop()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            停止
          </button>
        ) : (
          <button
            onClick={() => engine.start()}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            実行
          </button>
        )}
      </div>
    </div>
  )
}