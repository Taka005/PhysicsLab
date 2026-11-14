import { useEngine } from "@/context/EngineContext";
import SliderField from "../ui/SliderField";
import { useSpawnState } from "@/context/SpawnContext";
import SelectField from "../ui/SelectField";
import ColorPicker from "../ui/ColorPicker";
import InputField from "../ui/InputField";
import { useScriptState } from "@/hooks/useScriptState";

export default function SpawnSettings() {
  const engine = useEngine();
  const { scripts } = useScriptState();
  const { spawnConfig, updateSpawnConfig } = useSpawnState();

  const ObjectOptions = [
    { label: "円", value: "circle" },
    { label: "直線", value: "line" },
    { label: "曲線", value: "curve" },
    { label: "加速器", value: "booster" },
  ];

  if (!engine) return null;

  return (
    <>
      <SelectField
        label="生成タイプ"
        value={spawnConfig.type}
        options={ObjectOptions}
        onChange={(value) => {
          updateSpawnConfig({ type: value });
        }}
      />
      <InputField
        label="ID"
        value={spawnConfig.id ?? ""}
        onChange={(e) => {
          updateSpawnConfig({ id: e.target.value });
        }}
        placeholder="(任意)"
        required={false}
      />
      {spawnConfig.type === "circle" && (
        <>
          <SliderField
            label="直径"
            value={spawnConfig.diameter ?? 15}
            min="1"
            max="100"
            step="1"
            help="値を小さくしすぎると高速時に貫通しやすくなります"
            onChange={(value) => {
              updateSpawnConfig({ diameter: value });
            }}
          />
          <SliderField
            label="質量"
            value={spawnConfig.mass ?? 10}
            min="0"
            max="100"
            step="1"
            help="値が大きくなるほど、衝突時に動きにくくなり、摩擦の影響が増えます"
            onChange={(value) => {
              updateSpawnConfig({ mass: value });
            }}
          />
          <SliderField
            label="剛性"
            value={spawnConfig.stiffness ?? 0.8}
            min="0.1"
            max="1"
            step="0.1"
            help="値が大きくなると物体が固くなり、衝突時に素早く干渉状態から戻ります"
            onChange={(value) => {
              updateSpawnConfig({ stiffness: value });
            }}
          />
          <SliderField
            label="初速度X"
            value={spawnConfig.velocityX ?? 0}
            min="-500"
            max="500"
            step="1"
            help="右方向が正の値になります"
            onChange={(value) => {
              updateSpawnConfig({ velocityX: value });
            }}
          />
          <SliderField
            label="初速度Y"
            value={spawnConfig.velocityY ?? 0}
            min="-500"
            max="500"
            step="1"
            help="下方向が正の値になります"
            onChange={(value) => {
              updateSpawnConfig({ velocityY: value });
            }}
          />
        </>
      )}
      {(spawnConfig.type === "line" || spawnConfig.type === "curve") && (
        <>
          <SliderField
            label="幅"
            value={spawnConfig.width ?? 10}
            min="1"
            max="50"
            step="1"
            help="値を小さくしすぎると高速物体が貫通しやすくなります"
            onChange={(value) => {
              updateSpawnConfig({ width: value });
            }}
          />
        </>
      )}
      {(spawnConfig.type === "booster") && (
        <>
          <SliderField
            label="初速度X"
            value={spawnConfig.velocityX ?? 0}
            min="-500"
            max="500"
            step="1"
            help="右方向が正の値になります"
            onChange={(value) => {
              updateSpawnConfig({ velocityX: value });
            }}
          />
          <SliderField
            label="初速度Y"
            value={spawnConfig.velocityY ?? 0}
            min="-500"
            max="500"
            step="1"
            help="下方向が正の値になります"
            onChange={(value) => {
              updateSpawnConfig({ velocityY: value });
            }}
          />
        </>
      )}
      <ColorPicker
        label="カラー"
        value={spawnConfig.color}
        onChange={(value) => {
          updateSpawnConfig({ color: value });
        }}
      />
      <SelectField
        label="スクリプト"
        value={spawnConfig.scriptId || ""}
        options={[{ label: "なし", value: ""},...scripts.map(script=>({ label: script.name, value: script.id }))]}
        onChange={(value) => {
          updateSpawnConfig({ scriptId: value !== "" ? value : null });
        }}
      />
    </>
  );
}