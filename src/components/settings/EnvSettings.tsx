import { useEngine } from "@/context/EngineContext";
import { useEngineState } from "@/hooks/useEngineState";
import SliderField from "../ui/SliderField";

export default function EnvSettings() {
  const engine = useEngine();
  const state = useEngineState();

  if (!engine) return null;

  return (
    <>
      <SliderField
        label="重力"
        help="円に働く下向きの重力加速度です。値を大きくすると、より速く落下します"
        value={state.gravity}
        min="0"
        max="1000"
        step="1"
        onChange={(value) => {
          engine.gravity = value;
        }}
      />
      <SliderField
        label="摩擦"
        help="円の速度を減衰させます。正の値は減速し、負の値は速度が増加します"
        value={state.friction}
        min="-0.3"
        max="0.3"
        step="0.001"
        onChange={(value) => {
          engine.friction = value;
        }}
      />
      <SliderField
        label="再生速度"
        help="シミュレーションの進行速度を調整します。物理計算の時間刻み自体はPPSで設定します"
        value={state.playBackSpeed}
        min="0.1"
        max="2"
        step="0.1"
        onChange={(value) => {
          engine.playBackSpeed = value;
        }}
      />
    </>
  );
}