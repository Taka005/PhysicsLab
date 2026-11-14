import { useEngine } from "@/context/EngineContext";
import SliderField from "../ui/SliderField";
import { useEditState } from "@/context/EditContext";
import ColorPicker from "../ui/ColorPicker";
import SelectField from "../ui/SelectField";
import { useScriptState } from "@/hooks/useScriptState";

export default function EditSettings() {
  const engine = useEngine();
  const { scripts } = useScriptState();
  const { selectedObjectId, editConfig, updateEditConfig, selectedObjectType } = useEditState();

  if (!engine||!selectedObjectId) return null;

  return (
    <>
      {(selectedObjectType === "circle") && (
        <>
          <SliderField
            label="直径"
            value={editConfig.diameter ?? 15}
            min="1"
            max="100"
            step="1"
            help="値を小さくしすぎると高速時に貫通しやすくなります"
            onChange={(value) => {
              updateEditConfig({ diameter: value });
            }}
          />
          <SliderField
            label="質量"
            value={editConfig.mass ?? 10}
            min="0"
            max="100"
            step="1"
            help="値が大きくなるほど、衝突時に動きにくくなり、摩擦の影響が増えます"
            onChange={(value) => {
              updateEditConfig({ mass: value });
            }}
          />
          <SliderField
            label="剛性"
            value={editConfig.stiffness ?? 0.8}
            min="0.1"
            max="1"
            step="0.1"
            help="値が大きくなると物体が固くなり、衝突時に素早く干渉状態から戻ります"
            onChange={(value) => {
              updateEditConfig({ stiffness: value });
            }}
          />
          <SliderField
            label="初速度X"
            value={Math.floor((editConfig.velocityX ?? 0)*100)/100}
            min="-500"
            max="500"
            step="1"
            help="右方向が正の値になります"
            onChange={(value) => {
              updateEditConfig({ velocityX: value });
            }}
          />
          <SliderField
            label="初速度Y"
            value={Math.floor((editConfig.velocityY ?? 0)*100)/100}
            min="-500"
            max="500"
            step="1"
            help="下方向が正の値になります"
            onChange={(value) => {
              updateEditConfig({ velocityY: value });
            }}
          />
        </>
      )}
      {(selectedObjectType === "line" || selectedObjectType === "curve") && (
        <>
          <SliderField
            label="幅"
            value={editConfig.width ?? 10}
            min="1"
            max="50"
            step="1"
            help="値を小さくしすぎると高速物体が貫通しやすくなります"
            onChange={(value) => {
              updateEditConfig({ width: value });
            }}
          />
        </>
      )}
      {(selectedObjectType === "booster") && (
        <>
          <SliderField
            label="初速度X"
            value={Math.floor((editConfig.velocityX ?? 0)*100)/100}
            min="-500"
            max="500"
            step="1"
            help="右方向が正の値になります"
            onChange={(value) => {
              updateEditConfig({ velocityX: value });
            }}
          />
          <SliderField
            label="初速度Y"
            value={Math.floor((editConfig.velocityY ?? 0)*100)/100}
            min="-500"
            max="500"
            step="1"
            help="下方向が正の値になります"
            onChange={(value) => {
              updateEditConfig({ velocityY: value });
            }}
          />
        </>
      )}
      <ColorPicker
        label="カラー"
        value={editConfig.color}
        onChange={(value) => {
          updateEditConfig({ color: value });
        }}
      />
      <SelectField
        label="スクリプト"
        value={editConfig.scriptId || ""}
        options={[{ label: "なし", value: ""},...scripts.map(script=>({ label: script.name, value: script.id }))]}
        onChange={(value) => {
          updateEditConfig({ scriptId: value !== "" ? value : null });
        }}
      />
    </>
  );
}