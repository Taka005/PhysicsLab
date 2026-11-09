"use client";

import { useEngine } from "@/context/EngineContext";
import { useEffect, useState, MouseEvent } from "react";
import { toast } from "sonner";

const STORAGE_KEY = "saveDataSlots";
const MAX_SLOT = 5;
const PRESET_SLOT = 3;

export default function WorldManagerPanel() {
  const engine = useEngine();
  const [slots, setSlots] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"save" | "preset">("save");

  if (!engine) return null;

  useEffect(() => {
    try {
      const savedSlots = localStorage.getItem(STORAGE_KEY);
      if (!savedSlots) return;

      const parsed = JSON.parse(savedSlots);

      if(
        Array.isArray(parsed) &&
        parsed.length <= MAX_SLOT &&
        parsed.every((slot) =>typeof slot === "string")
      ){
        parsed.forEach(data=>{
          engine.parseValidData(data);
        });

        setSlots(parsed);
      }else{
        toast.error("セーブデータの形式が不正です");
      }
    } catch (error) {
      toast.error("セーブデータを読み込めませんでした", {
        description: error instanceof Error ? error.message : "不明なエラーが発生しました"
      });
    }
  }, []);

  const updateSlots = (nextSlots: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSlots));

      setSlots(nextSlots);

      return true;
    } catch (error) {
      toast.error("保存できませんでした", {
        description: error instanceof Error ? error.message : "不明なエラーが発生しました",
      });

      return false;
    }
  };

  const handleSave = () => {
    try {
      const nextSlots = [...slots];
      nextSlots.push(engine.export());

      if (updateSlots(nextSlots)) {
        toast.success("保存しました");
      }
    } catch (error) {
      toast.error("ワールドの保存に失敗しました", {
        description: error instanceof Error ? error.message : "不明なエラーが発生しました"
      });
    }
  };

  const handleLoad = (index: number, event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    const data = slots[index];
    if (!data) return;

    try {
      engine.import(data);

      toast.success("ロードしました");
    } catch (error) {
      toast.error("ワールドの読み込みに失敗しました", {
        description: error instanceof Error ? error.message : "不明なエラーが発生しました"
      });
    }
  };

  const handlePresetLoad = async (index: number, event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    try {
      const response = await fetch(`/preset/${index + 1}.json`);
      if (!response.ok) {
        throw new Error(`ファイルの取得に失敗しました (ステータス: ${response.status})`);
      }

      const data = await response.text();

      engine.import(data);

      toast.success("ロードしました");
    } catch (error) {
      toast.error("ワールドの読み込みに失敗しました", {
        description: error instanceof Error ? error.message : "不明なエラーが発生しました"
      });
    }
  };

  const handleDelete = (
    index: number,
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    const nextSlots = [...slots];
    nextSlots.splice(index, 1);

    if (updateSlots(nextSlots)) {
      toast.success("削除しました");
    }
  };

  return (
    <div className="p-4 flex flex-col gap-3 text-sm">
      <div className="flex border-b border-gray-400">
        <button
          onClick={() => setActiveTab("save")}
          className={`flex-1 pb-2 font-medium text-center transition-colors border-b-2 focus:outline-none ${
            activeTab === "save"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          セーブ管理
        </button>
        <button
          onClick={() => setActiveTab("preset")}
          className={`flex-1 pb-2 font-medium text-center transition-colors border-b-2 focus:outline-none ${
            activeTab === "preset"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          プリセット
        </button>
      </div>
      {activeTab === "save" && (
      <div className="flex flex-col gap-1">
        {slots.map((slot, index) => (
        <div
          key={index}
          className="group flex items-center h-10 font-semibold justify-between gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors bg-gray-50/60 hover:bg-gray-100/70 border border-gray-300"
        >
          <span className="truncate flex-1 ml-2 text-gray-600 hover:text-gray-700">
            保存済み
          </span>
          <button
            type="button"
            onClick={(event) => handleLoad(index, event)}
            disabled={!slot}
            className="text-blue-500 hover:text-blue-600 p-1 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ロード
          </button>
          <button
            type="button"
            onClick={(event) => handleDelete(index, event)}
            disabled={!slot}
            className="text-red-500 hover:text-red-600 p-1 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
          >
            削除
          </button>
        </div>
        ))}
        {slots.length < MAX_SLOT && (
        <div
          onClick={() => handleSave()}
          className="group flex items-center h-10 font-semibold justify-between gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors hover:bg-blue-50/30 border border-dashed border-blue-400"
        >
          <span className="truncate flex-1 ml-2 text-blue-500 hover:text-blue-600 text-center">
            ＋ セーブデータを追加
          </span>
        </div>
        )}
      </div>
      )}
      {activeTab === "preset" && (
        <div className="flex flex-col gap-1">
          {Array.from({ length: PRESET_SLOT }).map((_,index)=>(
          <div
            key={index}
            className="group flex items-center h-10 font-semibold justify-between gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors bg-gray-50/60 hover:bg-gray-100/70 border border-gray-300"
          >
            <span className="truncate flex-1 ml-2 text-gray-600 hover:text-gray-700">
              プリセット {index + 1}
            </span>
            <button
              type="button"
              onClick={(event) => handlePresetLoad(index, event)}
              className="text-blue-500 hover:text-blue-600 p-1 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ロード
            </button>
          </div>
          ))}
        </div>
      )}
    </div>
  );
}