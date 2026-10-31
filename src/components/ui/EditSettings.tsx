import { useEngine } from "@/context/EngineContext";
import SliderField from "./SliderField";
import { useEditState } from "@/context/EditContext";
import ColorPicker from "./ColorPicker";
import SelectField from "./SelectField";
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
            onChange={(e) => {
              updateEditConfig({ diameter: parseFloat(e.target.value) });
            }}
          />
          <SliderField
            label="質量"
            value={editConfig.mass ?? 10}
            min="0"
            max="100"
            step="1"
            onChange={(e) => {
              updateEditConfig({ mass: parseFloat(e.target.value) });
            }}
          />
          <SliderField
            label="剛性"
            value={editConfig.stiffness ?? 0.8}
            min="0.1"
            max="1"
            step="0.1"
            onChange={(e) => {
              updateEditConfig({ stiffness: parseFloat(e.target.value) });
            }}
          />
          <SliderField
            label="初速度X"
            value={Math.floor((editConfig.velocityX ?? 0)*100)/100}
            min="-300"
            max="300"
            step="1"
            onChange={(e) => {
              updateEditConfig({ velocityX: parseFloat(e.target.value) });
            }}
          />
          <SliderField
            label="初速度Y"
            value={Math.floor((editConfig.velocityY ?? 0)*100)/100}
            min="-300"
            max="300"
            step="1"
            onChange={(e) => {
              updateEditConfig({ velocityY: parseFloat(e.target.value) });
            }}
          />
        </>
      )}
      {(selectedObjectType === "line" || selectedObjectType === "curve") && (
        <SliderField
          label="幅"
          value={editConfig.width ?? 10}
          min="1"
          max="50"
          step="1"
          onChange={(e) => {
            updateEditConfig({ width: parseFloat(e.target.value) });
          }}
        />
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