import { useEngine } from "@/context/EngineContext";
import { useEngineState } from "@/hooks/useEngineState";
import { useState } from "react";
import SliderField from "./SliderField";

export default function EnvSettings() {
  const engine = useEngine();
  const state = useEngineState();
  const [gravityValue, setGravityValue] = useState<number>(state.gravity);
  const [frictionValue, setFrictionValue] = useState<number>(state.friction);
  const [playBackSpeedValue, setPlayBackSpeedValue] = useState<number>(state.playBackSpeed);

  if (!engine||!state) return null;

  return (
    <>
      <SliderField
        label="重力"
        value={gravityValue}
        min="0"
        max="1000"
        step="1"
        onChange={(e) => {
          const val = parseFloat(e.target.value);
          setGravityValue(val);
          engine.gravity = val;
        }}
      />
      <SliderField
        label="摩擦"
        value={frictionValue}
        min="-0.5"
        max="0.5"
        step="0.001"
        onChange={(e) => {
          const val = parseFloat(e.target.value);
          setFrictionValue(val);
          engine.friction = val;
        }}
      />
      <SliderField
        label="再生速度"
        value={playBackSpeedValue}
        min="0.1"
        max="2"
        step="0.1"
        onChange={(e) => {
          const val = parseFloat(e.target.value);
          setPlayBackSpeedValue(val);
          engine.playBackSpeed = val;
        }}
      />
    </>
  );
}