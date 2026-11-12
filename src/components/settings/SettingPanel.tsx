"use client";

import { useEngine } from "@/context/EngineContext";
import { useEngineState } from "@/hooks/useEngineState";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import ToggleSwitch from "../ui/ToggleSwitch";
import SliderField from "../ui/SliderField";
import { useSpawnState } from "@/context/SpawnContext";
import { useConnectionState } from "@/context/ConnectionContext";
import { useProtractor } from "@/context/ProtractorContext";
import { useCanvasExport } from "@/context/CanvasExportContext";

type SettingPanelProps = {
  onOpenScriptManager: () => void;
  onOpenWorldManager: () => void;
};

export default function SettingPanel({ onOpenScriptManager, onOpenWorldManager }: SettingPanelProps) {
  const engine = useEngine();
  const state = useEngineState();
  const { updateSpawnConfig } = useSpawnState();
  const { updateConnectionConfig } = useConnectionState();
  const { isProtractorVisible, setIsProtractorVisible } = useProtractor();
  const { exporter, gifRecorder } = useCanvasExport();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingControllerRef = useRef<AbortController | null>(null);
  const [activeTab, setActiveTab] = useState<"display" | "data">("display");
  const [isGifRecording, setIsGifRecording] = useState(false);

  if (!engine||!gifRecorder) return null;

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

  const handlePngDownload = async () => {
    if (!exporter) {
      toast.error("描画の準備ができていません");
      return;
    }

    try {
      const blob = await exporter();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "physics-lab.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      toast.error("描画を保存できませんでした", {
        description: error instanceof Error ? error.message : "不明なエラーが発生しました"
      });
    }
  };

  const handleGifRecord = async () => {
    if (recordingControllerRef.current) {
      recordingControllerRef.current.abort();
      return;
    }

    if (!gifRecorder) {
      toast.error("描画の準備ができていません");
      return;
    }

    const controller = new AbortController();
    recordingControllerRef.current = controller;

    setIsGifRecording(true);

    toast.info("録画を開始しました",{
      description: "最大10秒で自動的に保存します"
    });

    try {
      const blob = await gifRecorder(controller.signal);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "physics-lab.gif";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);

      toast.success("録画を終了しました");
    } catch (error) {
      toast.error("録画に失敗しました", {
        description: error instanceof Error ? error.message : "不明なエラーが発生しました"
      });
    } finally {
      recordingControllerRef.current = null;
      setIsGifRecording(false);
    }
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
            className={`flex-1 pb-2 font-medium text-center transition-colors border-b-2 focus:outline-none ${
              activeTab === "display"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            表示設定
          </button>
          <button
            onClick={() => setActiveTab("data")}
            className={`flex-1 pb-2 font-medium text-center transition-colors border-b-2 focus:outline-none ${
              activeTab === "data"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            データ管理
          </button>
        </div>
        {activeTab === "display" && (
          <div className="flex flex-col gap-2 h-[600px] overflow-y-auto scrollbar-none">
            <div className="flex-1 gap-2">
              <ToggleSwitch
                label="トラッキングモード"
                help="円の過去位置を残像として表示します。記録間隔や保持数は下のスライダーで調整できます"
                checked={state.isTrackingMode}
                onChange={(checked) => {
                  engine.isTrackingMode = checked;
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <ToggleSwitch
                label="動的トラッキングモード"
                help="円がない場合にトラッキング履歴を消去します。円がある場合は通常どおり移動履歴を記録します"
                checked={state.isDynamicTrackingMode}
                onChange={(checked) => {
                  engine.isDynamicTrackingMode = checked;
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <ToggleSwitch
                label="予測モード"
                help="現在の速度と重力から円の位置を予測して表示します。衝突や地面、接続の影響は予測に含まれません"
                checked={state.isPredictMode}
                onChange={(checked) => {
                  engine.isPredictMode = checked;
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <ToggleSwitch
                label="グリッド交点設置モード"
                help="配置や移動の位置をグリッド交点に吸着させます。グリッド線の表示設定とは独立しています"
                checked={state.isSetGridCrossMode}
                onChange={(checked) => {
                  engine.isSetGridCrossMode = checked;
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <ToggleSwitch
                label="グリッドを表示"
                help="キャンバスにグリッド線を表示します。配置位置を吸着させるには、別途グリッド交点設置モードを有効にします"
                checked={state.isDisplayGrid}
                onChange={(checked) => {
                  engine.viewport.isDisplayGrid = checked;
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <ToggleSwitch
                label="ベクトルを表示"
                help="円の速度ベクトルをキャンバスに表示します"
                checked={state.isDisplayVector}
                onChange={(checked) => {
                  engine.viewport.isDisplayVector = checked;
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <ToggleSwitch
                label="接続を表示"
                help="円同士をつなぐ接続線をキャンバスに表示します"
                checked={state.isDisplayConnection}
                onChange={(checked) => {
                  engine.viewport.isDisplayConnection = checked;
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <ToggleSwitch
                label="エッジを表示"
                help="直線・曲線・加速器の端点を表示します。移動モードで端点をドラッグして形状を編集できます"
                checked={state.isDisplayEdge}
                onChange={(checked) => {
                  engine.viewport.isDisplayEdge = checked;
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <ToggleSwitch
                label="角度計を表示"
                help="キャンバスに角度計を表示します。中央のハンドルをドラッグして位置を移動できます"
                checked={isProtractorVisible}
                onChange={setIsProtractorVisible}
              />
            </div>
            <div className="flex-1 gap-2">
              <ToggleSwitch
                label="物体を非表示"
                help="円の描画だけを隠します。円や物理計算は削除されません"
                checked={state.isHiddenBody}
                onChange={(checked) => {
                  engine.viewport.isHiddenBody = checked;
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <ToggleSwitch
                label="エフェクトを非表示"
                help="加速器の描画だけを隠します。加速器の効果は有効なままです"
                checked={state.isHiddenEffect}
                onChange={(checked) => {
                  engine.viewport.isHiddenEffect = checked;
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <ToggleSwitch
                label="地面を非表示"
                help="直線と曲線の描画だけを隠します。地面との衝突計算は有効なままです"
                checked={state.isHiddenGround}
                onChange={(checked) => {
                  engine.viewport.isHiddenGround = checked;
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <ToggleSwitch
                label="スクリプトを無効化"
                help="シミュレーション中のスクリプト実行を一時停止します。再度有効にすると実行が再開します"
                checked={state.isDisabledScript}
                onChange={(checked) => {
                  engine.isDisabledScript = checked;
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <ToggleSwitch
                label="デバッグモード"
                help="FPS、カーソル座標、オブジェクト数、カーソル位置のオブジェクト情報を表示します"
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
                help="グリッド線と、グリッド交点設置モードで吸着する間隔です"
                value={state.gridWidth}
                min="5"
                max="100"
                step="5"
                onChange={(value) => {
                  engine.viewport.gridWidth = value;
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <SliderField
                label="トラッキング間隔"
                help="円の位置をトラッキング履歴に記録する時間間隔（ミリ秒）です。短くすると細かい軌跡になります"
                value={state.trackingInterval}
                min="100"
                max="3000"
                step="10"
                onChange={(value) => {
                  engine.trackingInterval = value;
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <SliderField
                label="最大トラッキング数"
                help="保持するトラッキング履歴数の上限です。増やすと長い軌跡を表示できます"
                value={state.trackingLimit}
                min="10"
                max="1000"
                step="10"
                onChange={(value) => {
                  engine.trackingLimit = value;
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <SliderField
                label="最大予測数"
                help="予測モードで各円について表示する予測点数です。増やすと、より先の位置まで表示します"
                value={state.predictLimit}
                min="1"
                max="50"
                step="1"
                onChange={(value) => {
                  engine.predictLimit = value;
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <SliderField
                label="スクリプト実行間隔"
                help="スクリプトを実行するシミュレーション時間間隔（ミリ秒）です。短くすると更新が細かくなります"
                value={state.scriptExecuteInterval}
                min="10"
                max="1000"
                step="10"
                onChange={(value) => {
                  engine.scriptExecuteInterval = value;
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <SliderField
                label="ワールドサイズ"
                help="ワールド中心からの範囲を設定します。円の位置が境界を越えるとワールドから削除されます"
                value={state.worldSize}
                min="1000"
                max="10000"
                step="100"
                onChange={(value) => {
                  engine.worldSize = value;
                }}
              />
            </div>
            <div className="flex-1 gap-2">
              <SliderField
                label="PPS"
                help="1秒あたりの物理計算ステップ数です。大きくすると計算が細かくなりますが、処理負荷も増えます"
                value={state.pps}
                min="30"
                max="300"
                step="10"
                onChange={(value) => {
                  engine.pps = value;
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
                onClick={handlePngDownload}
                className="flex-1 px-3 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition focus:outline-none"
              >
                描画を保存
              </button>
              <button
                onClick={handleGifRecord}
                className="flex-1 px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGifRecording ? "停止して保存" : "録画"}
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onOpenScriptManager}
                className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition focus:outline-none"
              >
                スクリプトの管理
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onOpenWorldManager}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition focus:outline-none"
              >
                ワールドの管理
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
                onClick={() => engine.scriptManager.resetMap()}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition focus:outline-none"
              >
                グローバル変数をリセット
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
            <div className="grid grid-rows-1 gap-2">
              <a
                href="/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-xl border border-gray-300 bg-white p-3 transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-700 transition-colors group-hover:bg-gray-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M9.6 9a2.45 2.45 0 1 1 4.1 1.8c-1 .9-1.7 1.3-1.7 2.7M12 17h.01" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-gray-800">
                    ヘルプ
                  </p>
                  <p className="mt-1 truncate text-[10px] text-gray-400">
                    ドキュメンテーション
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