import { useEngine } from "@/context/EngineContext";
import { useEngineState } from "@/hooks/useEngineState";
import SelectField from "./SelectField";
import { useConnectionState } from "@/context/ConnectionContext";
import SliderField from "./SliderField";

export default function ConnectionSettings() {
  const engine = useEngine();
  const state = useEngineState();
  const { connectionConfig, updateConnectionConfig } = useConnectionState();

  const shapeOptions = [
    { label: "最小接続", value: "minimum" },
    { label: "動的接続", value: "dynamic" },
  ];

  if (!engine||!state) return null;

  return (
    <>
      <SelectField
        label="接続タイプ"
        value={connectionConfig.type}
        options={shapeOptions}
        onChange={(e) => {
          updateConnectionConfig({ type: e.target.value });
        }}
      />
      <SliderField
        label="剛性"
        value={connectionConfig.stiffness}
        min="0.1"
        max="1"
        step="0.1"
        onChange={(e) => {
          updateConnectionConfig({ stiffness: parseFloat(e.target.value) });
        }}
      />
    </>
  );
}