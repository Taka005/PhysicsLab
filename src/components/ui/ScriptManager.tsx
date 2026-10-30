"use client";

import { useEngine } from "@/context/EngineContext";
import { MouseEvent, useState } from "react";
import { Script } from "@/lib/engine";
import { useScriptState } from "@/hooks/useScriptState";

export default function ScriptManagerPanel() {
  const engine = useEngine();
  const { scripts } = useScriptState();
  const [selectedScriptId, setSelectedScriptId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftCode, setDraftCode] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!engine) return null;

  const handleSelectScript = (script: Script) => {
    setIsCreatingNew(false);
    setSelectedScriptId(script.id);
    setDraftName(script.name);
    setDraftCode(script.code);
    setErrorMessage("");
  };

  const handleStartCreate = () => {
    setIsCreatingNew(true);
    setSelectedScriptId(null);
    setDraftName("");
    setDraftCode("init {\n\n}\n\nupdate {\n\n}");
    setErrorMessage("");
  };

  const handleSave = () => {
    if (!draftName.trim()) {
      setErrorMessage("スクリプト名を入力してください");
      return;
    }

    try {
      if(isCreatingNew){
        const newScript = engine.scriptManager.register(draftName.trim(), draftCode);

        setSelectedScriptId(newScript.id);
        setIsCreatingNew(false);
        setDraftName(newScript.name);
        setDraftCode(newScript.code);
      }else if(selectedScriptId){
        const script = engine.scriptManager.get(selectedScriptId);

        if (!script) {
          setErrorMessage("対象のスクリプトが見つかりません");
          return;
        }

        script.name = draftName.trim();
        script.code = draftCode;
      }

      setErrorMessage("");
    }catch(error){
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "スクリプトの保存に失敗しました"
      );

    }
  };

  const handleDeleteScript = (id: string, e: MouseEvent) => {
    e.stopPropagation();

    if(!engine.scriptManager.remove(id)) return;

    if (selectedScriptId === id) {
      setSelectedScriptId(null);
      setDraftName("");
      setDraftCode("");
      setIsCreatingNew(false);
    }

    setErrorMessage("");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
          <div className="p-3 border-b border-gray-200 bg-white">
            <button
              onClick={handleStartCreate}
              className={`w-full py-2 px-3 text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white focus:outline-none`}
            >
              <span>＋ 新規作成</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {scripts.length === 0 ? (
              <p className="text-center text-xs text-gray-400 mt-4">
                保存されたスクリプトがありません
              </p>
            ) : (
              scripts.map((script) => {
                const isSelected = !isCreatingNew && selectedScriptId === script.id;

                return (
                  <div
                    key={script.id}
                    onClick={() => handleSelectScript(script)}
                    className={`group flex items-center font-semibold justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                        : "text-gray-700 hover:bg-gray-200/60 border border-gray-200"
                    }`}
                  >
                  <span className="truncate flex-1">{script.name}</span>
                    <button
                      onClick={(e) => handleDeleteScript(script.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 p-1 transition-opacity focus:outline-none"
                    >
                      削除
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div className="w-2/3 flex flex-col bg-white">
          {selectedScriptId || isCreatingNew ? (
            <>
              <div className="px-4 py-2 border-b border-gray-200 bg-gray-50 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-xs font-semibold text-gray-500">スクリプト名:</span>
                  <input
                    type="text"
                    value={draftName}
                    maxLength={30}
                    onChange={(e) => setDraftName(e.target.value)}
                    className="px-2 py-1 bg-white border border-gray-300 rounded text-xs font-mono text-gray-800 shadow-inner focus:outline-none flex-1"
                  />
                </div>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded shadow-sm transition-colors focus:outline-none"
                >
                  保存
                </button>
              </div>
              <div className="flex-1 p-4 flex flex-col">
                <textarea
                  value={draftCode}
                  onChange={(e) => setDraftCode(e.target.value)}
                  placeholder="init {&#10;&#10;}&#10;&#10;update {&#10;&#10;}"
                  className="w-full flex-1 p-3 bg-gray-900 text-gray-100 font-mono text-xs rounded-lg shadow-inner border border-gray-700 resize-none focus:outline-none leading-relaxed"
                  spellCheck={false}
                />
                {errorMessage && (
                  <p className="mt-2 text-xs text-red-600 whitespace-pre-wrap">
                    {errorMessage}
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-xs">
              スクリプトを選択するか、新しく作成してください
            </div>
          )}
        </div>
      </div>
    </div>
  );
}