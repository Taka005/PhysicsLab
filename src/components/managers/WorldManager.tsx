"use client";

import { useEngine } from "@/context/EngineContext";
import { useEffect, useState, type MouseEvent } from "react";
import { toast } from "sonner";

const STORAGE_KEY = "worldManagerSlots";
const SLOT_COUNT = 5;

export default function WorldManagerPanel() {
  const engine = useEngine();
  const [slots, setSlots] = useState<(string | null)[]>(()=>Array(SLOT_COUNT).fill(null));

  if (!engine) return null;

  const isValidSlots = (value: unknown): value is (string | null)[]=>{
    if(
      Array.isArray(value) &&
      value.length <= SLOT_COUNT &&
      value.every((slot) => slot === null || typeof slot === "string")
    ){
      try{
        (value as (string | null)[]).forEach(data=>{
          if(data !== null){
            engine.parseValidData(data);
          }
        });

        return true;
      }catch{
        return false;
      }
    }else{
      return false;
    }
  }

  useEffect(() => {
    try {
      const savedSlots = localStorage.getItem(STORAGE_KEY);
      if (!savedSlots) return;

      const parsed: unknown = JSON.parse(savedSlots);
      if (!isValidSlots(parsed)) {
        toast.error("セーブデータの形式が不正です");
        return;
      }

      setSlots([...parsed, ...Array(SLOT_COUNT - parsed.length).fill(null)]);
    } catch (error) {
      toast.error("セーブデータを読み込めませんでした", {
        description: error instanceof Error ? error.message : "不明なエラーが発生しました"
      });
    }
  }, []);

  const persistSlots = (nextSlots: (string | null)[]) => {
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

  const handleSave = (index: number) => {
    try {
      const nextSlots = [...slots];
      nextSlots[index] = engine.export();

      if (persistSlots(nextSlots)) {
        toast.success("保存しました");
      }
    } catch (error) {
      toast.error("ワールドの保存に失敗しました", {
        description: error instanceof Error ? error.message : "不明なエラーが発生しました",
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
        description:
          error instanceof Error ? error.message : "不明なエラーが発生しました",
      });
    }
  };

  const handleDelete = (
    index: number,
    event: MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    if (!slots[index]) return;

    const nextSlots = [...slots];
    nextSlots[index] = null;
    if (persistSlots(nextSlots)) {
      toast.success("削除しました");
    }
  };

  const SlotField = ({
    slot,
    index
  }:{ 
    slot: string | null;
    index: number
  })=>{
    if(slot){
      return (
        <div className="group flex items-center h-10 font-semibold justify-between gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors bg-gray-50/60 hover:bg-gray-100/70 border border-gray-300">
          <span className="truncate flex-1 ml-2 text-gray-600 hover:text-gray-700">
            保存済み
          </span>
          <button
            type="button"
            onClick={(event) => handleLoad(index, event)}
            disabled={!slot}
            className="text-blue-500 hover:text-blue-600 p-1 transition-colors focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ロード
          </button>
          <button
            type="button"
            onClick={(event) => handleDelete(index, event)}
            disabled={!slot}
            className="text-red-500 hover:text-red-600 p-1 transition-colors focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
          >
            削除
          </button>
        </div>
      )
    }else{
      return (
        <div
          onClick={() => handleSave(index)}
          className="group flex items-center h-10 font-semibold justify-between gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors hover:bg-blue-50/30 border border-dashed border-blue-400"
        >
          <span className="truncate flex-1 ml-2 text-blue-500 hover:text-blue-600 text-center">
            ＋
          </span>
        </div>
      )
    }
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-1">
      {slots.map((slot, index) => (
        <SlotField slot={slot} index={index} key={index}/>
      ))}
    </div>
  );
}