"use client";

import { useEffect, useState } from "react";
import { Engine, BaseBody } from "@/lib/engine";
import { capitalize } from "@/lib/engine";
import { Graph } from "./Graph";

const MAX_SAMPLES = 600;

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

      setSamples((current) => [...current, sample].slice(-MAX_SAMPLES));
    });
  }, [body.id, engine]);

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
      <p className="mt-2 text-[10px] text-gray-500">
        {samples.length} / {MAX_SAMPLES}
      </p>
    </div>
  );
}
