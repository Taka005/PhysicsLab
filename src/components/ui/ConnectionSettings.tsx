import { useEngine } from "@/context/EngineContext";
import SelectField from "./SelectField";
import { useConnectionState } from "@/context/ConnectionContext";
import SliderField from "./SliderField";

export default function ConnectionSettings() {
  const engine = useEngine();
  const { connectionConfig, updateConnectionConfig } = useConnectionState();

  const shapeOptions = [
    { label: "動的接続", value: "dynamic" },
    { label: "固定接続", value: "static" },
  ];

  if (!engine) return null;

  return (
    <>
      <SelectField
        label="接続タイプ"
        value={connectionConfig.type}
        options={shapeOptions}
        onChange={(value) => {
          updateConnectionConfig({ type: value });
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