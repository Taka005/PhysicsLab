"use client";

import { useEngine } from "@/context/EngineContext";
import { useEngineState } from "@/hooks/useEngineState";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import ToggleSwitch from "./ToggleSwitch";
import SliderField from "./SliderField";
import { useSpawnState } from "@/context/SpawnContext";
import { useConnectionState } from "@/context/ConnectionContext";

export default function SettingPanel() {
  const engine = useEngine();
  const state = useEngineState();
  const { updateSpawnConfig } = useSpawnState();
  const { updateConnectionConfig } = useConnectionState();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<"display" | "data">("display");

  if (!engine || !state) return null;

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
            description: "ファイル形式が不正です",
          });
        }
      } else {
        toast.error("ファイルの読み込みに失敗しました", {
          description: "選択された形式が正しくありません",
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
    <div className="p-4 flex flex-col gap-3 text-sm">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
      <div className="flex border-b border-gray-300">
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
              label="スクリプトの実行を許可"
              checked={state.isExecuteScript}
              onChange={(checked) => {
                engine.isExecuteScript = checked;
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
        </div>
      )}
    </div>
  );
}