"use client";

import { useEngine } from "@/context/EngineContext";
import { useEngineState } from "@/hooks/useEngineState";
import { ChangeEvent, useRef } from "react";
import { toast } from "sonner";

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
      </div>
    </>
  )
}