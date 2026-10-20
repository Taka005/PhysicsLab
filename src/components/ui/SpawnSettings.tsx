import { useEngine } from "@/context/EngineContext";
import { useEngineState } from "@/hooks/useEngineState";
import SliderField from "./SliderField";
import { useSpawnState } from "@/context/SpawnContext";
import { useState } from "react";
import SelectField from "./SelectField";

export default function SpawnSettings() {
  const engine = useEngine();
  const state = useEngineState();
  const { spawnConfig, updateSpawnConfig } = useSpawnState();
  const [selectedShape, setSelectedShape] = useState<string>("circle");

  const shapeOptions = [
    { label: "円", value: "circle" },
    { label: "直線", value: "line" },
  ];
  
  if (!engine||!state) return null;

  return (
    <>
      <SelectField
        label="生成するオブジェクト"
        value={selectedShape}
        options={shapeOptions}
        onChange={(e) => {
          setSelectedShape(e.target.value);
        }}
      />
      <SliderField
        label="直径"
        value={spawnConfig.diameter}
        min="0"
        max="100"
        step="1"
        onChange={(e) => {
          updateSpawnConfig({ diameter: parseFloat(e.target.value) });
        }}
      />
      <SliderField
        label="質量"
        value={spawnConfig.mass}
        min="0"
        max="100"
        step="1"
        onChange={(e) => {
          updateSpawnConfig({ mass: parseFloat(e.target.value) });
        }}
      />
      <SliderField
        label="剛性"
        value={spawnConfig.stiffness}
        min="0.1"
        max="1"
        step="0.1"
        onChange={(e) => {
          updateSpawnConfig({ stiffness: parseFloat(e.target.value) });
        }}
      />
    </>
  );
}