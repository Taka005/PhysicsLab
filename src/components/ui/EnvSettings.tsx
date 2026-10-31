import { useEngine } from "@/context/EngineContext";
import { useEngineState } from "@/hooks/useEngineState";
import SliderField from "./SliderField";

export default function EnvSettings() {
  const engine = useEngine();
  const state = useEngineState();

  if (!engine) return null;

  return (
    <>
      <SliderField
        label="重力"
        value={state.gravity}
        min="0"
        max="1000"
        step="1"
        onChange={(e) => {
          const val = parseFloat(e.target.value);
          engine.gravity = val;
        }}
      />
      <SliderField
        label="摩擦"
        value={state.friction}
        min="-0.3"
        max="0.3"
        step="0.001"
        onChange={(e) => {
          const val = parseFloat(e.target.value);
          engine.friction = val;
        }}
      />
      <SliderField
        label="再生速度"
        value={state.playBackSpeed}
        min="0.1"
        max="2"
        step="0.1"
        onChange={(e) => {
          const val = parseFloat(e.target.value);
          engine.playBackSpeed = val;
        }}
      />
    </>
  );
}