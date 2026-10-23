"use client";

import { useEngine } from "@/context/EngineContext";
import { useEngineState } from "@/hooks/useEngineState";
import { ChangeEvent, useRef } from "react";
import { toast } from "sonner";
import ToggleSwitch from "./ToggleSwitch";
import SliderField from "./SliderField";

export default function SettingPanel() {
  const engine = useEngine();
  const state = useEngineState();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!engine||!state) return null;

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (typeof content === "string") {
        try{
          engine.import(content);

          toast.success("ファイルを読み込みました");
        }catch{
          toast.error("ファイルの読み込みに失敗しました", {
            description: "ファイル形式が不正です"
          });
        }
      }else{
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
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition"
          >
            インポート
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 px-4 py-2 bg-lime-500 text-white rounded hover:bg-lime-600 transition"
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
            className="flex-1 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition"
          >
            保存
          </button>
          <button
            onClick={() => {
              const worldData = localStorage.getItem("worldData");
              if (worldData) {
                try{
                  engine.import(worldData);

                  toast.success("ロードしました");
                }catch{
                  toast.error("ファイルの読み込みに失敗しました", {
                    description: "ファイル形式が不正です"
                  });
                }
              }else{
                toast.error("保存されたデータが存在しません");
              }
            }}
            className="flex-1 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
          >
            ロード
          </button>
        </div>
        <hr className="my-1 border-t border-gray-400" />
        <div className="flex-1 gap-2">
          <ToggleSwitch
            label="トラッキングモード"
            checked={state.isTrackingMode}
            onChange={(checked) =>{
              engine.isTrackingMode = checked;
            }}
          />
        </div>
        <div className="flex-1 gap-2">
          <ToggleSwitch
            label="動的トラッキングモード"
            checked={state.isDynamicTrackingMode}
            onChange={(checked) =>{
              engine.isDynamicTrackingMode = checked
            }}
          />
        </div>
        <div className="flex-1 gap-2">
          <ToggleSwitch
            label="グリッド交点設置モード"
            checked={state.isSetGridCrossMode}
            onChange={(checked) =>{
              engine.isSetGridCrossMode = checked
            }}
          />
        </div>
        <div className="flex-1 gap-2">
          <ToggleSwitch
            label="グリッドを表示"
            checked={state.isDisplayGrid}
            onChange={(checked) =>{
              engine.viewport.isDisplayGrid = checked
            }}
          />
        </div>
        <div className="flex-1 gap-2">
          <ToggleSwitch
            label="ベクトルを表示"
            checked={state.isDisplayVector}
            onChange={(checked) =>{
              engine.viewport.isDisplayVector = checked
            }}
          />
        </div>
        <div className="flex-1 gap-2">
          <ToggleSwitch
            label="エッジを表示"
            checked={state.isDisplayEdge}
            onChange={(checked) =>{
              engine.viewport.isDisplayEdge = checked
            }}
          />
        </div>
        <div className="flex-1 gap-2">
          <ToggleSwitch
            label="デバッグモード"
            checked={state.isDebugMode}
            onChange={(checked) =>{
              engine.isDebugMode = checked
            }}
          />
        </div>
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
        <hr className="my-1 border-t border-gray-400" />
        <div className="flex gap-2">
          <button
            onClick={()=>engine.clearTrack()}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            トラッキングを削除
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={()=>engine.reset()}
            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            デフォルト設定に戻す
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={()=>{
              engine.clear(true);

              toast.success("リセットしました");
            }}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            すべてリセット
          </button>
        </div>
      </div>
    </>
  )
}