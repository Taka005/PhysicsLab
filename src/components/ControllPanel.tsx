"use client";

import { useEngine } from "@/context/EngineContext";
import { useEngineState } from "@/hooks/useEngineState";
import { ChangeEvent, useState } from "react";

export default function ControllPanel() {
  const engine = useEngine();
  const state = useEngineState();
  const [gravityValue, setGravityValue] = useState<number>(state?.gravity ?? 0);

  if (!engine||!state) return;

  const handleGravityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setGravityValue(value);

    engine.gravity = value;
  };

  return (
    <div className="w-80 h-full bg-white rounded-lg shadow-sm p-4 flex flex-col gap-4 overflow-y-auto">
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
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label htmlFor="gravity-range" className="text-sm font-semibold text-gray-700">
            重力
          </label>
          <span className="text-sm text-gray-600 font-mono">
            {gravityValue}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1000"
          step="1"
          value={gravityValue}
          onChange={handleGravityChange}
          className="w-full accent-blue-600 cursor-pointer"
        />
      </div>
    </div>
  )
}