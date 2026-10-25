"use client";

import { useEngine } from "@/context/EngineContext";
import { useEngineState } from "@/hooks/useEngineState";
import { useRef, useState } from "react";
import Draggable from "react-draggable";
import EnvSettings from "./ui/EnvSettings";
import SpawnSettings from "./ui/SpawnSettings";
import SettingPanel from "./ui/SettingPanel";
import SelectField from "./ui/SelectField";
import { useToolMode } from "@/context/ToolModeContext";
import ConnectionSettings from "./ui/ConnectionSettings";

export default function ControlPanel() {
  const engine = useEngine();
  const state = useEngineState();
  const [isSettingOpen, setIsSettingOpen] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const { mode, setMode } = useToolMode();

  if (!engine||!state) return null;

  const modeOptions = [
    { label: "生成", value: "spawn" },
    { label: "移動", value: "move" },
    { label: "削除", value: "delete" },
    { label: "接続", value: "connection" }
  ];

  return (
    <>
      <div className="w-80 h-full bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2 overflow-y-auto scrollbar-none">
        <div className="flex flex-col gap-2">
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
          <div className="flex gap-2">
            <button
              onClick={() => setIsSettingOpen(!isSettingOpen)}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              設定
            </button>
            <button
              onClick={() => engine.clear()}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              リセット
            </button>
          </div>
        </div>
        <hr className="my-1 border-t border-gray-400" />
        <SelectField
          label="モード"
          value={mode}
          options={modeOptions}
          onChange={(e) => {
            setMode(e.target.value);
          }}
        />
        <hr className="my-1 border-t border-gray-400" />
        <EnvSettings/>
        <hr className="my-1 border-t border-gray-400" />
        {mode == "spawn" && (
        <SpawnSettings/>
        )}
        {mode == "connection" && (
        <ConnectionSettings/>
        )}
      </div>
        {isSettingOpen && (
        <Draggable handle=".drag-handle" nodeRef={nodeRef} bounds="body">
          <div ref={nodeRef} className="absolute top-10 right-100 w-72 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
            <div className="drag-handle bg-gray-500 text-white px-4 py-2 flex justify-between items-center cursor-move text-sm font-semibold">
              <span>設定</span>
              <button
                onClick={() => setIsSettingOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <SettingPanel/>
          </div>
        </Draggable>
      )}
    </>
  )
}