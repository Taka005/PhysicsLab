"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Engine, BaseBody } from "@/lib/engine";
import { capitalize } from "@/lib/engine";
import { Graph } from "./Graph";
import SliderField from "../ui/SliderField";

export type Sample = {
  time: number;
  positionX: number;
  positionY: number;
  velocityX: number;
  velocityY: number;
  accelerationX: number;
  accelerationY: number;
};

export type Series = {
  key: keyof Omit<Sample, "time">;
  label: string;
  color: string;
};

function getSample(body: BaseBody, time: number): Sample {
  return {
    time,
    positionX: body.position.x,
    positionY: body.position.y,
    velocityX: body.velocity.x,
    velocityY: body.velocity.y,
    accelerationX: 0,
    accelerationY: 0
  };
}

export default function GraphPanel({ engine, body }: { engine: Engine; body: BaseBody }) {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [maxSamples, setMaxSamples] = useState(600);
  const [resetVersion, setResetVersion] = useState(0);
  const maxSamplesRef = useRef(maxSamples);
  maxSamplesRef.current = maxSamples;

  useEffect(() => {
    let time = 0;
    const initialBody = engine.getObject(body.id);

    setSamples(initialBody instanceof BaseBody ? [getSample(initialBody, time)] : []);

    let preVelocity = initialBody instanceof BaseBody ? initialBody.velocity : null;

    return engine.subscribeSample((deltaTime) => {
      const currentBody = engine.getObject(body.id);

      if (!(currentBody instanceof BaseBody)) return;

      time += deltaTime;

      const currentVelocity = currentBody.velocity;
      const sample = getSample(currentBody, time);

      if (preVelocity) {
        sample.accelerationX = (currentVelocity.x - preVelocity.x) / deltaTime;
        sample.accelerationY = (currentVelocity.y - preVelocity.y) / deltaTime;
      }

      preVelocity = currentVelocity;

      setSamples((current) => [...current, sample].slice(-maxSamplesRef.current));
    });
  }, [body.id, engine, resetVersion]);

  const handleMaxSamplesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextMaxSamples = Number(event.target.value);
    setMaxSamples(nextMaxSamples);
    setSamples((current) => current.slice(-nextMaxSamples));
  };

  const handleExport = () => {
    const header = ["時間(秒)", "位置X", "位置Y", "速度X", "速度Y", "加速度X", "加速度Y"];

    const rows = samples.map((sample) => [
      sample.time,
      sample.positionX,
      sample.positionY,
      sample.velocityX,
      sample.velocityY,
      sample.accelerationX,
      sample.accelerationY
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "analysis.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const positionSeries: Series[] = [
    { key: "positionX", label: "X", color: "#2563eb" },
    { key: "positionY", label: "Y", color: "#ea580c" }
  ];

  const velocitySeries: Series[] = [
    { key: "velocityX", label: "X", color: "#2563eb" },
    { key: "velocityY", label: "Y", color: "#ea580c" }
  ];

  const accelerationSeries: Series[] = [
    { key: "accelerationX", label: "X", color: "#2563eb" },
    { key: "accelerationY", label: "Y", color: "#ea580c" }
  ];

  return (
    <div className="p-3">
      <p className="mb-2 truncate font-mono text-[10px] text-gray-500">
        {capitalize(body.type)} / {body.id}
      </p>
      <div className="flex flex-col gap-3">
        <Graph title="時間 - 位置" samples={samples} series={positionSeries} />
        <Graph title="時間 - 速度" samples={samples} series={velocitySeries} />
        <Graph title="時間 - 加速度" samples={samples} series={accelerationSeries} />
      </div>
      <div className="mt-3 flex flex-col gap-3 border-t border-gray-300/60 pt-3">
        <SliderField
          label="最大サンプル数"
          value={maxSamples}
          min="100"
          max="1000"
          step="100"
          onChange={handleMaxSamplesChange}
        />
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] text-gray-600">
            {samples.length} / {maxSamples}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded border border-gray-300/80 bg-white/70 px-2 py-1 text-xs text-gray-700 hover:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleExport}
              disabled={samples.length === 0}
            >
              CSV出力
            </button>
            <button
              type="button"
              className="rounded border border-gray-300/80 bg-white/70 px-2 py-1 text-xs text-gray-700 hover:bg-white focus:outline-none"
              onClick={() => setResetVersion((version) => version + 1)}
            >
              リセット
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
