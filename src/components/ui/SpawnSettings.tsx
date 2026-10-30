import { useEngine } from "@/context/EngineContext";
import { useEngineState } from "@/hooks/useEngineState";
import SliderField from "./SliderField";
import { useSpawnState } from "@/context/SpawnContext";
import SelectField from "./SelectField";
import ColorPicker from "./ColorPicker";
import InputField from "./InputField";
import { useScriptState } from "@/hooks/useScriptState";

export default function SpawnSettings() {
  const engine = useEngine();
  const state = useEngineState();
  const { scripts } = useScriptState();
  const { spawnConfig, updateSpawnConfig } = useSpawnState();

  const ObjectOptions = [
    { label: "円", value: "circle" },
    { label: "直線", value: "line" },
    { label: "曲線", value: "curve" },
  ];

  if (!engine||!state) return null;

  return (
    <>
      <SelectField
        label="生成タイプ"
        value={spawnConfig.type}
        options={ObjectOptions}
        onChange={(value) => {
          updateSpawnConfig({ type: value });
        }}
      />
      <InputField
        label="ID"
        value={spawnConfig.id ?? ""}
        onChange={(e) => {
          updateSpawnConfig({ id: e.target.value });
        }}
        placeholder="(任意)"
        required={false}
      />
      {spawnConfig.type === "circle" && (
        <>
          <SliderField
            label="直径"
            value={spawnConfig.diameter ?? 15}
            min="0"
            max="100"
            step="1"
            onChange={(e) => {
              updateSpawnConfig({ diameter: parseFloat(e.target.value) });
            }}
          />
          <SliderField
            label="質量"
            value={spawnConfig.mass ?? 10}
            min="0"
            max="100"
            step="1"
            onChange={(e) => {
              updateSpawnConfig({ mass: parseFloat(e.target.value) });
            }}
          />
          <SliderField
            label="剛性"
            value={spawnConfig.stiffness ?? 0.8}
            min="0.1"
            max="1"
            step="0.1"
            onChange={(e) => {
              updateSpawnConfig({ stiffness: parseFloat(e.target.value) });
            }}
          />
          <SliderField
            label="初速度X"
            value={spawnConfig.velocityX ?? 0}
            min="-300"
            max="300"
            step="1"
            onChange={(e) => {
              updateSpawnConfig({ velocityX: parseFloat(e.target.value) });
            }}
          />
          <SliderField
            label="初速度Y"
            value={spawnConfig.velocityY ?? 0}
            min="-300"
            max="300"
            step="1"
            onChange={(e) => {
              updateSpawnConfig({ velocityY: parseFloat(e.target.value) });
            }}
          />
        </>
      )}
      {(spawnConfig.type === "line" || spawnConfig.type === "curve") && (
        <>
          <SliderField
            label="幅"
            value={spawnConfig.width ?? 10}
            min="1"
            max="50"
            step="1"
            onChange={(e) => {
              updateSpawnConfig({ width: parseFloat(e.target.value) });
            }}
          />
        </>
      )}
      <ColorPicker
        label="カラー"
        value={spawnConfig.color}
        onChange={(value) => {
          updateSpawnConfig({ color: value });
        }}
      />
      <SelectField
        label="スクリプト"
        value={spawnConfig.scriptId || ""}
        options={[{ label: "なし", value: ""},...scripts.map(script=>({ label: script.name, value: script.id }))]}
        onChange={(value) => {
          updateSpawnConfig({ scriptId: value !== "" ? value : null });
        }}
      />
    </>
  );
}