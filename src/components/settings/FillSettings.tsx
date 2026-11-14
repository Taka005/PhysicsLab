import { useEngine } from "@/context/EngineContext";
import SliderField from "../ui/SliderField";
import { useFillState } from "@/context/FillContext";
import SelectField from "../ui/SelectField";
import ColorPicker from "../ui/ColorPicker";
import { useScriptState } from "@/hooks/useScriptState";

export default function FillSettings() {
  const engine = useEngine();
  const { scripts } = useScriptState();
  const { fillConfig, updateFillConfig } = useFillState();

  const ObjectOptions = [
    { label: "円", value: "circle" }
  ];

  if (!engine) return null;

  return (
    <>
      <SelectField
        label="生成タイプ"
        value={fillConfig.type}
        options={ObjectOptions}
        onChange={(value) => {
          updateFillConfig({ type: value });
        }}
      />
      {fillConfig.type === "circle" && (
        <>
          <SliderField
            label="直径"
            value={fillConfig.diameter ?? 15}
            min="1"
            max="100"
            step="1"
            help="値を大きくすると高速時に貫通しにくくなります"
            onChange={(value) => {
              updateFillConfig({ diameter: value });
            }}
          />
          <SliderField
            label="質量"
            value={fillConfig.mass ?? 10}
            min="0"
            max="100"
            step="1"
            help="値が大きくなるほど、衝突時に動きにくくなり、摩擦の影響が増えます"
            onChange={(value) => {
              updateFillConfig({ mass: value });
            }}
          />
          <SliderField
            label="剛性"
            value={fillConfig.stiffness ?? 0.8}
            min="0.1"
            max="1"
            step="0.1"
            help="値が大きくなると物体が固くなり、衝突時に素早く干渉状態から戻ります"
            onChange={(value) => {
              updateFillConfig({ stiffness: value });
            }}
          />
          <SliderField
            label="初速度X"
            value={fillConfig.velocityX ?? 0}
            min="-300"
            max="300"
            step="1"
            help="右方向が正の値になります"
            onChange={(value) => {
              updateFillConfig({ velocityX: value });
            }}
          />
          <SliderField
            label="初速度Y"
            value={fillConfig.velocityY ?? 0}
            min="-300"
            max="300"
            step="1"
            help="下方向が正の値になります"
            onChange={(value) => {
              updateFillConfig({ velocityY: value });
            }}
          />
        </>
      )}
      <ColorPicker
        label="カラー"
        value={fillConfig.color}
        onChange={(value) => {
          updateFillConfig({ color: value });
        }}
      />
      <SelectField
        label="スクリプト"
        value={fillConfig.scriptId || ""}
        options={[{ label: "なし", value: ""},...scripts.map(script=>({ label: script.name, value: script.id }))]}
        onChange={(value) => {
          updateFillConfig({ scriptId: value !== "" ? value : null });
        }}
      />
    </>
  );
}