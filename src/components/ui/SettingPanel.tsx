"use client";

import { useEngine } from "@/context/EngineContext";
import { useEngineState } from "@/hooks/useEngineState";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import ToggleSwitch from "./ToggleSwitch";

export default function SettingPanel() {
  const engine = useEngine();
  const state = useEngineState();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isTrackingMode, setIsTrackingMode] = useState<boolean>(state.isTrackingMode);
  const [isDynamicTrackingMode, setIsDynamicTrackingMode] = useState<boolean>(state.isDynamicTrackingMode);
  const [isDebugMode, setIsDebugMode] = useState<boolean>(state.isDebugMode);
  const [isSetGridCrossMode, setIsSetGridCrossMode] = useState<boolean>(state.isSetGridCrossMode);
  const [isDisplayGrid, setIsDisplayGrid] = useState<boolean>(state.isDisplayGrid);
  const [isDisplayVector, setIsDisplayVector] = useState<boolean>(state.isDisplayVector);

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
        <hr className="my-1 border-t border-gray-400" />
        <div className="flex gap-2">
          <ToggleSwitch
            label="トラッキングモード"
            checked={isTrackingMode}
            onChange={(checked) =>{
              setIsTrackingMode(checked);
              engine.isTrackingMode = checked
            }}
          />
        </div>
        <div className="flex gap-2">
          <ToggleSwitch
            label="動的トラッキングモード"
            checked={isDynamicTrackingMode}
            onChange={(checked) =>{
              setIsDynamicTrackingMode(checked);
              engine.isDynamicTrackingMode = checked
            }}
          />
        </div>
        <div className="flex gap-2">
          <ToggleSwitch
            label="グリッド交点設置モード"
            checked={isSetGridCrossMode}
            onChange={(checked) =>{
              setIsSetGridCrossMode(checked);
              engine.isSetGridCrossMode = checked
            }}
          />
        </div>
        <div className="flex gap-2">
          <ToggleSwitch
            label="デバッグモード"
            checked={isDebugMode}
            onChange={(checked) =>{
              setIsDebugMode(checked);
              engine.isDebugMode = checked
            }}
          />
        </div>
        <div className="flex gap-2">
          <ToggleSwitch
            label="グリッド表示"
            checked={isDisplayGrid}
            onChange={(checked) =>{
              setIsDisplayGrid(checked);
              engine.viewport.isDisplayGrid = checked
            }}
          />
        </div>
        <div className="flex gap-2">
          <ToggleSwitch
            label="ベクトル表示"
            checked={isDisplayVector}
            onChange={(checked) =>{
              setIsDisplayVector(checked);
              engine.viewport.isDisplayGrid = checked
            }}
          />
        </div>
        <hr className="my-1 border-t border-gray-400" />
        <div className="flex gap-2">
          <button
            onClick={()=>engine.clear(true)}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            すべてリセット
          </button>
        </div>
      </div>
    </>
  )
}