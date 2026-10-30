import { useEngine } from "@/context/EngineContext";
import { useEngineState } from "@/hooks/useEngineState";
import SliderField from "./SliderField";
import { useEditState } from "@/context/EditContext";
import ColorPicker from "./ColorPicker";

export default function EditSettings() {
  const engine = useEngine();
  const state = useEngineState();
  const { selectedObjectId, editConfig, updateEditConfig, selectedObjectType } = useEditState();

  if (!engine||!state||!selectedObjectId) return null;

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
            label="剛性"
            value={editConfig.stiffness ?? 0.8}
            min="0.1"
            max="1"
            step="0.1"
            onChange={(e) => {
              updateEditConfig({ stiffness: parseFloat(e.target.value) });
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
    </>
  );
}