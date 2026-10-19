"use client";

import { useEngine } from "@/context/EngineContext";
import { useEngineState } from "@/hooks/useEngineState";
import { ChangeEvent, useEffect, useState } from "react";

export default function ControllPanel() {
  const engine = useEngine();
  const state = useEngineState();
  const [gravityValue, setGravityValue] = useState<number>(state.gravity);
  const [frictionValue, setFrictionValue] = useState<number>(state.friction);
  const [playBackSpeedValue, setPlayBackSpeedValue] = useState<number>(state.playBackSpeed);

  if (!engine||!state) return;

  const handleGravityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setGravityValue(value);

    engine.gravity = value;
  };

  const handleFrictionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setFrictionValue(value);

    engine.friction = value;
  };

  const handlePlayBackSpeedChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setPlayBackSpeedValue(value);

    engine.playBackSpeed = value;
  };

  useEffect(() => {
    if (state) {
      if (state.gravity !== undefined) setGravityValue(state.gravity);
      if (state.friction !== undefined) setFrictionValue(state.friction);
      if (state.playBackSpeed !== undefined) setPlayBackSpeedValue(state.playBackSpeed);
    }
  }, [state]);

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
          <label className="text-sm font-semibold text-gray-700">
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
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-gray-700">
            摩擦
          </label>
          <span className="text-sm text-gray-600 font-mono">
            {frictionValue}
          </span>
        </div>
        <input
          type="range"
          min="-0.5"
          max="0.5"
          step="0.001"
          value={frictionValue}
          onChange={handleFrictionChange}
          className="w-full accent-blue-600 cursor-pointer"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-gray-700">
            再生速度
          </label>
          <span className="text-sm text-gray-600 font-mono">
            {playBackSpeedValue}
          </span>
        </div>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={playBackSpeedValue}
          onChange={handlePlayBackSpeedChange}
          className="w-full accent-blue-600 cursor-pointer"
        />
      </div>
    </div>
  )
}