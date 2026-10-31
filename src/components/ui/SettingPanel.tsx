"use client";

import { useEngine } from "@/context/EngineContext";
import { useEngineState } from "@/hooks/useEngineState";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import ToggleSwitch from "./ToggleSwitch";
import SliderField from "./SliderField";
import { useSpawnState } from "@/context/SpawnContext";
import { useConnectionState } from "@/context/ConnectionContext";

type SettingPanelProps = {
  onOpenScriptManager: () => void;
};

export default function SettingPanel({ onOpenScriptManager }: SettingPanelProps) {
  const engine = useEngine();
  const state = useEngineState();
  const { updateSpawnConfig } = useSpawnState();
  const { updateConnectionConfig } = useConnectionState();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"display" | "data">("display");

  if (!engine) return null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (typeof content === "string") {
        try {
          engine.import(content);
          toast.success("ファイルを読み込みました");
        } catch {
          toast.error("ファイルの読み込みに失敗しました", {
            description: "ファイル形式が不正です"
          });
        }
      } else {
        toast.error("ファイルの読み込みに失敗しました", {
          description: "選択された形式が正しくありません"
        });
      }
    };

    reader.readAsText(file);
    e.target.value = "";
  };

  const handleDownload = () => {
    const blob = new Blob([engine.export()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "world.json";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="p-4 flex flex-col gap-3 text-sm">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
        />
        <div className="flex border-b border-gray-400">
          <button
            onClick={() => setActiveTab("display")}
            className={`flex-1 pb-2 font-medium text-center transition-colors border-b-2 ${
              activeTab === "display"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            表示・モード設定
          </button>
          <button
            onClick={() => setActiveTab("data")}
            className={`flex-1 pb-2 font-medium text-center transition-colors border-b-2 ${
              activeTab === "data"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            データ・管理
          </button>
        </div>
        {activeTab === "display" && (
          <div className="flex flex-col gap-2">
            <div className="flex-1 gap-2">
              <ToggleSwitch
                label="トラッキングモード"
                checked={state.isTrackingMode}
                onChange={(checked) => {
                  engine.isTrackingMode = checked;
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <ToggleSwitch
                label="動的トラッキングモード"
                checked={state.isDynamicTrackingMode}
                onChange={(checked) => {
                  engine.isDynamicTrackingMode = checked;
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <ToggleSwitch
                label="グリッド交点設置モード"
                checked={state.isSetGridCrossMode}
                onChange={(checked) => {
                  engine.isSetGridCrossMode = checked;
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <ToggleSwitch
                label="グリッドを表示"
                checked={state.isDisplayGrid}
                onChange={(checked) => {
                  engine.viewport.isDisplayGrid = checked;
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <ToggleSwitch
                label="ベクトルを表示"
                checked={state.isDisplayVector}
                onChange={(checked) => {
                  engine.viewport.isDisplayVector = checked;
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <ToggleSwitch
                label="エッジを表示"
                checked={state.isDisplayEdge}
                onChange={(checked) => {
                  engine.viewport.isDisplayEdge = checked;
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <ToggleSwitch
                label="物体を非表示"
                checked={state.isHiddenBody}
                onChange={(checked) => {
                  engine.viewport.isHiddenBody = checked;
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <ToggleSwitch
                label="地面を非表示"
                checked={state.isHiddenGround}
                onChange={(checked) => {
                  engine.viewport.isHiddenGround = checked;
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <ToggleSwitch
                label="スクリプトを無効化"
                checked={state.isDisabledScript}
                onChange={(checked) => {
                  engine.isDisabledScript = checked;
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <ToggleSwitch
                label="デバッグモード"
                checked={state.isDebugMode}
                onChange={(checked) => {
                  engine.isDebugMode = checked;
                }}
              />
            </div>
            <hr className="my-1 border-t border-gray-400" />
            <div className="flex-1 gap-2">
              <SliderField
                label="グリッド間隔"
                value={state.gridWidth}
                min="5"
                max="100"
                step="5"
                onChange={(e) => {
                  engine.viewport.gridWidth = parseFloat(e.target.value);
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <SliderField
                label="トラッキング間隔"
                value={state.trackingInterval}
                min="100"
                max="3000"
                step="10"
                onChange={(e) => {
                  engine.trackingInterval = parseFloat(e.target.value);
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <SliderField
                label="最大トラッキング数"
                value={state.trackingLimit}
                min="10"
                max="1000"
                step="10"
                onChange={(e) => {
                  engine.trackingLimit = parseFloat(e.target.value);
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <SliderField
                label="スクリプト実行間隔"
                value={state.scriptExecuteInterval}
                min="10"
                max="1000"
                step="10"
                onChange={(e) => {
                  engine.scriptExecuteInterval = parseFloat(e.target.value);
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <SliderField
                label="ワールドサイズ"
                value={state.worldSize}
                min="1000"
                max="10000"
                step="100"
                onChange={(e) => {
                  engine.worldSize = parseFloat(e.target.value);
                }}
              />
            </div>
          </div>
        )}
        {activeTab === "data" && (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition focus:outline-none"
              >
                インポート
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 px-4 py-2 bg-lime-500 text-white rounded hover:bg-lime-600 transition focus:outline-none"
              >
                エクスポート
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  localStorage.setItem("worldData", engine.export());
                  toast.success("保存しました");
                }}
                className="flex-1 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition focus:outline-none"
              >
                保存
              </button>
              <button
                onClick={() => {
                  const worldData = localStorage.getItem("worldData");
                  if (worldData) {
                    try {
                      engine.import(worldData);
                      toast.success("ロードしました");
                    } catch {
                      toast.error("ファイルの読み込みに失敗しました", {
                        description: "ファイル形式が不正です",
                      });
                    }
                  } else {
                    toast.error("保存されたデータが存在しません");
                  }
                }}
                className="flex-1 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition focus:outline-none"
              >
                ロード
              </button>
            </div>
            <hr className="my-1 border-t border-gray-400" />
            <div className="flex gap-2">
              <button
                onClick={onOpenScriptManager}
                className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition focus:outline-none"
              >
                スクリプトマネージャー
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => engine.clearTrack()}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition focus:outline-none"
              >
                トラッキングを削除
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  updateSpawnConfig({
                    type: "circle",
                    diameter: 15,
                    mass: 10,
                    stiffness: 0.8,
                    width: 10,
                    velocityX: 0,
                    velocityY: 0,
                    scriptId: null
                  });

                  updateConnectionConfig({
                    type: "dynamic",
                    stiffness: 0.8,
                  });

                  engine.reset();
                }}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition focus:outline-none"
              >
                デフォルト設定に戻す
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  engine.clear(true);
                  toast.success("リセットしました");
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition focus:outline-none"
              >
                すべてリセット
              </button>
            </div>
            <hr className="my-1 border-t border-gray-400" />
            <div className="grid grid-rows-1 gap-2">
              <a
                href="https://github.com/Taka005/PhysicsLab/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl border border-gray-300 bg-white p-3 transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition-colors group-hover:bg-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.1c-3.1.67-3.75-1.31-3.75-1.31-.5-1.28-1.24-1.62-1.24-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15.99 1.7 2.59 1.21 3.22.93.1-.72.39-1.21.7-1.49-2.47-.28-5.07-1.24-5.07-5.49 0-1.21.43-2.2 1.15-2.98-.12-.28-.5-1.41.11-2.94 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.66.11 2.94.72.78 1.15 1.77 1.15 2.98 0 4.26-2.6 5.2-5.08 5.48.4.35.75 1.02.75 2.06v3.07c0 .3.2.65.76.54A11.1 11.1 0 0 0 12 .9Z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-gray-800">
                    GitHub
                  </p>
                  <p className="mt-1 truncate text-[10px] text-gray-400">
                    ソースコード
                  </p>
                </div>
                <span className="text-xs text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-500">
                  ↗
                </span>
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}