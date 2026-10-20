"use client";

import { useEngine } from "@/context/EngineContext";
import { useEngineState } from "@/hooks/useEngineState";
import { useState } from "react";
import SliderField from "./ui/SliderField";

export default function ControlPanel() {
  const engine = useEngine();
  const state = useEngineState();
  const [gravityValue, setGravityValue] = useState<number>(state.gravity);
  const [frictionValue, setFrictionValue] = useState<number>(state.friction);
  const [playBackSpeedValue, setPlayBackSpeedValue] = useState<number>(state.playBackSpeed);

  if (!engine||!state) return null;

  return (
    <div className="w-80 h-full bg-white rounded-lg shadow-sm p-4 flex flex-col gap-4 overflow-y-auto">
      <div className="flex gap-2">
        {state.isStarted ? (
          <button
            onClick={() => engine.stop()}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            停止
          </button>
        ) : (
          <button
            onClick={() => engine.start()}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            実行
          </button>
        )}
        <button
          onClick={() => engine.step()}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-gray-300"
          disabled={state.isStarted}
        >
          ステップ
        </button>
      </div>
      <SliderField
        label="重力"
        value={gravityValue}
        min="0"
        max="1000"
        step="1"
        onChange={(e) => {
          const val = parseFloat(e.target.value);
          setGravityValue(val);
          engine.gravity = val;
        }}
      />
      <SliderField
        label="摩擦"
        value={frictionValue}
        min="-0.5"
        max="0.5"
        step="0.001"
        onChange={(e) => {
          const val = parseFloat(e.target.value);
          setFrictionValue(val);
          engine.friction = val;
        }}
      />
      <SliderField
        label="再生速度"
        value={playBackSpeedValue}
        min="0.1"
        max="2"
        step="0.1"
        onChange={(e) => {
          const val = parseFloat(e.target.value);
          setPlayBackSpeedValue(val);
          engine.playBackSpeed = val;
        }}
      />
    </div>
  )
}