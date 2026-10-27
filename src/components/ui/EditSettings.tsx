import { useEngine } from "@/context/EngineContext";
import { useEngineState } from "@/hooks/useEngineState";
import SliderField from "./SliderField";
import { useEditState } from "@/context/EditContext";

export default function EditSettings() {
  const engine = useEngine();
  const state = useEngineState();
  const { selectedObjectId, editConfig, updateEditConfig } = useEditState();

  if (!engine||!state||!selectedObjectId) return null;

  return (
    <>
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
  );
}