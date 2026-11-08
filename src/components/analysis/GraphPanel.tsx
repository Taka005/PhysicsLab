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
  const position = body.position;
  const velocity = body.velocity;

  return {
    time,
    positionX: position.x,
    positionY: position.y,
    velocityX: velocity.x,
    velocityY: velocity.y,
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
    let previousVelocity = initialBody instanceof BaseBody ? initialBody.velocity : null;

    return engine.subscribeSample((deltaTime) => {
      const currentBody = engine.getObject(body.id);
      if (!(currentBody instanceof BaseBody)) return;

      time += deltaTime;

      const currentVelocity = currentBody.velocity;
      const sample = getSample(currentBody, time);
      if (previousVelocity) {
        sample.accelerationX = (currentVelocity.x - previousVelocity.x) / deltaTime;
        sample.accelerationY = (currentVelocity.y - previousVelocity.y) / deltaTime;
      }
      previousVelocity = currentVelocity;

      setSamples((current) => [...current, sample].slice(-maxSamplesRef.current));
    });
  }, [body.id, engine, resetVersion]);

  const handleMaxSamplesChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextMaxSamples = Number(event.target.value);
    setMaxSamples(nextMaxSamples);
    setSamples((current) => current.slice(-nextMaxSamples));
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
    <div className="rounded-lg bg-white/55 p-3">
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
  );
}
